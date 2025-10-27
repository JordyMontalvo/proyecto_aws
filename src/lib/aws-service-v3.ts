import { 
  CloudWatchClient, 
  GetMetricStatisticsCommand
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

// Función de diagnóstico mejorada
export const testAWSCredentialsV3 = async () => {
  try {
    const clients = createAWSClient()
    
    // Prueba simple con CloudWatch
    const command = new GetMetricStatisticsCommand({
      Namespace: 'AWS/EC2',
      MetricName: 'CPUUtilization',
      StartTime: new Date(Date.now() - 3600000), // 1 hora atrás
      EndTime: new Date(),
      Period: 3600,
      Statistics: ['Average']
    })
    
    const result = await clients.cloudWatch.send(command)
    
    return {
      success: true,
      message: 'Credenciales AWS válidas (SDK v3)',
      data: {
        region: process.env.AWS_REGION || 'us-east-1',
        accessKeyId: process.env.AWS_ACCESS_KEY_ID?.substring(0, 8) + '...',
        metricsCount: result.Datapoints?.length || 0,
        sdkVersion: 'v3'
      }
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error desconocido',
      error: error,
      sdkVersion: 'v3'
    }
  }
}

// Obtener métricas de CloudWatch (SDK v3)
export const getCloudWatchMetricsV3 = async () => {
  try {
    const clients = createAWSClient()
    
    const endTime = new Date()
    const startTime = new Date(endTime.getTime() - 24 * 60 * 60 * 1000) // Últimas 24 horas

    const command = new GetMetricStatisticsCommand({
      Namespace: 'AWS/EC2',
      MetricName: 'CPUUtilization',
      StartTime: startTime,
      EndTime: endTime,
      Period: 3600, // 1 hora
      Statistics: ['Average']
    })

    const result = await clients.cloudWatch.send(command)
    
    return {
      cpu: result.Datapoints || [],
      memory: [], // CloudWatch no tiene métricas de memoria por defecto
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    console.error('Error fetching CloudWatch metrics (v3):', error)
    throw error
  }
}

// Obtener estado de instancias EC2 (SDK v3)
export const getEC2InstancesV3 = async () => {
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
        state: instance.State?.Name,
        type: instance.InstanceType,
        launchTime: instance.LaunchTime,
        publicIp: instance.PublicIpAddress,
        privateIp: instance.PrivateIpAddress,
        tags: instance.Tags?.reduce((acc, tag) => {
          if (tag.Key && tag.Value) {
            acc[tag.Key] = tag.Value
          }
          return acc
        }, {} as Record<string, string>)
      })) || []
    ) || []

    return instances
  } catch (error) {
    console.error('Error fetching EC2 instances (v3):', error)
    throw error
  }
}

// Obtener estado de RDS (SDK v3)
export const getRDSInstancesV3 = async () => {
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
      endpoint: instance.Endpoint?.Address,
      port: instance.Endpoint?.Port,
      availabilityZone: instance.AvailabilityZone,
      multiAZ: instance.MultiAZ,
      backupRetentionPeriod: instance.BackupRetentionPeriod,
      monitoringInterval: instance.MonitoringInterval
    })) || []

    return instances
  } catch (error) {
    console.error('Error fetching RDS instances (v3):', error)
    throw error
  }
}

// Obtener información de S3 (SDK v3)
export const getS3InfoV3 = async () => {
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

    // Calcular tamaño total
    const totalSize = objects.Contents?.reduce((sum, obj) => sum + (obj.Size || 0), 0) || 0
    const objectCount = objects.Contents?.length || 0

    return {
      bucketName,
      exists: !!bucketInfo,
      objectCount,
      totalSizeBytes: totalSize,
      totalSizeGB: totalSize / (1024 * 1024 * 1024),
      lastModified: objects.Contents?.[0]?.LastModified
    }
  } catch (error) {
    console.error('Error fetching S3 info (v3):', error)
    throw error
  }
}

// Función principal para obtener todos los datos del sistema (SDK v3)
export const getSystemStatusV3 = async () => {
  try {
    const [metrics, ec2Instances, rdsInstances, s3Info] = await Promise.all([
      getCloudWatchMetricsV3(),
      getEC2InstancesV3(),
      getRDSInstancesV3(),
      getS3InfoV3()
    ])

    return {
      metrics,
      ec2: ec2Instances,
      rds: rdsInstances,
      s3: s3Info,
      alb: { responseTime: [], timestamp: new Date().toISOString() }, // Placeholder
      timestamp: new Date().toISOString(),
      sdkVersion: 'v3'
    }
  } catch (error) {
    console.error('Error getting system status (v3):', error)
    throw error
  }
}
