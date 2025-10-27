'use client'

import { useState, useEffect } from 'react'
import { 
  Map, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  Activity,
  Clock,
  MapPin,
  AlertTriangle,
  Shield,
  Zap
} from 'lucide-react'

interface AlertHeatmapData {
  location: string
  alertCount: number
  criticalCount: number
  lastAlert: string
  coordinates: { x: number; y: number }
}

interface AlertTrend {
  hour: number
  count: number
  critical: number
}

function AlertAnalytics() {
  const [heatmapData, setHeatmapData] = useState<AlertHeatmapData[]>([])
  const [trendData, setTrendData] = useState<AlertTrend[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    generateAnalyticsData()
  }, [])

  const generateAnalyticsData = () => {
    setIsLoading(true)

    // Generar datos de mapa de calor
    const locations = [
      { name: 'Entrada Principal', x: 20, y: 30 },
      { name: 'Patio Trasero', x: 70, y: 60 },
      { name: 'Estacionamiento', x: 40, y: 80 },
      { name: 'Recepción', x: 50, y: 20 },
      { name: 'Cocina', x: 30, y: 50 },
      { name: 'Oficina', x: 80, y: 40 }
    ]

    const heatmap = locations.map(location => ({
      location: location.name,
      alertCount: Math.floor(Math.random() * 20) + 1,
      criticalCount: Math.floor(Math.random() * 5),
      lastAlert: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      coordinates: { x: location.x, y: location.y }
    }))

    // Generar datos de tendencias por hora
    const trends = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      count: Math.floor(Math.random() * 10) + (hour >= 8 && hour <= 18 ? 5 : 2),
      critical: Math.floor(Math.random() * 3)
    }))

    setHeatmapData(heatmap)
    setTrendData(trends)
    setIsLoading(false)
  }

  const getHeatmapIntensity = (count: number) => {
    if (count >= 15) return 'bg-red-500'
    if (count >= 10) return 'bg-orange-500'
    if (count >= 5) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getHeatmapOpacity = (count: number) => {
    return Math.min(0.3 + (count / 20) * 0.7, 1)
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const alertTime = new Date(timestamp)
    const diffMs = now.getTime() - alertTime.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 60) return `${diffMins}m`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h`
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays}d`
  }

  if (isLoading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-slate-600">Cargando analytics...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-slate-800 flex items-center">
          <BarChart3 className="h-6 w-6 mr-3 text-blue-500" />
          Analytics de Alertas
        </h3>
        
        <button
          onClick={generateAnalyticsData}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
        >
          <Zap className="h-4 w-4" />
          <span>Actualizar</span>
        </button>
      </div>

      {/* Mapa de Calor de Alertas */}
      <div className="mb-8">
        <h4 className="font-semibold text-slate-700 mb-4 flex items-center">
          <Map className="h-4 w-4 mr-2" />
          Mapa de Calor de Alertas
        </h4>
        
        <div className="relative bg-slate-100 rounded-lg p-6 h-64">
          {/* Grid de fondo */}
          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%" className="absolute inset-0">
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#cbd5e1" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Puntos de calor */}
          {heatmapData.map((data, index) => (
            <div
              key={index}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${data.coordinates.x}%`,
                top: `${data.coordinates.y}%`
              }}
            >
              <div
                className={`w-8 h-8 rounded-full ${getHeatmapIntensity(data.alertCount)} flex items-center justify-center text-white text-xs font-bold shadow-lg cursor-pointer hover:scale-110 transition-transform`}
                style={{ opacity: getHeatmapOpacity(data.alertCount) }}
                title={`${data.location}: ${data.alertCount} alertas (${data.criticalCount} críticas)`}
              >
                {data.alertCount}
              </div>
            </div>
          ))}

          {/* Leyenda */}
          <div className="absolute bottom-4 left-4 bg-white rounded-lg p-3 shadow-lg">
            <div className="text-sm font-medium text-slate-700 mb-2">Intensidad de Alertas</div>
            <div className="flex items-center space-x-4 text-xs">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Baja (1-4)</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>Media (5-9)</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span>Alta (10-14)</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Crítica (15+)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de ubicaciones */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
          {heatmapData.map((data, index) => (
            <div key={index} className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-slate-800 text-sm">{data.location}</span>
                <span className={`px-2 py-1 rounded text-xs font-bold text-white ${getHeatmapIntensity(data.alertCount)}`}>
                  {data.alertCount}
                </span>
              </div>
              <div className="text-xs text-slate-600">
                {data.criticalCount} críticas • Última: {formatTimeAgo(data.lastAlert)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tendencias por Hora */}
      <div className="mb-8">
        <h4 className="font-semibold text-slate-700 mb-4 flex items-center">
          <TrendingUp className="h-4 w-4 mr-2" />
          Tendencias por Hora (Últimas 24h)
        </h4>
        
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
          <div className="flex items-end justify-between h-32 space-x-1">
            {trendData.map((trend, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div className="flex flex-col items-center space-y-1 w-full">
                  <div
                    className="w-full bg-blue-500 rounded-t"
                    style={{ height: `${(trend.count / 15) * 100}px` }}
                    title={`${trend.hour}:00 - ${trend.count} alertas`}
                  ></div>
                  {trend.critical > 0 && (
                    <div
                      className="w-full bg-red-500 rounded-t"
                      style={{ height: `${(trend.critical / 5) * 20}px` }}
                      title={`${trend.critical} críticas`}
                    ></div>
                  )}
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  {trend.hour.toString().padStart(2, '0')}
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex items-center justify-center space-x-6 mt-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span className="text-slate-600">Alertas Totales</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span className="text-slate-600">Alertas Críticas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas Resumidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Alertas</p>
              <p className="text-2xl font-bold text-blue-800">
                {heatmapData.reduce((sum, data) => sum + data.alertCount, 0)}
              </p>
            </div>
            <Activity className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 font-medium">Críticas</p>
              <p className="text-2xl font-bold text-red-800">
                {heatmapData.reduce((sum, data) => sum + data.criticalCount, 0)}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Ubicaciones</p>
              <p className="text-2xl font-bold text-green-800">{heatmapData.length}</p>
            </div>
            <MapPin className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Promedio/Hora</p>
              <p className="text-2xl font-bold text-purple-800">
                {(trendData.reduce((sum, trend) => sum + trend.count, 0) / 24).toFixed(1)}
              </p>
            </div>
            <Clock className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Recomendaciones */}
      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-semibold text-yellow-800 mb-2 flex items-center">
          <Shield className="h-4 w-4 mr-2" />
          Recomendaciones de Seguridad
        </h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Aumentar vigilancia en áreas con mayor número de alertas</li>
          <li>• Revisar cámaras en ubicaciones críticas durante horas pico</li>
          <li>• Considerar instalar cámaras adicionales en zonas de alta actividad</li>
          <li>• Implementar protocolos específicos para alertas críticas</li>
        </ul>
      </div>
    </div>
  )
}

export default AlertAnalytics
