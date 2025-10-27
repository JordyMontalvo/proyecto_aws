'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  Bell, 
  AlertTriangle, 
  Shield, 
  Clock, 
  MapPin, 
  Camera, 
  Video, 
  Phone, 
  Mail, 
  MessageSquare,
  Settings,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  Zap,
  Activity
} from 'lucide-react'

interface Alert {
  id: string
  type: 'motion' | 'intrusion' | 'emergency' | 'system' | 'maintenance'
  priority: 'critical' | 'high' | 'medium' | 'low'
  title: string
  message: string
  timestamp: string
  location: string
  cameraId: string
  imageUrl?: string
  videoUrl?: string
  status: 'active' | 'acknowledged' | 'resolved'
  acknowledgedBy?: string
  resolvedAt?: string
}

interface AlertSettings {
  enableNotifications: boolean
  enableSound: boolean
  enableEmail: boolean
  enableSMS: boolean
  criticalContacts: string[]
  alertThresholds: {
    motion: number
    intrusion: number
    emergency: number
  }
  quietHours: {
    enabled: boolean
    start: string
    end: string
  }
}

function RealTimeAlertSystem() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [activeAlerts, setActiveAlerts] = useState<Alert[]>([])
  const [settings, setSettings] = useState<AlertSettings>({
    enableNotifications: true,
    enableSound: true,
    enableEmail: true,
    enableSMS: false,
    criticalContacts: ['admin@example.com', '+1234567890'],
    alertThresholds: {
      motion: 5,
      intrusion: 1,
      emergency: 1
    },
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '06:00'
    }
  })
  const [isSystemActive, setIsSystemActive] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Simular alertas en tiempo real
  useEffect(() => {
    if (!isSystemActive) return

    const alertTypes = ['motion', 'intrusion', 'emergency', 'system'] as const
    const priorities = ['critical', 'high', 'medium', 'low'] as const
    const locations = ['Entrada Principal', 'Patio Trasero', 'Estacionamiento', 'Recepción']
    const cameras = ['cam_1', 'cam_2', 'cam_3', 'cam_4']

    const generateAlert = () => {
      const type = alertTypes[Math.floor(Math.random() * alertTypes.length)]
      const priority = priorities[Math.floor(Math.random() * priorities.length)]
      const location = locations[Math.floor(Math.random() * locations.length)]
      const cameraId = cameras[Math.floor(Math.random() * cameras.length)]

      const alertTemplates = {
        motion: {
          title: 'Movimiento Detectado',
          message: `Se detectó movimiento inusual en ${location}. Revisar inmediatamente.`
        },
        intrusion: {
          title: 'Posible Intrusión',
          message: `Actividad sospechosa detectada en ${location}. Verificar seguridad.`
        },
        emergency: {
          title: 'EMERGENCIA',
          message: `Situación de emergencia en ${location}. Contactar autoridades inmediatamente.`
        },
        system: {
          title: 'Alerta del Sistema',
          message: `Cámara ${cameraId} requiere atención técnica.`
        }
      }

      const newAlert: Alert = {
        id: `alert_${Date.now()}`,
        type,
        priority,
        title: alertTemplates[type].title,
        message: alertTemplates[type].message,
        timestamp: new Date().toISOString(),
        location,
        cameraId,
        imageUrl: `https://picsum.photos/400/300?random=${Date.now()}`,
        status: 'active'
      }

      setAlerts(prev => [newAlert, ...prev])
      setActiveAlerts(prev => [newAlert, ...prev])

      // Reproducir sonido de alerta
      if (soundEnabled && settings.enableSound) {
        playAlertSound(priority)
      }

      // Mostrar notificación del navegador
      if (settings.enableNotifications) {
        showBrowserNotification(newAlert)
      }

      // Enviar email/SMS para alertas críticas
      if (priority === 'critical' && settings.enableEmail) {
        sendEmailAlert(newAlert)
      }
    }

    // Generar alertas cada 15-45 segundos
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% probabilidad de generar alerta
        generateAlert()
      }
    }, Math.random() * 30000 + 15000)

    return () => clearInterval(interval)
  }, [isSystemActive, soundEnabled, settings])

  const playAlertSound = (priority: string) => {
    if (audioRef.current) {
      audioRef.current.volume = priority === 'critical' ? 1.0 : 0.5
      audioRef.current.play().catch(console.error)
    }
  }

  const showBrowserNotification = (alert: Alert) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(alert.title, {
        body: alert.message,
        icon: '/favicon.ico',
        tag: alert.id
      })
    }
  }

  const sendEmailAlert = async (alert: Alert) => {
    try {
      const response = await fetch('/api/send-alert-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          alert,
          contacts: settings.criticalContacts
        })
      })
      
      if (response.ok) {
        console.log('Email de alerta enviado')
      }
    } catch (error) {
      console.error('Error enviando email:', error)
    }
  }

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, status: 'acknowledged', acknowledgedBy: 'Usuario Actual' }
        : alert
    ))
    setActiveAlerts(prev => prev.filter(alert => alert.id !== alertId))
  }

  const resolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, status: 'resolved', resolvedAt: new Date().toISOString() }
        : alert
    ))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500'
      case 'high': return 'bg-orange-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'critical': return 'CRÍTICO'
      case 'high': return 'ALTO'
      case 'medium': return 'MEDIO'
      case 'low': return 'BAJO'
      default: return 'DESCONOCIDO'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'motion': return <Activity className="h-4 w-4" />
      case 'intrusion': return <Shield className="h-4 w-4" />
      case 'emergency': return <AlertTriangle className="h-4 w-4" />
      case 'system': return <Settings className="h-4 w-4" />
      default: return <Bell className="h-4 w-4" />
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const alertTime = new Date(timestamp)
    const diffMs = now.getTime() - alertTime.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return 'Ahora'
    if (diffMins < 60) return `Hace ${diffMins} min`
    const diffHours = Math.floor(diffMins / 60)
    return `Hace ${diffHours}h`
  }

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      if (permission === 'granted') {
        console.log('Permisos de notificación concedidos')
      }
    }
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-slate-800 flex items-center">
          <Bell className="h-6 w-6 mr-3 text-red-500" />
          Sistema de Alertas en Tiempo Real
        </h3>
        
        <div className="flex items-center space-x-4">
          {/* Estado del Sistema */}
          <div className="flex items-center text-sm">
            <div className={`w-3 h-3 rounded-full mr-2 ${isSystemActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
            <span className="text-slate-600">
              {isSystemActive ? 'Sistema Activo' : 'Sistema Pausado'}
            </span>
          </div>

          {/* Controles */}
          <div className="flex space-x-2">
            <button
              onClick={() => setIsSystemActive(!isSystemActive)}
              className={`p-2 rounded-lg transition-colors ${
                isSystemActive 
                  ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                  : 'bg-green-100 text-green-600 hover:bg-green-200'
              }`}
              title={isSystemActive ? 'Pausar Sistema' : 'Activar Sistema'}
            >
              {isSystemActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-lg transition-colors ${
                soundEnabled 
                  ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title={soundEnabled ? 'Silenciar' : 'Activar Sonido'}
            >
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>

            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
              title="Configuración"
            >
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Configuración */}
      {showSettings && (
        <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-lg">
          <h4 className="font-semibold text-slate-700 mb-3">Configuración de Alertas</h4>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.enableNotifications}
                onChange={(e) => setSettings(prev => ({ ...prev, enableNotifications: e.target.checked }))}
                className="rounded"
              />
              <span className="text-sm text-slate-600">Notificaciones</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.enableSound}
                onChange={(e) => setSettings(prev => ({ ...prev, enableSound: e.target.checked }))}
                className="rounded"
              />
              <span className="text-sm text-slate-600">Sonido</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.enableEmail}
                onChange={(e) => setSettings(prev => ({ ...prev, enableEmail: e.target.checked }))}
                className="rounded"
              />
              <span className="text-sm text-slate-600">Email</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.enableSMS}
                onChange={(e) => setSettings(prev => ({ ...prev, enableSMS: e.target.checked }))}
                className="rounded"
              />
              <span className="text-sm text-slate-600">SMS</span>
            </label>
          </div>

          <div className="mt-4">
            <button
              onClick={requestNotificationPermission}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Solicitar Permisos de Notificación
            </button>
          </div>
        </div>
      )}

      {/* Estadísticas de Alertas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 font-medium">Activas</p>
              <p className="text-2xl font-bold text-red-800">{activeAlerts.length}</p>
            </div>
            <Bell className="h-8 w-8 text-red-500" />
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">Críticas</p>
              <p className="text-2xl font-bold text-orange-800">
                {alerts.filter(a => a.priority === 'critical').length}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Hoy</p>
              <p className="text-2xl font-bold text-blue-800">
                {alerts.filter(a => new Date(a.timestamp).toDateString() === new Date().toDateString()).length}
              </p>
            </div>
            <Clock className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Resueltas</p>
              <p className="text-2xl font-bold text-green-800">
                {alerts.filter(a => a.status === 'resolved').length}
              </p>
            </div>
            <Shield className="h-8 w-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Alertas Activas */}
      {activeAlerts.length > 0 && (
        <div className="mb-6">
          <h4 className="font-semibold text-slate-700 mb-3 flex items-center">
            <Eye className="h-4 w-4 mr-2" />
            Alertas Activas ({activeAlerts.length})
          </h4>
          
          <div className="space-y-3">
            {activeAlerts.slice(0, 3).map((alert) => (
              <div
                key={alert.id}
                className={`border-l-4 ${getPriorityColor(alert.priority)} bg-white border border-slate-200 rounded-lg p-4 shadow-sm`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${getPriorityColor(alert.priority)} text-white`}>
                      {getTypeIcon(alert.type)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h5 className="font-semibold text-slate-800">{alert.title}</h5>
                        <span className={`px-2 py-1 rounded text-xs font-medium text-white ${getPriorityColor(alert.priority)}`}>
                          {getPriorityText(alert.priority)}
                        </span>
                      </div>
                      
                      <p className="text-slate-600 text-sm mb-2">{alert.message}</p>
                      
                      <div className="flex items-center space-x-4 text-xs text-slate-500">
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>{alert.location}</span>
                        </div>
                        <div className="flex items-center">
                          <Camera className="h-3 w-3 mr-1" />
                          <span>{alert.cameraId}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{formatTimeAgo(alert.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => acknowledgeAlert(alert.id)}
                      className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs font-medium transition-colors"
                    >
                      Reconocer
                    </button>
                    <button
                      onClick={() => resolveAlert(alert.id)}
                      className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-xs font-medium transition-colors"
                    >
                      Resolver
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Historial de Alertas */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-slate-700">Historial de Alertas</h4>
          <div className="text-sm text-slate-600">
            {alerts.length} alertas totales
          </div>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {alerts.slice(0, 10).map((alert) => (
            <div
              key={alert.id}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                alert.status === 'active' ? 'bg-red-50 border-red-200' :
                alert.status === 'acknowledged' ? 'bg-yellow-50 border-yellow-200' :
                'bg-green-50 border-green-200'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-1 rounded ${getPriorityColor(alert.priority)} text-white`}>
                  {getTypeIcon(alert.type)}
                </div>
                
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-slate-800 text-sm">{alert.title}</span>
                    <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(alert.priority)} text-white`}>
                      {getPriorityText(alert.priority)}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600">
                    {alert.location} • {formatTimeAgo(alert.timestamp)}
                  </div>
                </div>
              </div>
              
              <div className="text-xs text-slate-500">
                {alert.status === 'active' ? 'Activa' :
                 alert.status === 'acknowledged' ? 'Reconocida' : 'Resuelta'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Audio para alertas */}
      <audio ref={audioRef} preload="auto">
        <source src="/alert-sound.mp3" type="audio/mpeg" />
      </audio>
    </div>
  )
}

export default RealTimeAlertSystem
