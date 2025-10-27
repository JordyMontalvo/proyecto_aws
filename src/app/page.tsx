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
  BarChart3,
  Play,
  Pause,
  RefreshCw
} from 'lucide-react'
import CameraGrid from '../components/CameraGrid'
import RealCameraCapture from '../components/RealCameraCapture'
import SurveillanceDemo from '../components/SurveillanceDemo'
import S3StorageInfo from '../components/S3StorageInfo'
import AWSStatus from '../components/AWSStatus'
import { EC2Table, RDSTable, S3Table, MetricsCard } from '../components/DetailedTables'
import { useDetailedAWSData } from '../lib/useDetailedAWSData'
import { useAWSDataV3 } from '../lib/useAWSData-v3'

// Componente de tarjeta de métrica modernizada
function ModernMetricCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  status = 'normal',
  color = 'blue',
  subtitle
}: {
  title: string
  value: string | number
  icon: any
  trend?: string
  status?: 'normal' | 'warning' | 'critical'
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple'
  subtitle?: string
}) {
  const statusColors = {
    normal: 'text-white',
    warning: 'text-yellow-200',
    critical: 'text-red-200'
  }

  const colorGradients = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    yellow: 'from-yellow-500 to-yellow-600',
    red: 'from-red-500 to-red-600',
    purple: 'from-purple-500 to-purple-600',
    teal: 'from-teal-500 to-teal-600',
    pink: 'from-pink-500 to-pink-600',
    orange: 'from-orange-500 to-orange-600'
  }

  const cardClass = status === 'normal' ? 'metric-card' : 
                   status === 'warning' ? 'metric-card-warning' : 'metric-card-danger'

  return (
    <div className={`${cardClass} group cursor-pointer`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-white/80 mb-1">{title}</p>
          <p className={`text-4xl font-bold ${statusColors[status]} mb-2`}>
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-white/60">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center space-x-1 mt-2">
              <TrendingUp className="h-4 w-4 text-green-400" />
              <p className="text-xs text-green-400 font-medium">{trend}</p>
            </div>
          )}
        </div>
        <div className={`p-4 rounded-2xl bg-gradient-to-r ${colorGradients[color]} shadow-2xl group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="h-8 w-8 text-white" />
        </div>
      </div>
    </div>
  )
}

// Componente de estado de servicio modernizado
function ModernServiceStatus({ 
  name, 
  status, 
  lastUpdate 
}: {
  name: string
  status: 'online' | 'offline' | 'warning'
  lastUpdate: string
}) {
  const statusConfig = {
    online: { 
      color: 'status-online', 
      text: 'En línea',
      icon: '🟢'
    },
    offline: { 
      color: 'status-offline', 
      text: 'Desconectado',
      icon: '🔴'
    },
    warning: { 
      color: 'status-warning', 
      text: 'Advertencia',
      icon: '🟡'
    }
  }

  return (
    <div className="card group cursor-pointer">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="text-2xl">{statusConfig[status].icon}</div>
          <div>
            <h3 className="text-lg font-semibold text-white">{name}</h3>
            <p className="text-sm text-white/70">Última actualización: {lastUpdate}</p>
          </div>
        </div>
        <div className={statusConfig[status].color}>
          {statusConfig[status].text}
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'cameras' | 'analytics'>('overview')
  const [currentTime, setCurrentTime] = useState('')
  const [isLive, setIsLive] = useState(true)

  // Hook principal con fallback robusto
  const { data: awsData, loading: awsLoading, error: awsError } = useDetailedAWSData(30000)
  const { data: fallbackData, loading: fallbackLoading, error: fallbackError, sdkVersion } = useAWSDataV3(30000)

  // Lógica de fallback inteligente
  const finalData = awsData || fallbackData
  const finalLoading = awsLoading || fallbackLoading
  const finalError = awsError || fallbackError

  // Actualizar tiempo cada segundo
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      }))
    }
    
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  // Métricas calculadas con datos reales o simulados
  const metrics = finalData ? [
    {
      title: 'CPU Promedio',
      value: `${finalData.metrics?.cpu && typeof finalData.metrics.cpu === 'object' && 'average' in finalData.metrics.cpu ? finalData.metrics.cpu.average?.toFixed(1) || '0.0' : '0.0'}%`,
      icon: Activity,
      trend: finalData.metrics?.cpu && typeof finalData.metrics.cpu === 'object' && 'trend' in finalData.metrics.cpu && finalData.metrics.cpu.trend > 0 ? `+${finalData.metrics.cpu.trend.toFixed(1)}%` : undefined,
      status: (finalData.metrics?.cpu && typeof finalData.metrics.cpu === 'object' && 'average' in finalData.metrics.cpu ? finalData.metrics.cpu.average || 0 : 0) > 80 ? 'critical' as const : (finalData.metrics?.cpu && typeof finalData.metrics.cpu === 'object' && 'average' in finalData.metrics.cpu ? finalData.metrics.cpu.average || 0 : 0) > 60 ? 'warning' as const : 'normal' as const,
      color: 'blue' as const,
      subtitle: 'Últimos 5 minutos'
    },
    {
      title: 'Almacenamiento S3',
      value: `${finalData.s3?.totalSizeGB?.toFixed(2) || '0.00'} GB`,
      icon: Database,
      trend: finalData.s3?.objectCount ? `${finalData.s3.objectCount} objetos` : undefined,
      status: 'normal' as const,
      color: 'green' as const,
      subtitle: 'Total utilizado'
    },
    {
      title: 'Instancias EC2',
      value: finalData.ec2 && typeof finalData.ec2 === 'object' && 'runningCount' in finalData.ec2 ? finalData.ec2.runningCount || 0 : 0,
      icon: Server,
      trend: finalData.ec2 && typeof finalData.ec2 === 'object' && 'totalCount' in finalData.ec2 ? `${finalData.ec2.totalCount} total` : undefined,
      status: (finalData.ec2 && typeof finalData.ec2 === 'object' && 'runningCount' in finalData.ec2 ? finalData.ec2.runningCount || 0 : 0) === 0 ? 'critical' as const : 'normal' as const,
      color: 'purple' as const,
      subtitle: 'Activas'
    },
    {
      title: 'Estado RDS',
      value: finalData.rds && typeof finalData.rds === 'object' && 'availableCount' in finalData.rds ? finalData.rds.availableCount || 0 : 0,
      icon: Database,
      trend: finalData.rds && typeof finalData.rds === 'object' && 'totalCount' in finalData.rds ? `${finalData.rds.totalCount} instancias` : undefined,
      status: (finalData.rds && typeof finalData.rds === 'object' && 'availableCount' in finalData.rds ? finalData.rds.availableCount || 0 : 0) === 0 ? 'critical' as const : 'normal' as const,
      color: 'yellow' as const,
      subtitle: 'Disponibles'
    }
  ] : []

  // Servicios con estado real
  const services = finalData ? [
    { name: 'EC2 Instances', status: (finalData.ec2 && typeof finalData.ec2 === 'object' && 'runningCount' in finalData.ec2 ? finalData.ec2.runningCount || 0 : 0) > 0 ? 'online' as const : 'offline' as const, lastUpdate: 'Ahora' },
    { name: 'RDS Database', status: (finalData.rds && typeof finalData.rds === 'object' && 'availableCount' in finalData.rds ? finalData.rds.availableCount || 0 : 0) > 0 ? 'online' as const : 'offline' as const, lastUpdate: 'Ahora' },
    { name: 'S3 Storage', status: finalData.s3?.exists ? 'online' as const : 'offline' as const, lastUpdate: 'Ahora' },
    { name: 'CloudWatch', status: finalData.metrics ? 'online' as const : 'offline' as const, lastUpdate: 'Ahora' },
    { name: 'Application Load Balancer', status: 'online' as const, lastUpdate: 'Ahora' }
  ] : []

  if (finalLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-slate-300 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Cargando Dashboard</h2>
          <p className="text-slate-600">Conectando con servicios AWS...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200">
      {/* Header Glassmorphism */}
      <div className="header-glass">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Eye className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">VIGILA</h1>
                <p className="text-sm text-slate-600">Sistema de Vigilancia Inteligente</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <div className="text-sm text-slate-600">Tiempo Actual</div>
                <div className="text-lg font-mono text-slate-800">{currentTime}</div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full animate-pulse ${finalData ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                <span className="text-sm font-medium text-slate-800">
                  {finalData ? 'AWS Conectado' : 'AWS Desconectado'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex space-x-4 mb-8">
          {[
            { id: 'overview', label: 'Resumen', icon: BarChart3 },
            { id: 'cameras', label: 'Cámaras', icon: Camera },
            { id: 'analytics', label: 'Análisis', icon: Activity }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`nav-tab flex items-center space-x-2 ${
                activeTab === tab.id ? 'nav-tab-active' : ''
              }`}
            >
              <tab.icon className="h-5 w-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <>
            {/* Hero Section */}
            <div className="text-center mb-12 fade-in">
              <h2 className="text-5xl font-bold text-slate-800 mb-4">
                Dashboard de Monitoreo
              </h2>
              <p className="text-xl text-slate-600 font-medium max-w-3xl mx-auto slide-up">
                Monitoreo en tiempo real del sistema de vigilancia desplegado en AWS
              </p>
              <div className="mt-8 flex justify-center space-x-6">
                <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-md px-6 py-3 rounded-full border border-green-200 shadow-sm">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-slate-700">Sistema Activo</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-md px-6 py-3 rounded-full border border-blue-200 shadow-sm">
                  <div className={`w-3 h-3 rounded-full animate-pulse ${finalData ? 'bg-blue-500' : 'bg-yellow-500'}`}></div>
                  <span className="text-sm font-medium text-slate-700">
                    {finalData ? 'AWS Conectado' : 'AWS Desconectado'}
                  </span>
                </div>
                {finalData && (
                  <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-md px-6 py-3 rounded-full border border-purple-200 shadow-sm">
                    <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-slate-700">
                      Datos en Tiempo Real (SDK v3)
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {metrics.map((metric, index) => (
                <div key={index} className="slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <ModernMetricCard {...metric} />
                </div>
              ))}
            </div>

            {/* Services Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="card">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <Shield className="h-6 w-6 mr-3 text-blue-400" />
                  Estado de Servicios AWS
                </h3>
                <div className="space-y-4">
                  {services.map((service, index) => (
                    <div key={index} className="slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                      <ModernServiceStatus {...service} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <Shield className="h-6 w-6 mr-3 text-emerald-400" />
                  Estado de Servicios AWS
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/10 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
                      <span className="text-white font-medium">Modo en Vivo</span>
                    </div>
                    <button
                      onClick={() => setIsLive(!isLive)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        isLive 
                          ? 'bg-red-500 hover:bg-red-600 text-white' 
                          : 'bg-green-500 hover:bg-green-600 text-white'
                      }`}
                    >
                      {isLive ? <><Pause className="h-4 w-4 inline mr-2" />Pausar</> : <><Play className="h-4 w-4 inline mr-2" />Reanudar</>}
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-400/20">
                    <div className="flex items-center space-x-3">
                      <RefreshCw className="h-5 w-5 text-blue-400" />
                      <span className="text-white font-medium">Actualización Automática</span>
                    </div>
                    <span className="text-white/80 text-sm">Cada 30 segundos</span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-400/20">
                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-purple-400" />
                      <span className="text-white font-medium">Última Actualización</span>
                    </div>
                    <span className="text-white/80 text-sm">{currentTime}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* AWS Status Component */}
            <div className="card">
              <AWSStatus data={finalData} loading={finalLoading} error={finalError} sdkVersion={sdkVersion || "v3"} />
            </div>
          </>
        )}

        {activeTab === 'cameras' && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-white mb-4">Sistema de Cámaras</h2>
              <p className="text-lg text-white/80">Captura y monitoreo en tiempo real</p>
            </div>
            
            <div className="card">
              <RealCameraCapture />
            </div>
            
            <div className="card">
              <SurveillanceDemo />
            </div>
            
            <div className="card">
              <S3StorageInfo />
            </div>
            
            <div className="card">
              <CameraGrid />
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-white mb-4">Análisis Detallado</h2>
              <p className="text-lg text-white/80">Métricas y estadísticas avanzadas</p>
            </div>

            {finalError ? (
              <div className="card">
                <div className="text-center py-12">
                  <AlertTriangle className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Error de Conexión</h3>
                  <p className="text-white/80 mb-4">{finalError}</p>
                  <p className="text-sm text-white/60">
                    Verifica las variables de entorno en Vercel o usa el modo de demostración
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="card">
                    <MetricsCard data={finalData?.metrics} />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="card">
                    <EC2Table data={finalData?.ec2} />
                  </div>
                  <div className="card">
                    <RDSTable data={finalData?.rds} />
                  </div>
                  <div className="card">
                    <S3Table data={finalData?.s3} />
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}