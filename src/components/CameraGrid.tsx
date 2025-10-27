'use client'

import { useState } from 'react'
import { Grid, List, Settings, Plus, Eye } from 'lucide-react'
import SecurityCamera from './SecurityCamera'

interface Camera {
  id: string
  name: string
  isActive: boolean
  location: string
}

export default function CameraGrid() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [cameras] = useState<Camera[]>([
    { id: 'CAM-001', name: 'Cámara Principal', isActive: true, location: 'Entrada Principal' },
    { id: 'CAM-002', name: 'Cámara Trasera', isActive: true, location: 'Patio Trasero' },
    { id: 'CAM-003', name: 'Cámara Lateral', isActive: false, location: 'Jardín Lateral' },
    { id: 'CAM-004', name: 'Cámara Interior', isActive: true, location: 'Sala Principal' },
  ])

  const activeCameras = cameras.filter(cam => cam.isActive).length
  const totalCameras = cameras.length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Eye className="h-6 w-6 mr-2 text-blue-600" />
            Sistema de Cámaras de Seguridad
          </h2>
          <p className="text-gray-600 mt-1">
            {activeCameras}/{totalCameras} cámaras activas • Monitoreo en tiempo real
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
              }`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
          
          <button className="btn-secondary flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Configurar</span>
          </button>
          
          <button className="btn-primary flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Agregar Cámara</span>
          </button>
        </div>
      </div>

      {/* Camera Grid */}
      <div className={`${
        viewMode === 'grid' 
          ? 'grid grid-cols-1 lg:grid-cols-2 gap-6' 
          : 'space-y-4'
      }`}>
        {cameras.map((camera) => (
          <SecurityCamera
            key={camera.id}
            cameraId={camera.id}
            cameraName={camera.name}
            isActive={camera.isActive}
          />
        ))}
      </div>

      {/* Camera Status Summary */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen del Sistema</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{activeCameras}</div>
            <div className="text-sm text-green-700">Cámaras Activas</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{totalCameras - activeCameras}</div>
            <div className="text-sm text-red-700">Cámaras Inactivas</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{Math.round((activeCameras / totalCameras) * 100)}%</div>
            <div className="text-sm text-blue-700">Cobertura</div>
          </div>
        </div>
      </div>
    </div>
  )
}
