'use client'

import { useState, useEffect } from 'react'
import { Camera, Video, Play, Pause, Square, RotateCcw, Settings, Eye, Shield } from 'lucide-react'

interface CameraFeed {
  id: string
  name: string
  location: string
  status: 'online' | 'offline' | 'recording'
  lastActivity: string
  isRecording: boolean
}

export default function SurveillanceDemo() {
  const [cameras, setCameras] = useState<CameraFeed[]>([
    {
      id: 'cam_1',
      name: 'Cámara Principal',
      location: 'Entrada Principal',
      status: 'online',
      lastActivity: new Date().toISOString(),
      isRecording: false
    },
    {
      id: 'cam_2',
      name: 'Cámara Trasera',
      location: 'Patio Trasero',
      status: 'online',
      lastActivity: new Date().toISOString(),
      isRecording: false
    },
    {
      id: 'cam_3',
      name: 'Cámara Estacionamiento',
      location: 'Estacionamiento',
      status: 'offline',
      lastActivity: new Date(Date.now() - 300000).toISOString(),
      isRecording: false
    },
    {
      id: 'cam_4',
      name: 'Cámara Recepción',
      location: 'Recepción',
      status: 'recording',
      lastActivity: new Date().toISOString(),
      isRecording: true
    }
  ])

  const [selectedCamera, setSelectedCamera] = useState<string>('cam_1')
  const [isDemoMode, setIsDemoMode] = useState(true)

  // Simular actividad de cámaras
  useEffect(() => {
    if (!isDemoMode) return

    const interval = setInterval(() => {
      setCameras(prev => prev.map(camera => {
        if (camera.status === 'offline') return camera
        
        return {
          ...camera,
          lastActivity: new Date().toISOString(),
          status: Math.random() > 0.9 ? 'recording' : 'online'
        }
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [isDemoMode])

  const toggleRecording = (cameraId: string) => {
    setCameras(prev => prev.map(camera => 
      camera.id === cameraId 
        ? { 
            ...camera, 
            isRecording: !camera.isRecording,
            status: !camera.isRecording ? 'recording' : 'online'
          }
        : camera
    ))
  }

  const toggleCameraStatus = (cameraId: string) => {
    setCameras(prev => prev.map(camera => 
      camera.id === cameraId 
        ? { 
            ...camera, 
            status: camera.status === 'offline' ? 'online' : 'offline',
            isRecording: false
          }
        : camera
    ))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500'
      case 'recording': return 'bg-red-500'
      case 'offline': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'En Línea'
      case 'recording': return 'Grabando'
      case 'offline': return 'Desconectada'
      default: return 'Desconocido'
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const activityTime = new Date(timestamp)
    const diffMs = now.getTime() - activityTime.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return 'Ahora'
    if (diffMins < 60) return `Hace ${diffMins} min`
    const diffHours = Math.floor(diffMins / 60)
    return `Hace ${diffHours}h`
  }

  const selectedCameraData = cameras.find(c => c.id === selectedCamera)

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-slate-800 flex items-center">
          <Eye className="h-6 w-6 mr-3 text-blue-500" />
          Sistema de Vigilancia Multi-Cámara
        </h3>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-sm">
            <div className={`w-3 h-3 rounded-full mr-2 ${isDemoMode ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            <span className="text-slate-600">
              {isDemoMode ? 'Modo Demo' : 'Modo Real'}
            </span>
          </div>
          
          <button
            onClick={() => setIsDemoMode(!isDemoMode)}
            className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-sm hover:bg-blue-100 transition-colors"
          >
            {isDemoMode ? 'Desactivar Demo' : 'Activar Demo'}
          </button>
        </div>
      </div>

      {/* Grid de Cámaras */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {cameras.map((camera) => (
          <div
            key={camera.id}
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
              selectedCamera === camera.id 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-slate-200 hover:border-slate-300'
            }`}
            onClick={() => setSelectedCamera(camera.id)}
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-slate-800 text-sm">{camera.name}</h4>
              <div className={`w-2 h-2 rounded-full ${getStatusColor(camera.status)}`}></div>
            </div>
            
            <p className="text-xs text-slate-600 mb-2">{camera.location}</p>
            
            <div className="flex items-center justify-between">
              <span className={`text-xs px-2 py-1 rounded ${
                camera.status === 'online' ? 'bg-green-100 text-green-700' :
                camera.status === 'recording' ? 'bg-red-100 text-red-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {getStatusText(camera.status)}
              </span>
              
              <div className="flex space-x-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleRecording(camera.id)
                  }}
                  disabled={camera.status === 'offline'}
                  className={`p-1 rounded text-xs ${
                    camera.isRecording 
                      ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                      : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                  } disabled:bg-gray-100 disabled:text-gray-400`}
                >
                  {camera.isRecording ? <Square className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleCameraStatus(camera.id)
                  }}
                  className="p-1 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded text-xs"
                >
                  <RotateCcw className="h-3 w-3" />
                </button>
              </div>
            </div>
            
            <p className="text-xs text-slate-500 mt-2">
              Última actividad: {formatTimeAgo(camera.lastActivity)}
            </p>
          </div>
        ))}
      </div>

      {/* Vista Principal de Cámara Seleccionada */}
      <div className="mb-6">
        <div className="bg-black rounded-lg overflow-hidden relative">
          <div className="w-full h-64 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
            {selectedCameraData?.status === 'offline' ? (
              <div className="text-center text-white">
                <Camera className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-lg font-semibold">Cámara Desconectada</p>
                <p className="text-sm opacity-75">{selectedCameraData.name}</p>
              </div>
            ) : (
              <div className="text-center text-white">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera className="h-8 w-8" />
                </div>
                <p className="text-lg font-semibold">{selectedCameraData?.name}</p>
                <p className="text-sm opacity-75">{selectedCameraData?.location}</p>
                {selectedCameraData?.isRecording && (
                  <div className="mt-2 flex items-center justify-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                    <span className="text-red-400 text-sm">GRABANDO</span>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Overlay de información */}
          <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
            {selectedCameraData?.name} • {selectedCameraData?.resolution || '1280x720'}
          </div>
          
          {selectedCameraData?.isRecording && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs flex items-center">
              <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></div>
              REC
            </div>
          )}
        </div>
      </div>

      {/* Controles de la Cámara Seleccionada */}
      {selectedCameraData && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
          <h4 className="font-semibold text-slate-700 mb-3 flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            Controles - {selectedCameraData.name}
          </h4>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => toggleRecording(selectedCameraData.id)}
              disabled={selectedCameraData.status === 'offline'}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                selectedCameraData.isRecording
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              } disabled:bg-gray-300 disabled:text-gray-500`}
            >
              {selectedCameraData.isRecording ? (
                <>
                  <Square className="h-4 w-4" />
                  <span>Detener Grabación</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  <span>Iniciar Grabación</span>
                </>
              )}
            </button>
            
            <button
              onClick={() => toggleCameraStatus(selectedCameraData.id)}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <RotateCcw className="h-4 w-4" />
              <span>
                {selectedCameraData.status === 'offline' ? 'Conectar' : 'Desconectar'}
              </span>
            </button>
            
            <button
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <Camera className="h-4 w-4" />
              <span>Capturar Imagen</span>
            </button>
          </div>
          
          <div className="mt-3 text-sm text-slate-600">
            <p><strong>Ubicación:</strong> {selectedCameraData.location}</p>
            <p><strong>Estado:</strong> {getStatusText(selectedCameraData.status)}</p>
            <p><strong>Última Actividad:</strong> {formatTimeAgo(selectedCameraData.lastActivity)}</p>
          </div>
        </div>
      )}

      {/* Resumen del Sistema */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-green-800">
            {cameras.filter(c => c.status === 'online').length}
          </div>
          <div className="text-sm text-green-600">Cámaras Activas</div>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-red-800">
            {cameras.filter(c => c.isRecording).length}
          </div>
          <div className="text-sm text-red-600">Grabando</div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-blue-800">
            {cameras.length}
          </div>
          <div className="text-sm text-blue-600">Total Cámaras</div>
        </div>
      </div>
    </div>
  )
}
