'use client'

import { useState, useEffect } from 'react'
import { 
  Activity, 
  Database, 
  Server, 
  HardDrive,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Zap,
  Shield
} from 'lucide-react'

interface MetricData {
  id: string
  title: string
  value: string | number
  change: number
  changeType: 'increase' | 'decrease' | 'neutral'
  icon: React.ReactNode
  color: string
  subtitle: string
  trend: number[]
}

export default function MetricsDashboard() {
  const [metrics, setMetrics] = useState<MetricData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const generateMetrics = () => {
      const mockMetrics: MetricData[] = [
        {
          id: 'cpu',
          title: 'CPU Promedio',
          value: '68.5%',
          change: 12.3,
          changeType: 'increase',
          icon: <Activity className="h-6 w-6" />,
          color: 'blue',
          subtitle: 'Últimos 5 minutos',
          trend: [45, 52, 48, 61, 68, 65, 68]
        },
        {
          id: 'memory',
          title: 'Memoria Utilizada',
          value: '4.2 GB',
          change: -2.1,
          changeType: 'decrease',
          icon: <Database className="h-6 w-6" />,
          color: 'green',
          subtitle: 'De 8 GB total',
          trend: [4.8, 4.6, 4.4, 4.3, 4.2, 4.1, 4.2]
        },
        {
          id: 'instances',
          title: 'Instancias Activas',
          value: 12,
          change: 0,
          changeType: 'neutral',
          icon: <Server className="h-6 w-6" />,
          color: 'purple',
          subtitle: 'EC2 + RDS',
          trend: [12, 12, 12, 12, 12, 12, 12]
        },
        {
          id: 'storage',
          title: 'Almacenamiento S3',
          value: '2.3 TB',
          change: 8.7,
          changeType: 'increase',
          icon: <HardDrive className="h-6 w-6" />,
          color: 'orange',
          subtitle: 'Total utilizado',
          trend: [1.8, 1.9, 2.0, 2.1, 2.2, 2.2, 2.3]
        },
        {
          id: 'requests',
          title: 'Requests/Minuto',
          value: 1247,
          change: 15.2,
          changeType: 'increase',
          icon: <Zap className="h-6 w-6" />,
          color: 'yellow',
          subtitle: 'Promedio actual',
          trend: [980, 1050, 1120, 1180, 1200, 1230, 1247]
        },
        {
          id: 'alerts',
          title: 'Alertas Activas',
          value: 3,
          change: -1,
          changeType: 'decrease',
          icon: <AlertTriangle className="h-6 w-6" />,
          color: 'red',
          subtitle: 'Requieren atención',
          trend: [5, 4, 4, 3, 3, 3, 3]
        }
      ]

      setMetrics(mockMetrics)
      setLoading(false)
    }

    generateMetrics()
  }, [])

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        icon: 'text-blue-500',
        value: 'text-blue-800',
        title: 'text-blue-600'
      },
      green: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        icon: 'text-green-500',
        value: 'text-green-800',
        title: 'text-green-600'
      },
      purple: {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        icon: 'text-purple-500',
        value: 'text-purple-800',
        title: 'text-purple-600'
      },
      orange: {
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        icon: 'text-orange-500',
        value: 'text-orange-800',
        title: 'text-orange-600'
      },
      yellow: {
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        icon: 'text-yellow-500',
        value: 'text-yellow-800',
        title: 'text-yellow-600'
      },
      red: {
        bg: 'bg-red-50',
        border: 'border-red-200',
        icon: 'text-red-500',
        value: 'text-red-800',
        title: 'text-red-600'
      }
    }
    return colorMap[color as keyof typeof colorMap] || colorMap.blue
  }

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case 'increase':
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case 'decrease':
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return <div className="h-4 w-4" />
    }
  }

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'increase':
        return 'text-green-600'
      case 'decrease':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-slate-600">Cargando métricas...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-slate-800 flex items-center">
          <Activity className="h-6 w-6 mr-3 text-blue-500" />
          Métricas del Sistema
        </h3>
        
        <div className="flex items-center text-sm text-slate-600">
          <Clock className="h-4 w-4 mr-1" />
          <span>Actualizado hace 2 min</span>
        </div>
      </div>

      {/* Grid de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric) => {
          const colors = getColorClasses(metric.color)
          
          return (
            <div
              key={metric.id}
              className={`${colors.bg} ${colors.border} border rounded-lg p-6 hover:shadow-md transition-shadow`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${colors.bg} ${colors.icon}`}>
                  {metric.icon}
                </div>
                
                <div className="flex items-center space-x-1">
                  {getChangeIcon(metric.changeType)}
                  <span className={`text-sm font-medium ${getChangeColor(metric.changeType)}`}>
                    {metric.change !== 0 && `${metric.change > 0 ? '+' : ''}${metric.change}%`}
                  </span>
                </div>
              </div>
              
              <div className="mb-2">
                <h4 className={`text-sm font-medium ${colors.title} mb-1`}>
                  {metric.title}
                </h4>
                <p className={`text-2xl font-bold ${colors.value}`}>
                  {metric.value}
                </p>
              </div>
              
              <p className="text-sm text-slate-600 mb-4">
                {metric.subtitle}
              </p>
              
              {/* Mini gráfico de tendencia */}
              <div className="flex items-end space-x-1 h-8">
                {metric.trend.map((value, index) => {
                  const maxValue = Math.max(...metric.trend)
                  const height = (value / maxValue) * 100
                  
                  return (
                    <div
                      key={index}
                      className={`flex-1 rounded-t ${
                        metric.color === 'blue' ? 'bg-blue-300' :
                        metric.color === 'green' ? 'bg-green-300' :
                        metric.color === 'purple' ? 'bg-purple-300' :
                        metric.color === 'orange' ? 'bg-orange-300' :
                        metric.color === 'yellow' ? 'bg-yellow-300' :
                        'bg-red-300'
                      }`}
                      style={{ height: `${height}%` }}
                    ></div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Resumen del Estado */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <div>
              <p className="font-semibold text-green-800">Sistema Estable</p>
              <p className="text-sm text-green-600">Todos los servicios funcionando correctamente</p>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <Shield className="h-5 w-5 text-blue-500 mr-2" />
            <div>
              <p className="font-semibold text-blue-800">Seguridad Activa</p>
              <p className="text-sm text-blue-600">Sistema de vigilancia operativo</p>
            </div>
          </div>
        </div>
        
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center">
            <Users className="h-5 w-5 text-purple-500 mr-2" />
            <div>
              <p className="font-semibold text-purple-800">Usuarios Conectados</p>
              <p className="text-sm text-purple-600">3 usuarios activos</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
