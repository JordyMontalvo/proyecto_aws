'use client'

import { useState, useEffect } from 'react'
import { Camera, Download, Database, Clock, MapPin, Zap } from 'lucide-react'

interface Capture {
  id: string
  cameraId: string
  timestamp: string
  imageUrl: string
  size: number
  resolution: string
  format: string
  location: string
  status: string
  rdsInstance: string
  rdsStatus: string
}

interface CameraCaptureProps {
  onCapture?: (capture: Capture) => void
}

export default function CameraCapture({ onCapture }: CameraCaptureProps) {
  const [captures, setCaptures] = useState<Capture[]>([])
  const [loading, setLoading] = useState(false)
  const [capturing, setCapturing] = useState(false)
  const [rdsInfo, setRdsInfo] = useState<any>(null)

  const fetchCaptures = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/camera-capture')
      const result = await response.json()
      
      if (result.success) {
        setCaptures(result.data.captures)
        setRdsInfo(result.data.rdsInfo)
      }
    } catch (error) {
      console.error('Error fetching captures:', error)
    } finally {
      setLoading(false)
    }
  }

  const captureImage = async () => {
    try {
      setCapturing(true)
      const response = await fetch('/api/camera-capture', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cameraId: 'camera_1',
          timestamp: new Date().toISOString()
        })
      })
      
      const result = await response.json()
      
      if (result.success) {
        setCaptures(prev => [result.data, ...prev])
        onCapture?.(result.data)
        
        // Mostrar notificación de éxito
        const notification = document.createElement('div')
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50'
        notification.textContent = '¡Captura almacenada en RDS!'
        document.body.appendChild(notification)
        
        setTimeout(() => {
          document.body.removeChild(notification)
        }, 3000)
      }
    } catch (error) {
      console.error('Error capturing image:', error)
    } finally {
      setCapturing(false)
    }
  }

  useEffect(() => {
    fetchCaptures()
  }, [])

  const formatFileSize = (bytes: number) => {
    return (bytes / 1024).toFixed(1) + ' KB'
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900 flex items-center">
          <Camera className="h-6 w-6 mr-3 text-blue-600" />
          Sistema de Cámaras
        </h3>
        
        {/* Información de RDS */}
        {rdsInfo && (
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center">
              <Database className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-gray-600">RDS:</span>
              <span className="ml-1 font-semibold text-green-600">{rdsInfo.status}</span>
            </div>
            <div className="flex items-center">
              <span className="text-gray-600">Motor:</span>
              <span className="ml-1 font-semibold">{rdsInfo.engine}</span>
            </div>
          </div>
        )}
      </div>

      {/* Botón de captura */}
      <div className="mb-6">
        <button
          onClick={captureImage}
          disabled={capturing}
          className="btn-primary flex items-center space-x-2"
        >
          <Camera className="h-5 w-5" />
          <span>{capturing ? 'Capturando...' : 'Capturar Imagen'}</span>
          {capturing && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
        </button>
        
        <p className="text-sm text-gray-600 mt-2">
          Las capturas se almacenan automáticamente en la base de datos RDS
        </p>
      </div>

      {/* Lista de capturas */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-gray-700">Capturas Recientes</h4>
          <button
            onClick={fetchCaptures}
            disabled={loading}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            {loading ? 'Actualizando...' : 'Actualizar'}
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Cargando capturas...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {captures.map((capture) => (
              <div key={capture.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={capture.imageUrl}
                    alt={`Captura ${capture.id}`}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                    {capture.resolution}
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">
                      Cámara {capture.cameraId}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatFileSize(capture.size)}
                    </span>
                  </div>
                  
                  <div className="space-y-1 text-sm text-gray-600">
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
                      <span className="text-xs">RDS: {capture.rdsInstance}</span>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex space-x-2">
                    <button
                      onClick={() => window.open(capture.imageUrl, '_blank')}
                      className="flex-1 bg-blue-100 text-blue-700 px-3 py-1 rounded text-xs font-medium hover:bg-blue-200 transition-colors"
                    >
                      Ver
                    </button>
                    <button
                      onClick={() => {
                        const link = document.createElement('a')
                        link.href = capture.imageUrl
                        link.download = `capture_${capture.id}.jpg`
                        link.click()
                      }}
                      className="flex-1 bg-green-100 text-green-700 px-3 py-1 rounded text-xs font-medium hover:bg-green-200 transition-colors"
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

        {captures.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500">
            <Camera className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No hay capturas disponibles</p>
            <p className="text-sm">Haz clic en "Capturar Imagen" para comenzar</p>
          </div>
        )}
      </div>
    </div>
  )
}
