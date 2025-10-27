import { useState, useEffect } from 'react'

interface SystemStatus {
  metrics: {
    cpu: any[]
    memory: any[]
    timestamp: string
  }
  ec2: Array<{
    id: string
    state: string
    type: string
    launchTime: Date
    publicIp?: string
    privateIp?: string
    tags: Record<string, string>
  }>
  rds: Array<{
    id: string
    status: string
    engine: string
    engineVersion: string
    instanceClass: string
    allocatedStorage: number
    endpoint?: string
    port?: number
  }>
  s3: {
    bucketName: string
    exists: boolean
    objectCount: number
    totalSizeBytes: number
    totalSizeGB: number
    lastModified?: Date
  }
  alb: {
    responseTime: any[]
    timestamp: string
  }
  timestamp: string
}

interface UseAWSDataReturn {
  data: SystemStatus | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export const useAWSData = (refreshInterval: number = 30000): UseAWSDataReturn => {
  const [data, setData] = useState<SystemStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/system-status')
      const result = await response.json()
      
      if (result.success) {
        setData(result.data)
      } else {
        setError(result.error || 'Failed to fetch data')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    
    const interval = setInterval(fetchData, refreshInterval)
    
    return () => clearInterval(interval)
  }, [refreshInterval])

  return {
    data,
    loading,
    error,
    refetch: fetchData
  }
}

// Hook específico para métricas procesadas
export const useProcessedMetrics = () => {
  const { data, loading, error } = useAWSData()

  const processedMetrics = data ? {
    // CPU promedio de las últimas 24 horas
    cpuUsage: data.metrics.cpu.length > 0 
      ? Math.round(data.metrics.cpu.reduce((sum, point) => sum + (point.Average || 0), 0) / data.metrics.cpu.length)
      : 0,
    
    // Memoria promedio
    memoryUsage: data.metrics.memory.length > 0
      ? Math.round(data.metrics.memory.reduce((sum, point) => sum + (point.Average || 0), 0) / data.metrics.memory.length)
      : 0,
    
    // Tiempo de respuesta promedio del ALB
    responseTime: data.alb.responseTime.length > 0
      ? Math.round(data.alb.responseTime.reduce((sum, point) => sum + (point.Average || 0), 0) / data.alb.responseTime.length)
      : 0,
    
    // Estado de servicios
    ec2Status: data.ec2.length > 0 ? data.ec2.every(instance => instance.state === 'running') : false,
    rdsStatus: data.rds.length > 0 ? data.rds.every(db => db.status === 'available') : false,
    s3Status: data.s3.exists,
    
    // Información de almacenamiento
    storageUsed: data.s3.totalSizeGB,
    storageObjects: data.s3.objectCount,
    
    // Información de instancias
    activeInstances: data.ec2.filter(instance => instance.state === 'running').length,
    totalInstances: data.ec2.length,
    
    // Última actualización
    lastUpdate: new Date(data.timestamp).toLocaleTimeString('es-ES')
  } : null

  return {
    metrics: processedMetrics,
    rawData: data,
    loading,
    error
  }
}
