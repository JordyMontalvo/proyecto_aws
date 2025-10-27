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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
      
      {/* Header */}
      <header className="header-glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-8">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="p-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl shadow-xl glow-effect transform rotate-3 hover:rotate-0 transition-transform duration-300">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gradient">VIGILA</h1>
                <p className="text-lg text-gray-600 font-medium">Sistema de Vigilancia Inteligente</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 font-medium">Tiempo actual</p>
              <p className="text-2xl font-mono font-bold text-gray-900 bg-white/50 px-4 py-2 rounded-xl shadow-lg">
                {currentTime}
              </p>
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <div className="flex space-x-2 mb-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`nav-tab ${
                activeTab === 'overview' ? 'nav-tab-active' : 'nav-tab-inactive'
              }`}
            >
              <BarChart3 className="h-5 w-5 mr-2 inline" />
              Resumen
            </button>
            <button
              onClick={() => setActiveTab('cameras')}
              className={`nav-tab ${
                activeTab === 'cameras' ? 'nav-tab-active' : 'nav-tab-inactive'
              }`}
            >
              <Eye className="h-5 w-5 mr-2 inline" />
              Cámaras
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`nav-tab ${
                activeTab === 'analytics' ? 'nav-tab-active' : 'nav-tab-inactive'
              }`}
            >
              <Zap className="h-5 w-5 mr-2 inline" />
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
            <div className="mb-12 text-center">
              <h2 className="text-5xl font-bold text-gradient mb-4 fade-in">
                Dashboard de Monitoreo
              </h2>
              <p className="text-xl text-gray-600 font-medium max-w-3xl mx-auto slide-up">
                Monitoreo en tiempo real del sistema de vigilancia desplegado en AWS
              </p>
              <div className="mt-6 flex justify-center space-x-4">
                <div className="flex items-center space-x-2 bg-white/50 px-4 py-2 rounded-full shadow-lg">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-700">Sistema Activo</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/50 px-4 py-2 rounded-full shadow-lg">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-700">AWS Conectado</span>
                </div>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {metrics.map((metric, index) => (
                <div key={index} className="slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <MetricCard
                    title={metric.title}
                    value={metric.value}
                    icon={metric.icon}
                    trend={metric.trend}
                    status={metric.status}
                    color={metric.color}
                  />
                </div>
              ))}
            </div>

            {/* Services Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              <div className="card slide-up">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Server className="h-6 w-6 mr-3 text-blue-600" />
                  Estado de Servicios AWS
                </h3>
                <div className="space-y-4">
                  {services.map((service, index) => (
                    <div key={index} className="slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                      <ServiceStatus
                        name={service.name}
                        status={service.status}
                        lastUpdate={service.lastUpdate}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="card slide-up">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <TrendingUp className="h-6 w-6 mr-3 text-blue-600" />
                  Resumen del Sistema
                </h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                    <span className="text-gray-700 font-medium">Infraestructura AWS</span>
                    <span className="status-online">Operativa</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                    <span className="text-gray-700 font-medium">Región</span>
                    <span className="font-semibold text-blue-700">us-east-1 (N. Virginia)</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                    <span className="text-gray-700 font-medium">Tipo de Instancia</span>
                    <span className="font-semibold text-purple-700">t3.micro (Free Tier)</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border border-yellow-200">
                    <span className="text-gray-700 font-medium">Base de Datos</span>
                    <span className="font-semibold text-yellow-700">PostgreSQL 15.7</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl border border-teal-200">
                    <span className="text-gray-700 font-medium">Almacenamiento</span>
                    <span className="font-semibold text-teal-700">S3 + RDS (20GB)</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200">
                    <span className="text-gray-700 font-medium">Monitoreo</span>
                    <span className="font-semibold text-orange-700">CloudWatch Activo</span>
                  </div>
                </div>
              </div>
            </div>

            {/* AWS Architecture Info */}
            <div className="card slide-up">
              <h3 className="text-3xl font-bold text-gray-900 mb-8 flex items-center justify-center">
                <Cloud className="h-8 w-8 mr-3 text-blue-600" />
                Arquitectura AWS Desplegada
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl mx-auto mb-4 w-fit">
                    <Server className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="font-bold text-gray-900 text-lg mb-2">EC2</h4>
                  <p className="text-sm text-gray-600">Servidores de aplicación</p>
                  <div className="mt-3 text-xs text-blue-600 font-semibold">t3.micro</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <div className="p-4 bg-gradient-to-r from-green-500 to-green-600 rounded-xl mx-auto mb-4 w-fit">
                    <Database className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="font-bold text-gray-900 text-lg mb-2">RDS</h4>
                  <p className="text-sm text-gray-600">Base de datos PostgreSQL</p>
                  <div className="mt-3 text-xs text-green-600 font-semibold">PostgreSQL 15.7</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <div className="p-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl mx-auto mb-4 w-fit">
                    <Cloud className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="font-bold text-gray-900 text-lg mb-2">S3</h4>
                  <p className="text-sm text-gray-600">Almacenamiento de videos</p>
                  <div className="mt-3 text-xs text-purple-600 font-semibold">20GB</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl border border-orange-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <div className="p-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl mx-auto mb-4 w-fit">
                    <Activity className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="font-bold text-gray-900 text-lg mb-2">CloudWatch</h4>
                  <p className="text-sm text-gray-600">Monitoreo y alertas</p>
                  <div className="mt-3 text-xs text-orange-600 font-semibold">Activo</div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'cameras' && (
          <CameraGrid />
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <div className="mb-12 text-center">
              <h2 className="text-5xl font-bold text-gradient mb-4 fade-in">
                Análisis Avanzado
              </h2>
              <p className="text-xl text-gray-600 font-medium max-w-3xl mx-auto slide-up">
                Métricas detalladas y análisis de patrones de seguridad
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="card slide-up">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <TrendingUp className="h-6 w-6 mr-3 text-blue-600" />
                  Tendencias de Seguridad
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 hover:shadow-lg transition-all duration-300">
                    <span className="text-gray-700 font-medium">Alertas esta semana</span>
                    <span className="text-green-600 font-bold text-lg">-15%</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 hover:shadow-lg transition-all duration-300">
                    <span className="text-gray-700 font-medium">Cobertura de cámaras</span>
                    <span className="text-blue-600 font-bold text-lg">100%</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200 hover:shadow-lg transition-all duration-300">
                    <span className="text-gray-700 font-medium">Tiempo de respuesta</span>
                    <span className="text-purple-600 font-bold text-lg">45ms</span>
                  </div>
                </div>
              </div>

              <div className="card slide-up">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Activity className="h-6 w-6 mr-3 text-blue-600" />
                  Actividad Reciente
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 hover:shadow-lg transition-all duration-300">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Cámara Principal activada</p>
                      <p className="text-sm text-gray-500">Hace 2 minutos</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border border-yellow-200 hover:shadow-lg transition-all duration-300">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Alerta de movimiento detectada</p>
                      <p className="text-sm text-gray-500">Hace 5 minutos</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 hover:shadow-lg transition-all duration-300">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Sistema actualizado</p>
                      <p className="text-sm text-gray-500">Hace 1 hora</p>
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
