'use client'

import { useState, useEffect } from 'react'
import { 
  Camera, 
  Video, 
  Download, 
  Eye,
  Clock,
  MapPin,
  Database,
  Cloud,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'
import ModernTable from './ModernTable'

interface CaptureData {
  id: string
  type: 'image' | 'video'
  timestamp: string
  location: string
  cameraId: string
  resolution: string
  size: string
  format: string
  status: 'uploaded_to_s3' | 'local_only' | 'processing'
  url: string
  duration?: string
  thumbnail?: string
}

export default function CameraCaptureTables() {
  const [captures, setCaptures] = useState<CaptureData[]>([])
  const [loading, setLoading] = useState(false)

  // Simular datos de capturas
  useEffect(() => {
    const generateMockCaptures = () => {
      const mockCaptures: CaptureData[] = [
        {
          id: 'capture_1705324245123',
          type: 'image',
          timestamp: '2024-01-15T10:30:45Z',
          location: 'Entrada Principal',
          cameraId: 'cam_1',
          resolution: '1920x1080',
          size: '2.3 MB',
          format: 'JPEG',
          status: 'uploaded_to_s3',
          url: 'https://example.com/capture1.jpg',
          thumbnail: 'https://picsum.photos/100/75?random=1'
        },
        {
          id: 'video_1705324320789',
          type: 'video',
          timestamp: '2024-01-15T10:32:00Z',
          location: 'Patio Trasero',
          cameraId: 'cam_2',
          resolution: '1280x720',
          size: '15.7 MB',
          format: 'WEBM',
          status: 'uploaded_to_s3',
          url: 'https://example.com/video1.webm',
          duration: '00:02:15',
          thumbnail: 'https://picsum.photos/100/75?random=2'
        },
        {
          id: 'capture_1705324395012',
          type: 'image',
          timestamp: '2024-01-15T10:33:15Z',
          location: 'Estacionamiento',
          cameraId: 'cam_3',
          resolution: '1920x1080',
          size: '1.8 MB',
          format: 'JPEG',
          status: 'local_only',
          url: 'https://example.com/capture2.jpg',
          thumbnail: 'https://picsum.photos/100/75?random=3'
        },
        {
          id: 'video_1705324456789',
          type: 'video',
          timestamp: '2024-01-15T10:34:16Z',
          location: 'Recepción',
          cameraId: 'cam_4',
          resolution: '1280x720',
          size: '8.2 MB',
          format: 'WEBM',
          status: 'processing',
          url: 'https://example.com/video2.webm',
          duration: '00:01:30',
          thumbnail: 'https://picsum.photos/100/75?random=4'
        },
        {
          id: 'capture_1705324523456',
          type: 'image',
          timestamp: '2024-01-15T10:35:23Z',
          location: 'Entrada Principal',
          cameraId: 'cam_1',
          resolution: '1920x1080',
          size: '2.1 MB',
          format: 'JPEG',
          status: 'uploaded_to_s3',
          url: 'https://example.com/capture3.jpg',
          thumbnail: 'https://picsum.photos/100/75?random=5'
        }
      ]

      setCaptures(mockCaptures)
    }

    generateMockCaptures()
  }, [])

  const getTypeIcon = (type: string) => {
    return type === 'video' ? 
      <Video className="h-4 w-4 text-blue-500" /> : 
      <Camera className="h-4 w-4 text-green-500" />
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      uploaded_to_s3: { 
        color: 'bg-green-100 text-green-800', 
        icon: <Cloud className="h-3 w-3" />,
        text: 'S3' 
      },
      local_only: { 
        color: 'bg-yellow-100 text-yellow-800', 
        icon: <Database className="h-3 w-3" />,
        text: 'Local' 
      },
      processing: { 
        color: 'bg-blue-100 text-blue-800', 
        icon: <AlertTriangle className="h-3 w-3" />,
        text: 'Procesando' 
      }
    }

    const config = statusConfig[status as keyof typeof statusConfig]
    
    return (
      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.icon}
        <span>{config.text}</span>
      </span>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const formatTimeAgo = (dateString: string) => {
    const now = new Date()
    const captureTime = new Date(dateString)
    const diffMs = now.getTime() - captureTime.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return 'Ahora'
    if (diffMins < 60) return `Hace ${diffMins} min`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `Hace ${diffHours}h`
    const diffDays = Math.floor(diffHours / 24)
    return `Hace ${diffDays}d`
  }

  const captureColumns = [
    { key: 'type', label: 'Tipo', sortable: true, width: '80px' },
    { key: 'thumbnail', label: 'Vista Previa', sortable: false, width: '100px' },
    { key: 'location', label: 'Ubicación', sortable: true, filterable: true },
    { key: 'cameraId', label: 'Cámara', sortable: true },
    { key: 'resolution', label: 'Resolución', sortable: true },
    { key: 'size', label: 'Tamaño', sortable: true, align: 'right' as const },
    { key: 'duration', label: 'Duración', sortable: true, align: 'center' as const },
    { key: 'status', label: 'Estado', sortable: true, width: '120px' },
    { key: 'timestamp', label: 'Fecha/Hora', sortable: true },
    { key: 'timeAgo', label: 'Hace', sortable: true, width: '80px' },
    { key: 'actions', label: 'Acciones', sortable: false, width: '120px' }
  ]

  const processCaptureData = (data: CaptureData[]) => {
    return data.map(capture => ({
      ...capture,
      type: (
        <div className="flex items-center justify-center">
          {getTypeIcon(capture.type)}
        </div>
      ),
      thumbnail: (
        <div className="flex items-center justify-center">
          <img 
            src={capture.thumbnail} 
            alt="Thumbnail" 
            className="w-12 h-9 object-cover rounded border"
          />
        </div>
      ),
      status: getStatusBadge(capture.status),
      timestamp: formatDate(capture.timestamp),
      timeAgo: formatTimeAgo(capture.timestamp),
      actions: (
        <div className="flex items-center space-x-1">
          <button
            onClick={() => window.open(capture.url, '_blank')}
            className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
            title="Ver"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => {
              const link = document.createElement('a')
              link.href = capture.url
              link.download = `${capture.type}_${capture.id}.${capture.format.toLowerCase()}`
              link.click()
            }}
            className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors"
            title="Descargar"
          >
            <Download className="h-4 w-4" />
          </button>
        </div>
      )
    }))
  }

  const handleRefresh = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }

  const handleDownload = () => {
    console.log('Descargando todas las capturas')
    // Implementar descarga masiva aquí
  }

  return (
    <div className="space-y-6">
      {/* Tabla de Capturas */}
      <ModernTable
        title="Capturas de Cámara"
        icon={<Camera className="h-5 w-5" />}
        columns={captureColumns}
        data={processCaptureData(captures)}
        loading={loading}
        onRefresh={handleRefresh}
        onDownload={handleDownload}
        emptyMessage="No hay capturas disponibles"
      />

      {/* Estadísticas de Capturas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Capturas</p>
              <p className="text-2xl font-bold text-blue-800">{captures.length}</p>
            </div>
            <Camera className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Imágenes</p>
              <p className="text-2xl font-bold text-green-800">
                {captures.filter(c => c.type === 'image').length}
              </p>
            </div>
            <Camera className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Videos</p>
              <p className="text-2xl font-bold text-purple-800">
                {captures.filter(c => c.type === 'video').length}
              </p>
            </div>
            <Video className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">En S3</p>
              <p className="text-2xl font-bold text-orange-800">
                {captures.filter(c => c.status === 'uploaded_to_s3').length}
              </p>
            </div>
            <Cloud className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>
    </div>
  )
}
