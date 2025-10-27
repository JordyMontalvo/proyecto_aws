import { 
  CloudWatchClient, 
  GetMetricStatisticsCommand,
  ListMetricsCommand
} from '@aws-sdk/client-cloudwatch'
import { 
  DescribeInstancesCommand,
  EC2Client 
} from '@aws-sdk/client-ec2'
import { 
  DescribeDBInstancesCommand,
  RDSClient 
} from '@aws-sdk/client-rds'
import { 
  HeadBucketCommand,
  ListObjectsV2Command,
  S3Client 
} from '@aws-sdk/client-s3'

// Configurar clientes AWS SDK v3
const createAWSClient = () => {
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    throw new Error('AWS credentials not configured')
  }

  const config = {
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: process.env.AWS_REGION || 'us-east-1',
    maxAttempts: 3,
  }

  return {
    cloudWatch: new CloudWatchClient(config),
    ec2: new EC2Client(config),
    rds: new RDSClient(config),
    s3: new S3Client(config),
  }
}

// Obtener métricas detalladas de CloudWatch
export const getDetailedCloudWatchMetrics = async () => {
  try {
    const clients = createAWSClient()
    
    const endTime = new Date()
    const startTime = new Date(endTime.getTime() - 24 * 60 * 60 * 1000) // Últimas 24 horas

    // Obtener métricas de CPU
    const cpuCommand = new GetMetricStatisticsCommand({
      Namespace: 'AWS/EC2',
      MetricName: 'CPUUtilization',
      StartTime: startTime,
      EndTime: endTime,
      Period: 300, // 5 minutos
      Statistics: ['Average', 'Maximum', 'Minimum']
    })

    // Obtener métricas de memoria (si están disponibles)
    const memoryCommand = new GetMetricStatisticsCommand({
      Namespace: 'CWAgent',
      MetricName: 'mem_used_percent',
      StartTime: startTime,
      EndTime: endTime,
      Period: 300,
      Statistics: ['Average', 'Maximum', 'Minimum']
    })

    // Obtener métricas de disco
    const diskCommand = new GetMetricStatisticsCommand({
      Namespace: 'CWAgent',
      MetricName: 'disk_used_percent',
      StartTime: startTime,
      EndTime: endTime,
      Period: 300,
      Statistics: ['Average', 'Maximum', 'Minimum']
    })

    const [cpuResult, memoryResult, diskResult] = await Promise.all([
      clients.cloudWatch.send(cpuCommand),
      clients.cloudWatch.send(memoryCommand).catch(() => ({ Datapoints: [] })),
      clients.cloudWatch.send(diskCommand).catch(() => ({ Datapoints: [] }))
    ])

    // Procesar datos de CPU
    const cpuData = cpuResult.Datapoints || []
    const cpuAverage = cpuData.length > 0 
      ? cpuData.reduce((sum, point) => sum + (point.Average || 0), 0) / cpuData.length 
      : 0

    // Procesar datos de memoria
    const memoryData = memoryResult.Datapoints || []
    const memoryAverage = memoryData.length > 0 
      ? memoryData.reduce((sum, point) => sum + (point.Average || 0), 0) / memoryData.length 
      : 0

    // Procesar datos de disco
    const diskData = diskResult.Datapoints || []
    const diskAverage = diskData.length > 0 
      ? diskData.reduce((sum, point) => sum + (point.Average || 0), 0) / diskData.length 
      : 0

    return {
      cpu: {
        average: Math.round(cpuAverage * 100) / 100,
        maximum: Math.max(...cpuData.map(p => p.Maximum || 0)),
        minimum: Math.min(...cpuData.map(p => p.Minimum || 0)),
        dataPoints: cpuData.length,
        trend: cpuData.length > 1 ? 
          (cpuData[cpuData.length - 1].Average || 0) - (cpuData[0].Average || 0) : 0
      },
      memory: {
        average: Math.round(memoryAverage * 100) / 100,
        maximum: Math.max(...memoryData.map(p => p.Maximum || 0)),
        minimum: Math.min(...memoryData.map(p => p.Minimum || 0)),
        dataPoints: memoryData.length,
        trend: memoryData.length > 1 ? 
          (memoryData[memoryData.length - 1].Average || 0) - (memoryData[0].Average || 0) : 0
      },
      disk: {
        average: Math.round(diskAverage * 100) / 100,
        maximum: Math.max(...diskData.map(p => p.Maximum || 0)),
        minimum: Math.min(...diskData.map(p => p.Minimum || 0)),
        dataPoints: diskData.length,
        trend: diskData.length > 1 ? 
          (diskData[diskData.length - 1].Average || 0) - (diskData[0].Average || 0) : 0
      },
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    console.error('Error fetching detailed CloudWatch metrics:', error)
    throw error
  }
}

// Obtener información detallada de instancias EC2
export const getDetailedEC2Instances = async () => {
  try {
    const clients = createAWSClient()
    
    const command = new DescribeInstancesCommand({
      Filters: [
        {
          Name: 'tag:Name',
          Values: ['vigila-optimization-asg-instance']
        }
      ]
    })

    const result = await clients.ec2.send(command)
    
    const instances = result.Reservations?.flatMap(reservation => 
      reservation.Instances?.map(instance => ({
        id: instance.InstanceId,
        name: instance.Tags?.find(tag => tag.Key === 'Name')?.Value || 'Unknown',
        state: instance.State?.Name,
        type: instance.InstanceType,
        launchTime: instance.LaunchTime,
        publicIp: instance.PublicIpAddress,
        privateIp: instance.PrivateIpAddress,
        availabilityZone: instance.Placement?.AvailabilityZone,
        securityGroups: instance.SecurityGroups?.map(sg => ({
          id: sg.GroupId,
          name: sg.GroupName
        })) || [],
        vpcId: instance.VpcId,
        subnetId: instance.SubnetId,
        architecture: instance.Architecture,
        platform: instance.Platform,
        monitoring: instance.Monitoring?.State,
        tags: instance.Tags?.reduce((acc, tag) => {
          if (tag.Key && tag.Value) {
            acc[tag.Key] = tag.Value
          }
          return acc
        }, {} as Record<string, string>)
      })) || []
    ) || []

    return {
      instances,
      totalCount: instances.length,
      runningCount: instances.filter(i => i.state === 'running').length,
      stoppedCount: instances.filter(i => i.state === 'stopped').length,
      terminatedCount: instances.filter(i => i.state === 'terminated').length
    }
  } catch (error) {
    console.error('Error fetching detailed EC2 instances:', error)
    throw error
  }
}

// Obtener información detallada de RDS
export const getDetailedRDSInstances = async () => {
  try {
    const clients = createAWSClient()
    
    const command = new DescribeDBInstancesCommand({
      DBInstanceIdentifier: 'vigila-optimization-db'
    })

    const result = await clients.rds.send(command)
    
    const instances = result.DBInstances?.map(instance => ({
      id: instance.DBInstanceIdentifier,
      status: instance.DBInstanceStatus,
      engine: instance.Engine,
      engineVersion: instance.EngineVersion,
      instanceClass: instance.DBInstanceClass,
      allocatedStorage: instance.AllocatedStorage,
      storageType: instance.StorageType,
      endpoint: instance.Endpoint?.Address,
      port: instance.Endpoint?.Port,
      availabilityZone: instance.AvailabilityZone,
      multiAZ: instance.MultiAZ,
      backupRetentionPeriod: instance.BackupRetentionPeriod,
      monitoringInterval: instance.MonitoringInterval,
      monitoringRoleArn: instance.MonitoringRoleArn,
      vpcSecurityGroups: instance.VpcSecurityGroups?.map(sg => ({
        id: sg.VpcSecurityGroupId,
        status: sg.Status
      })) || [],
      dbSubnetGroup: instance.DBSubnetGroup?.DBSubnetGroupName,
      vpcId: instance.DBSubnetGroup?.VpcId,
      publiclyAccessible: instance.PubliclyAccessible,
      storageEncrypted: instance.StorageEncrypted,
      performanceInsightsEnabled: instance.PerformanceInsightsEnabled,
      deletionProtection: instance.DeletionProtection,
      createdTime: instance.InstanceCreateTime
    })) || []

    return {
      instances,
      totalCount: instances.length,
      availableCount: instances.filter(i => i.status === 'available').length,
      upgradingCount: instances.filter(i => i.status === 'upgrading').length,
      otherStatusCount: instances.filter(i => !['available', 'upgrading'].includes(i.status)).length
    }
  } catch (error) {
    console.error('Error fetching detailed RDS instances:', error)
    throw error
  }
}

// Obtener información detallada de S3
export const getDetailedS3Info = async () => {
  try {
    const clients = createAWSClient()
    
    const bucketName = process.env.S3_BUCKET_NAME || 'vigila-videos-912235389798'
    
    // Obtener información del bucket
    const headCommand = new HeadBucketCommand({
      Bucket: bucketName
    })

    const listCommand = new ListObjectsV2Command({
      Bucket: bucketName,
      MaxKeys: 1000
    })

    const [bucketInfo, objects] = await Promise.all([
      clients.s3.send(headCommand).catch(() => null),
      clients.s3.send(listCommand)
    ])

    // Calcular estadísticas
    const totalSize = objects.Contents?.reduce((sum, obj) => sum + (obj.Size || 0), 0) || 0
    const objectCount = objects.Contents?.length || 0
    const avgObjectSize = objectCount > 0 ? totalSize / objectCount : 0

    // Agrupar por tipo de archivo
    const fileTypes = objects.Contents?.reduce((acc, obj) => {
      const extension = obj.Key?.split('.').pop()?.toLowerCase() || 'unknown'
      acc[extension] = (acc[extension] || 0) + 1
      return acc
    }, {} as Record<string, number>) || {}

    // Archivos más recientes
    const recentFiles = objects.Contents
      ?.sort((a, b) => (b.LastModified?.getTime() || 0) - (a.LastModified?.getTime() || 0))
      ?.slice(0, 10) || []

    return {
      bucketName,
      exists: !!bucketInfo,
      objectCount,
      totalSizeBytes: totalSize,
      totalSizeGB: totalSize / (1024 * 1024 * 1024),
      avgObjectSizeBytes: avgObjectSize,
      avgObjectSizeMB: avgObjectSize / (1024 * 1024),
      fileTypes,
      recentFiles: recentFiles.map(file => ({
        key: file.Key,
        size: file.Size,
        lastModified: file.LastModified,
        sizeMB: (file.Size || 0) / (1024 * 1024)
      })),
      lastModified: objects.Contents?.[0]?.LastModified
    }
  } catch (error) {
    console.error('Error fetching detailed S3 info:', error)
    throw error
  }
}

// Función principal para obtener todos los datos detallados del sistema
export const getDetailedSystemStatus = async () => {
  try {
    const [metrics, ec2Info, rdsInfo, s3Info] = await Promise.all([
      getDetailedCloudWatchMetrics(),
      getDetailedEC2Instances(),
      getDetailedRDSInstances(),
      getDetailedS3Info()
    ])

    return {
      metrics,
      ec2: ec2Info,
      rds: rdsInfo,
      s3: s3Info,
      timestamp: new Date().toISOString(),
      sdkVersion: 'v3'
    }
  } catch (error) {
    console.error('Error getting detailed system status:', error)
    throw error
  }
}
