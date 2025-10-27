'use client'

import { useState, useEffect } from 'react'
import { 
  Camera, 
  Shield, 
  Activity, 
  AlertTriangle, 
  Users, 
  Clock,
  TrendingUp,
  Database,
  Cloud,
  Server,
  Eye,
  Zap,
  BarChart3
} from 'lucide-react'
import CameraGrid from '../components/CameraGrid'

// Componente de tarjeta de métrica mejorado
function MetricCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  status = 'normal',
  color = 'blue'
}: {
  title: string
  value: string | number
  icon: any
  trend?: string
  status?: 'normal' | 'warning' | 'critical'
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple'
}) {
  const statusColors = {
    normal: 'text-green-600',
    warning: 'text-yellow-600',
    critical: 'text-red-600'
  }

  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    yellow: 'from-yellow-500 to-yellow-600',
    red: 'from-red-500 to-red-600',
    purple: 'from-purple-500 to-purple-600'
  }

  const cardClass = status === 'normal' ? 'metric-card' : 
                   status === 'warning' ? 'metric-card-warning' : 'metric-card-danger'

  return (
    <div className={cardClass}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className={`text-3xl font-bold ${statusColors[status]} mb-2`}>
            {value}
          </p>
          {trend && (
            <p className="text-xs text-gray-500">{trend}</p>
          )}
        </div>
        <div className={`p-4 rounded-xl bg-gradient-to-r ${colorClasses[color]} shadow-lg`}>
          <Icon className="h-8 w-8 text-white" />
        </div>
      </div>
    </div>
  )
}

// Componente de estado de servicio
function ServiceStatus({ 
  name, 
  status, 
  lastUpdate 
}: {
  name: string
  status: 'online' | 'offline' | 'warning'
  lastUpdate: string
}) {
  const statusConfig = {
    online: { color: 'status-online', text: 'En línea' },
    offline: { color: 'status-offline', text: 'Desconectado' },
    warning: { color: 'status-warning', text: 'Advertencia' }
  }

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
      <div className="flex items-center space-x-3">
        <div className={`w-3 h-3 rounded-full ${
          status === 'online' ? 'bg-green-500' : 
          status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
        }`} />
        <div>
          <h3 className="font-medium text-gray-900">{name}</h3>
          <p className="text-sm text-gray-500">Última actualización: {lastUpdate}</p>
        </div>
      </div>
      <span className={statusConfig[status].color}>
        {statusConfig[status].text}
      </span>
    </div>
  )
}

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('es-ES'))
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'cameras' | 'analytics'>('overview')

  useEffect(() => {
    // Simular carga inicial
    const timer = setTimeout(() => setIsLoading(false), 2000)
    
    // Actualizar tiempo cada segundo
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('es-ES'))
    }, 1000)

    return () => {
      clearTimeout(timer)
      clearInterval(timeInterval)
    }
  }, [])

  // Datos simulados para la demo
  const metrics = [
    { title: 'Cámaras Activas', value: '4/4', icon: Camera, trend: '+0% desde ayer', status: 'normal' as const, color: 'blue' as const },
    { title: 'Alertas Hoy', value: '12', icon: AlertTriangle, trend: '-25% vs ayer', status: 'normal' as const, color: 'yellow' as const },
    { title: 'Uso de CPU', value: '23%', icon: Activity, trend: 'Estable', status: 'normal' as const, color: 'green' as const },
    { title: 'Almacenamiento', value: '2.4 GB', icon: Database, trend: '+150 MB hoy', status: 'warning' as const, color: 'purple' as const },
    { title: 'Usuarios Conectados', value: '3', icon: Users, trend: 'Activos', status: 'normal' as const, color: 'blue' as const },
    { title: 'Tiempo de Respuesta', value: '45ms', icon: Clock, trend: 'Excelente', status: 'normal' as const, color: 'green' as const }
  ]

  const services = [
    { name: 'AWS EC2 - Servidor Principal', status: 'online' as const, lastUpdate: 'Hace 30 segundos' },
    { name: 'AWS RDS - Base de Datos', status: 'online' as const, lastUpdate: 'Hace 1 minuto' },
    { name: 'AWS S3 - Almacenamiento', status: 'online' as const, lastUpdate: 'Hace 2 minutos' },
    { name: 'CloudWatch - Monitoreo', status: 'warning' as const, lastUpdate: 'Hace 5 minutos' },
    { name: 'Application Load Balancer', status: 'online' as const, lastUpdate: 'Hace 1 minuto' }
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <h2 className="mt-4 text-xl font-semibold text-gray-700">Cargando Dashboard...</h2>
          <p className="mt-2 text-gray-500">Conectando con servicios AWS</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg glow-effect">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">VIGILA</h1>
                <p className="text-sm text-gray-500">Sistema de Vigilancia Inteligente</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Tiempo actual</p>
              <p className="text-lg font-mono font-semibold text-gray-900">{currentTime}</p>
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <div className="flex space-x-1 mb-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'overview'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <BarChart3 className="h-4 w-4 mr-2 inline" />
              Resumen
            </button>
            <button
              onClick={() => setActiveTab('cameras')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'cameras'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Eye className="h-4 w-4 mr-2 inline" />
              Cámaras
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'analytics'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Zap className="h-4 w-4 mr-2 inline" />
              Análisis
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Content */}
        {activeTab === 'overview' && (
          <>
            {/* Welcome Section */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Dashboard de Monitoreo
              </h2>
              <p className="text-gray-600">
                Monitoreo en tiempo real del sistema de vigilancia desplegado en AWS
              </p>
            </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <MetricCard
              key={index}
              title={metric.title}
              value={metric.value}
              icon={metric.icon}
              trend={metric.trend}
              status={metric.status}
            />
          ))}
        </div>

        {/* Services Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Server className="h-5 w-5 mr-2 text-blue-600" />
              Estado de Servicios AWS
            </h3>
            <div className="space-y-3">
              {services.map((service, index) => (
                <ServiceStatus
                  key={index}
                  name={service.name}
                  status={service.status}
                  lastUpdate={service.lastUpdate}
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
              Resumen del Sistema
            </h3>
            <div className="card">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Infraestructura AWS</span>
                  <span className="status-online">Operativa</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Región</span>
                  <span className="font-medium">us-east-1 (N. Virginia)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Tipo de Instancia</span>
                  <span className="font-medium">t3.micro (Free Tier)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Base de Datos</span>
                  <span className="font-medium">PostgreSQL 15.7</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Almacenamiento</span>
                  <span className="font-medium">S3 + RDS (20GB)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Monitoreo</span>
                  <span className="font-medium">CloudWatch Activo</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AWS Architecture Info */}
        <div className="mt-8 card">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Cloud className="h-5 w-5 mr-2 text-blue-600" />
            Arquitectura AWS Desplegada
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Server className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <h4 className="font-medium text-gray-900">EC2</h4>
              <p className="text-sm text-gray-500">Servidores de aplicación</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Database className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <h4 className="font-medium text-gray-900">RDS</h4>
              <p className="text-sm text-gray-500">Base de datos PostgreSQL</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Cloud className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <h4 className="font-medium text-gray-900">S3</h4>
              <p className="text-sm text-gray-500">Almacenamiento de videos</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Activity className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <h4 className="font-medium text-gray-900">CloudWatch</h4>
              <p className="text-sm text-gray-500">Monitoreo y alertas</p>
            </div>
          </div>
        </div>
          </>
        )}

        {activeTab === 'cameras' && (
          <CameraGrid />
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Análisis Avanzado
              </h2>
              <p className="text-gray-600">
                Métricas detalladas y análisis de patrones de seguridad
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                  Tendencias de Seguridad
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-gray-700">Alertas esta semana</span>
                    <span className="text-green-600 font-semibold">-15%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-gray-700">Cobertura de cámaras</span>
                    <span className="text-blue-600 font-semibold">100%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <span className="text-gray-700">Tiempo de respuesta</span>
                    <span className="text-purple-600 font-semibold">45ms</span>
                  </div>
                </div>
              </div>

              <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-blue-600" />
                  Actividad Reciente
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Cámara Principal activada</p>
                      <p className="text-xs text-gray-500">Hace 2 minutos</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Alerta de movimiento detectada</p>
                      <p className="text-xs text-gray-500">Hace 5 minutos</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Sistema actualizado</p>
                      <p className="text-xs text-gray-500">Hace 1 hora</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
