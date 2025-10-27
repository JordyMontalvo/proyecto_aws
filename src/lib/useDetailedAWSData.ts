import { useState, useEffect } from 'react'

interface DetailedSystemStatus {
  metrics: {
    cpu: {
      average: number
      maximum: number
      minimum: number
      dataPoints: number
      trend: number
    }
    memory: {
      average: number
      maximum: number
      minimum: number
      dataPoints: number
      trend: number
    }
    disk: {
      average: number
      maximum: number
      minimum: number
      dataPoints: number
      trend: number
    }
    timestamp: string
  }
  ec2: {
    instances: Array<{
      id: string
      name: string
      state: string
      type: string
      launchTime: Date
      publicIp?: string
      privateIp?: string
      availabilityZone: string
      securityGroups: Array<{id: string, name: string}>
      vpcId: string
      subnetId: string
      architecture: string
      platform?: string
      monitoring: string
      tags: Record<string, string>
    }>
    totalCount: number
    runningCount: number
    stoppedCount: number
    terminatedCount: number
  }
  rds: {
    instances: Array<{
      id: string
      status: string
      engine: string
      engineVersion: string
      instanceClass: string
      allocatedStorage: number
      storageType: string
      endpoint?: string
      port?: number
      availabilityZone: string
      multiAZ: boolean
      backupRetentionPeriod: number
      monitoringInterval: number
      vpcSecurityGroups: Array<{id: string, status: string}>
      dbSubnetGroup: string
      vpcId: string
      publiclyAccessible: boolean
      storageEncrypted: boolean
      performanceInsightsEnabled: boolean
      deletionProtection: boolean
      createdTime: Date
    }>
    totalCount: number
    availableCount: number
    upgradingCount: number
    otherStatusCount: number
  }
  s3: {
    bucketName: string
    exists: boolean
    objectCount: number
    totalSizeBytes: number
    totalSizeGB: number
    avgObjectSizeBytes: number
    avgObjectSizeMB: number
    fileTypes: Record<string, number>
    recentFiles: Array<{
      key: string
      size: number
      lastModified: Date
      sizeMB: number
    }>
    lastModified?: Date
  }
  timestamp: string
  sdkVersion: string
}

interface UseDetailedAWSDataReturn {
  data: DetailedSystemStatus | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export const useDetailedAWSData = (refreshInterval: number = 30000): UseDetailedAWSDataReturn => {
  const [data, setData] = useState<DetailedSystemStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/detailed-status')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      
      if (result.success) {
        setData(result.data)
      } else {
        setError(result.error || 'Failed to fetch detailed data')
      }
    } catch (err) {
      console.error('Error fetching detailed AWS data:', err)
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
