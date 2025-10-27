'use client'

import { useState, useRef, useEffect } from 'react'
import { Camera, Video, Download, Database, Clock, MapPin, Zap, Play, Square, RotateCcw, Settings } from 'lucide-react'
import SurveillanceStats from './SurveillanceStats'

interface Capture {
  id: string
  cameraId: string
  timestamp: string
  imageUrl: string
  videoUrl?: string
  size: number
  resolution: string
  format: string
  location: string
  status: string
  rdsInstance: string
  rdsStatus: string
  type: 'image' | 'video'
}

interface RealCameraCaptureProps {
  onCapture?: (capture: Capture) => void
}

function RealCameraCapture({ onCapture }: RealCameraCaptureProps) {
  const [captures, setCaptures] = useState<Capture[]>([])
  const [loading, setLoading] = useState(false)
  const [capturing, setCapturing] = useState(false)
  const [recording, setRecording] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [cameraSettings, setCameraSettings] = useState({
    resolution: '1280x720',
    quality: 0.8,
    facingMode: 'user' as 'user' | 'environment'
  })
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  // Inicializar cámara
  const initializeCamera = async () => {
    try {
      setError(null)
      const constraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: cameraSettings.facingMode
        },
        audio: true
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
      setStream(mediaStream)
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (err) {
      console.error('Error accessing camera:', err)
      setError('No se pudo acceder a la cámara. Verifica los permisos.')
    }
  }

  // Detener cámara
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
  }

  // Capturar imagen
  const captureImage = async () => {
    if (!videoRef.current || !canvasRef.current) return

    try {
      setCapturing(true)
      
      const video = videoRef.current
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      
      if (!ctx) return

      // Configurar canvas con la resolución deseada
      const [width, height] = cameraSettings.resolution.split('x').map(Number)
      canvas.width = width
      canvas.height = height
      
      // Dibujar el frame actual del video en el canvas
      ctx.drawImage(video, 0, 0, width, height)
      
      // Convertir a blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob)
        }, 'image/jpeg', cameraSettings.quality)
      })

      // Crear URL para la imagen
      const imageUrl = URL.createObjectURL(blob)
      
      // Crear datos de captura
      const captureData: Capture = {
        id: `capture_${Date.now()}`,
        cameraId: 'real_camera',
        timestamp: new Date().toISOString(),
        imageUrl,
        size: blob.size,
        resolution: cameraSettings.resolution,
        format: 'JPEG',
        location: 'Cámara del Usuario',
        status: 'captured',
        rdsInstance: 'demo-rds',
        rdsStatus: 'available',
        type: 'image'
      }

      // Subir a S3
      try {
        setUploading(true)
        setUploadProgress(0)
        
        const formData = new FormData()
        formData.append('file', blob, `capture_${captureData.id}.jpg`)
        formData.append('type', 'image')
        formData.append('metadata', JSON.stringify({
          resolution: cameraSettings.resolution,
          quality: cameraSettings.quality,
          facingMode: cameraSettings.facingMode
        }))

        // Simular progreso de subida
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => Math.min(prev + 10, 90))
        }, 200)

        const response = await fetch('/api/s3-upload', {
          method: 'POST',
          body: formData
        })

        clearInterval(progressInterval)
        setUploadProgress(100)

        const result = await response.json()
        if (result.success) {
          // Actualizar la captura con la URL de S3
          captureData.imageUrl = result.data.fileUrl
          captureData.status = 'uploaded_to_s3'
          console.log('Captura subida a S3:', result.message)
        }
      } catch (apiError) {
        console.warn('Error subiendo a S3 (captura guardada localmente):', apiError)
        captureData.status = 'local_only'
      } finally {
        setUploading(false)
        setUploadProgress(0)
      }

      // Agregar a la lista de capturas
      setCaptures(prev => [captureData, ...prev])
      onCapture?.(captureData)

      // Mostrar notificación
      showNotification('¡Imagen capturada y procesada!', 'success')

    } catch (err) {
      console.error('Error capturing image:', err)
      showNotification('Error al capturar imagen', 'error')
    } finally {
      setCapturing(false)
    }
  }

  // Iniciar grabación de video
  const startRecording = () => {
    if (!stream) return

    try {
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9'
      })
      
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' })
        const videoUrl = URL.createObjectURL(blob)
        
        const captureData: Capture = {
          id: `video_${Date.now()}`,
          cameraId: 'real_camera',
          timestamp: new Date().toISOString(),
          imageUrl: videoUrl, // Usamos imageUrl para compatibilidad
          videoUrl,
          size: blob.size,
          resolution: cameraSettings.resolution,
          format: 'WEBM',
          location: 'Cámara del Usuario',
          status: 'recorded',
          rdsInstance: 'demo-rds',
          rdsStatus: 'available',
          type: 'video'
        }

        // Subir video a S3
        try {
          setUploading(true)
          setUploadProgress(0)
          
          const formData = new FormData()
          formData.append('file', blob, `video_${captureData.id}.webm`)
          formData.append('type', 'video')
          formData.append('metadata', JSON.stringify({
            resolution: cameraSettings.resolution,
            duration: chunksRef.current.length,
            facingMode: cameraSettings.facingMode
          }))

          // Simular progreso de subida
          const progressInterval = setInterval(() => {
            setUploadProgress(prev => Math.min(prev + 5, 90))
          }, 300)

          const response = await fetch('/api/s3-upload', {
            method: 'POST',
            body: formData
          })

          clearInterval(progressInterval)
          setUploadProgress(100)

          const result = await response.json()
          if (result.success) {
            // Actualizar la captura con la URL de S3
            captureData.imageUrl = result.data.fileUrl
            captureData.videoUrl = result.data.fileUrl
            captureData.status = 'uploaded_to_s3'
            console.log('Video subido a S3:', result.message)
          }
        } catch (apiError) {
          console.warn('Error subiendo video a S3 (video guardado localmente):', apiError)
          captureData.status = 'local_only'
        } finally {
          setUploading(false)
          setUploadProgress(0)
        }

        setCaptures(prev => [captureData, ...prev])
        onCapture?.(captureData)
        showNotification('¡Video grabado y procesado!', 'success')
      }

      mediaRecorder.start()
      setRecording(true)

    } catch (err) {
      console.error('Error starting recording:', err)
      showNotification('Error al iniciar grabación', 'error')
    }
  }

  // Detener grabación de video
  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop()
      setRecording(false)
    }
  }

  // Mostrar notificación
  const showNotification = (message: string, type: 'success' | 'error') => {
    const notification = document.createElement('div')
    notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
      type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    }`
    notification.textContent = message
    document.body.appendChild(notification)
    
    setTimeout(() => {
      document.body.removeChild(notification)
    }, 3000)
  }

  // Formatear tamaño de archivo
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  // Cambiar cámara frontal/trasera
  const toggleCamera = () => {
    setCameraSettings(prev => ({
      ...prev,
      facingMode: prev.facingMode === 'user' ? 'environment' : 'user'
    }))
  }

  useEffect(() => {
    initializeCamera()
    return () => stopCamera()
  }, [cameraSettings.facingMode])

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-slate-800 flex items-center">
          <Camera className="h-6 w-6 mr-3 text-blue-500" />
          Sistema de Vigilancia en Vivo
        </h3>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleCamera}
            className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
            title="Cambiar cámara"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <div className="text-sm text-slate-600">
            {cameraSettings.facingMode === 'user' ? 'Frontal' : 'Trasera'}
          </div>
        </div>
      </div>

      {/* Vista previa de la cámara */}
      <div className="mb-6">
        <div className="relative bg-black rounded-lg overflow-hidden">
          {stream ? (
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-64 object-cover"
            />
          ) : (
            <div className="w-full h-64 flex items-center justify-center text-white">
              <div className="text-center">
                <Camera className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Cámara no disponible</p>
                <button
                  onClick={initializeCamera}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Inicializar Cámara
                </button>
              </div>
            </div>
          )}
          
          {/* Overlay de información */}
          {stream && (
            <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
              {cameraSettings.resolution} • {cameraSettings.facingMode === 'user' ? 'Frontal' : 'Trasera'}
            </div>
          )}
          
          {/* Indicador de grabación */}
          {recording && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs flex items-center">
              <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></div>
              GRABANDO
            </div>
          )}
        </div>

        {error && (
          <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}
      </div>

      {/* Controles de captura */}
      <div className="mb-6">
        <div className="flex space-x-4">
          <button
            onClick={captureImage}
            disabled={!stream || capturing}
            className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
          >
            <Camera className="h-5 w-5" />
            <span>{capturing ? 'Capturando...' : 'Capturar Imagen'}</span>
            {capturing && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
          </button>

          <button
            onClick={recording ? stopRecording : startRecording}
            disabled={!stream}
            className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
              recording 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {recording ? (
              <>
                <Square className="h-5 w-5" />
                <span>Detener Video</span>
              </>
            ) : (
              <>
                <Video className="h-5 w-5" />
                <span>Grabar Video</span>
              </>
            )}
          </button>
        </div>
        
        <p className="text-sm text-slate-600 mt-2">
          Las capturas se procesan automáticamente. En modo demo se almacenan localmente.
        </p>
        
        {/* Indicador de progreso de subida */}
        {uploading && (
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-700">Subiendo a S3...</span>
              <span className="text-sm text-blue-600">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Lista de capturas */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-slate-700">Capturas Recientes</h4>
          <div className="text-sm text-slate-600">
            {captures.length} capturas
          </div>
        </div>

        {captures.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <Camera className="h-12 w-12 mx-auto mb-4 text-slate-300" />
            <p>No hay capturas disponibles</p>
            <p className="text-sm">Usa los controles arriba para capturar imágenes o videos</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {captures.map((capture) => (
              <div key={capture.id} className="border border-slate-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  {capture.type === 'video' ? (
                    <video
                      src={capture.videoUrl || capture.imageUrl}
                      className="w-full h-48 object-cover"
                      controls
                    />
                  ) : (
                    <img
                      src={capture.imageUrl}
                      alt={`Captura ${capture.id}`}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                    {capture.resolution}
                  </div>
                  <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs">
                    {capture.type === 'video' ? 'VIDEO' : 'IMAGEN'}
                  </div>
                  <div className={`absolute bottom-2 left-2 px-2 py-1 rounded text-xs ${
                    capture.status === 'uploaded_to_s3' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-yellow-500 text-white'
                  }`}>
                    {capture.status === 'uploaded_to_s3' ? 'S3' : 'LOCAL'}
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-slate-800">
                      {capture.type === 'video' ? 'Video' : 'Imagen'} {capture.id.split('_')[1]}
                    </span>
                    <span className="text-xs text-slate-500">
                      {formatFileSize(capture.size)}
                    </span>
                  </div>
                  
                  <div className="space-y-1 text-sm text-slate-600">
                    <div className="flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>{capture.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{new Date(capture.timestamp).toLocaleString('es-ES')}</span>
                    </div>
                    <div className="flex items-center">
                      <Database className="h-3 w-3 mr-1" />
                      <span className="text-xs">Formato: {capture.format}</span>
                    </div>
                    <div className="flex items-center">
                      <span className={`text-xs px-2 py-1 rounded ${
                        capture.status === 'uploaded_to_s3' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {capture.status === 'uploaded_to_s3' ? '✓ Almacenado en S3' : '⚠ Solo local'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex space-x-2">
                    <button
                      onClick={() => window.open(capture.imageUrl, '_blank')}
                      className="flex-1 bg-blue-50 text-blue-700 px-3 py-1 rounded text-xs font-medium hover:bg-blue-100 transition-colors"
                    >
                      Ver
                    </button>
                    <button
                      onClick={() => {
                        const link = document.createElement('a')
                        link.href = capture.imageUrl
                        link.download = `${capture.type}_${capture.id}.${capture.format.toLowerCase()}`
                        link.click()
                      }}
                      className="flex-1 bg-green-50 text-green-700 px-3 py-1 rounded text-xs font-medium hover:bg-green-100 transition-colors"
                    >
                      <Download className="h-3 w-3 inline mr-1" />
                      Descargar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Canvas oculto para captura */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Estadísticas de Vigilancia */}
      <div className="mt-8">
        <SurveillanceStats captures={captures} />
      </div>
    </div>
  )
}

export default RealCameraCapture
