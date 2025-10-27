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
  Server
} from 'lucide-react'

// Componente de tarjeta de métrica
function MetricCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  status = 'normal' 
}: {
  title: string
  value: string | number
  icon: any
  trend?: string
  status?: 'normal' | 'warning' | 'critical'
}) {
  const statusColors = {
    normal: 'text-green-600',
    warning: 'text-yellow-600',
    critical: 'text-red-600'
  }

  return (
    <div className="card hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-2xl font-bold ${statusColors[status]}`}>
            {value}
          </p>
          {trend && (
            <p className="text-xs text-gray-500 mt-1">{trend}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${status === 'normal' ? 'bg-green-100' : status === 'warning' ? 'bg-yellow-100' : 'bg-red-100'}`}>
          <Icon className={`h-6 w-6 ${statusColors[status]}`} />
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
    { title: 'Cámaras Activas', value: '4/4', icon: Camera, trend: '+0% desde ayer', status: 'normal' as const },
    { title: 'Alertas Hoy', value: '12', icon: AlertTriangle, trend: '-25% vs ayer', status: 'normal' as const },
    { title: 'Uso de CPU', value: '23%', icon: Activity, trend: 'Estable', status: 'normal' as const },
    { title: 'Almacenamiento', value: '2.4 GB', icon: Database, trend: '+150 MB hoy', status: 'warning' as const },
    { title: 'Usuarios Conectados', value: '3', icon: Users, trend: 'Activos', status: 'normal' as const },
    { title: 'Tiempo de Respuesta', value: '45ms', icon: Clock, trend: 'Excelente', status: 'normal' as const }
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
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
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
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
      </main>
    </div>
  )
}
