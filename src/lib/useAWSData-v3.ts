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
  sdkVersion?: string
}

interface UseAWSDataReturn {
  data: SystemStatus | null
  loading: boolean
  error: string | null
  refetch: () => void
  sdkVersion: string
}

export const useAWSDataV3 = (refreshInterval: number = 30000): UseAWSDataReturn => {
  const [data, setData] = useState<SystemStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sdkVersion, setSdkVersion] = useState<string>('unknown')

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Intentar primero con SDK v3
      let response = await fetch('/api/system-status-v3')
      let result = await response.json()
      
      if (result.success) {
        setData(result.data)
        setSdkVersion(result.sdkVersion || 'v3')
        return
      }
      
      // Si falla v3, intentar con v2 como fallback
      response = await fetch('/api/system-status')
      result = await response.json()
      
      if (result.success) {
        setData(result.data)
        setSdkVersion('v2')
      } else {
        setError(result.error || 'Failed to fetch data')
        setSdkVersion('none')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setSdkVersion('none')
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
    refetch: fetchData,
    sdkVersion
  }
}

// Hook específico para métricas procesadas (v3)
export const useProcessedMetricsV3 = () => {
  const { data, loading, error, sdkVersion } = useAWSDataV3()

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
    lastUpdate: new Date(data.timestamp).toLocaleTimeString('es-ES'),
    
    // SDK Version
    sdkVersion: sdkVersion
  } : null

  return {
    metrics: processedMetrics,
    rawData: data,
    loading,
    error,
    sdkVersion
  }
}
