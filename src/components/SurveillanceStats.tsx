'use client'

import { useState, useEffect } from 'react'
import { Camera, Video, Database, Clock, TrendingUp, Shield, Activity } from 'lucide-react'

interface CaptureStats {
  totalImages: number
  totalVideos: number
  totalSize: number
  lastCapture: string | null
  capturesToday: number
  avgFileSize: number
}

interface SurveillanceStatsProps {
  captures: any[]
}

export default function SurveillanceStats({ captures }: SurveillanceStatsProps) {
  const [stats, setStats] = useState<CaptureStats>({
    totalImages: 0,
    totalVideos: 0,
    totalSize: 0,
    lastCapture: null,
    capturesToday: 0,
    avgFileSize: 0
  })

  useEffect(() => {
    if (captures.length === 0) return

    const images = captures.filter(c => c.type === 'image')
    const videos = captures.filter(c => c.type === 'video')
    const totalSize = captures.reduce((sum, c) => sum + c.size, 0)
    
    const today = new Date().toDateString()
    const capturesToday = captures.filter(c => 
      new Date(c.timestamp).toDateString() === today
    ).length

    const lastCapture = captures.length > 0 ? captures[0].timestamp : null

    setStats({
      totalImages: images.length,
      totalVideos: videos.length,
      totalSize,
      lastCapture,
      capturesToday,
      avgFileSize: captures.length > 0 ? totalSize / captures.length : 0
    })
  }, [captures])

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const captureTime = new Date(timestamp)
    const diffMs = now.getTime() - captureTime.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return 'Hace un momento'
    if (diffMins < 60) return `Hace ${diffMins} min`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `Hace ${diffHours}h`
    const diffDays = Math.floor(diffHours / 24)
    return `Hace ${diffDays} días`
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-slate-800 flex items-center">
          <Shield className="h-6 w-6 mr-3 text-blue-500" />
          Estadísticas de Vigilancia
        </h3>
        <div className="flex items-center text-sm text-slate-600">
          <Activity className="h-4 w-4 mr-1" />
          Sistema Activo
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {/* Total de Imágenes */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Imágenes</p>
              <p className="text-2xl font-bold text-blue-800">{stats.totalImages}</p>
            </div>
            <Camera className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        {/* Total de Videos */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Videos</p>
              <p className="text-2xl font-bold text-green-800">{stats.totalVideos}</p>
            </div>
            <Video className="h-8 w-8 text-green-500" />
          </div>
        </div>

        {/* Capturas Hoy */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Hoy</p>
              <p className="text-2xl font-bold text-purple-800">{stats.capturesToday}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        {/* Tamaño Total */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">Almacenamiento</p>
              <p className="text-lg font-bold text-orange-800">{formatFileSize(stats.totalSize)}</p>
            </div>
            <Database className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Información Adicional */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
          <h4 className="font-semibold text-slate-700 mb-2 flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            Última Captura
          </h4>
          {stats.lastCapture ? (
            <div>
              <p className="text-slate-600">{formatTimeAgo(stats.lastCapture)}</p>
              <p className="text-sm text-slate-500">
                {new Date(stats.lastCapture).toLocaleString('es-ES')}
              </p>
            </div>
          ) : (
            <p className="text-slate-500">No hay capturas</p>
          )}
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
          <h4 className="font-semibold text-slate-700 mb-2 flex items-center">
            <Database className="h-4 w-4 mr-2" />
            Tamaño Promedio
          </h4>
          <p className="text-slate-600">{formatFileSize(stats.avgFileSize)}</p>
          <p className="text-sm text-slate-500">Por archivo</p>
        </div>
      </div>

      {/* Estado del Sistema */}
      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></div>
            <div>
              <p className="font-semibold text-green-800">Sistema de Vigilancia Activo</p>
              <p className="text-sm text-green-600">
                Cámara conectada y lista para capturas
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-green-600">Estado: Online</p>
            <p className="text-xs text-green-500">RDS: Conectado</p>
          </div>
        </div>
      </div>
    </div>
  )
}
