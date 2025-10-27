'use client'

import { useState, useRef, useEffect } from 'react'
import { Camera, Video, Square, Download, RotateCcw, Settings } from 'lucide-react'

interface SecurityCameraProps {
  cameraId: string
  cameraName: string
  isActive: boolean
}

export default function SecurityCamera({ cameraId, cameraName, isActive }: SecurityCameraProps) {
  const [isStreaming, setIsStreaming] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const startCamera = async () => {
    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        },
        audio: false
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setIsStreaming(true)
      }
    } catch (err) {
      setError('No se pudo acceder a la cámara. Verifica los permisos.')
      console.error('Error accessing camera:', err)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setIsStreaming(false)
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      const context = canvas.getContext('2d')
      
      if (context) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0)
        
        const imageData = canvas.toDataURL('image/jpeg', 0.8)
        setCapturedImage(imageData)
        
        // Simular envío a AWS S3
        console.log(`Foto capturada desde ${cameraName} - Enviando a S3...`)
      }
    }
  }

  const downloadPhoto = () => {
    if (capturedImage) {
      const link = document.createElement('a')
      link.download = `vigila-camera-${cameraId}-${Date.now()}.jpg`
      link.href = capturedImage
      link.click()
    }
  }

  const resetCamera = () => {
    setCapturedImage(null)
    setError(null)
  }

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  return (
    <div className="card-dark">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
          <h3 className="text-lg font-semibold text-white">{cameraName}</h3>
          <span className="text-sm text-gray-400">ID: {cameraId}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Settings className="h-4 w-4 text-gray-400" />
          <span className={`text-xs px-2 py-1 rounded-full ${
            isActive ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
          }`}>
            {isActive ? 'Activa' : 'Inactiva'}
          </span>
        </div>
      </div>

      <div className="camera-feed mb-4">
        {isStreaming ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-64 object-cover"
          />
        ) : (
          <div className="w-full h-64 bg-gray-900 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <Camera className="h-12 w-12 mx-auto mb-2" />
              <p>Cámara no activa</p>
              <p className="text-sm">Haz clic en "Iniciar" para comenzar</p>
            </div>
          </div>
        )}
        
        {capturedImage && (
          <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
            <div className="text-center text-white">
              <p className="mb-2">¡Foto capturada!</p>
              <button
                onClick={downloadPhoto}
                className="btn-primary text-sm"
              >
                <Download className="h-4 w-4 mr-1" />
                Descargar
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="camera-controls">
        {!isStreaming ? (
          <button
            onClick={startCamera}
            className="btn-primary flex items-center space-x-2"
          >
            <Video className="h-4 w-4" />
            <span>Iniciar Cámara</span>
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={capturePhoto}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Camera className="h-4 w-4" />
              <span>Capturar</span>
            </button>
            <button
              onClick={stopCamera}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Square className="h-4 w-4" />
              <span>Detener</span>
            </button>
            <button
              onClick={resetCamera}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reset</span>
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-900/50 border border-red-700 rounded-lg">
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      {capturedImage && (
        <div className="mt-4">
          <img
            src={capturedImage}
            alt="Captured"
            className="w-full h-32 object-cover rounded-lg"
          />
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
