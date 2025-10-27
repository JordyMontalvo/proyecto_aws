import AWS from 'aws-sdk'

// Configurar AWS SDK
const configureAWS = () => {
  // Verificar que las credenciales estén disponibles
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    throw new Error('AWS credentials not configured')
  }

  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION || 'us-east-1',
    signatureVersion: 'v4',
    maxRetries: 3,
    retryDelayOptions: {
      base: 300
    }
  })
}

// Inicializar servicios AWS
let cloudWatch: AWS.CloudWatch
let ec2: AWS.EC2
let rds: AWS.RDS
let s3: AWS.S3

const initializeAWSServices = () => {
  try {
    configureAWS()
    cloudWatch = new AWS.CloudWatch()
    ec2 = new AWS.EC2()
    rds = new AWS.RDS()
    s3 = new AWS.S3()
  } catch (error) {
    console.error('Error initializing AWS services:', error)
    throw error
  }
}

// Obtener métricas de CloudWatch
export const getCloudWatchMetrics = async () => {
  try {
    if (!cloudWatch) initializeAWSServices()
    const endTime = new Date()
    const startTime = new Date(endTime.getTime() - 24 * 60 * 60 * 1000) // Últimas 24 horas

    // Métricas de CPU
    const cpuParams = {
      Namespace: 'AWS/EC2',
      MetricName: 'CPUUtilization',
      Dimensions: [
        {
          Name: 'InstanceId',
          Value: 'i-*' // Obtener todas las instancias
        }
      ],
      StartTime: startTime,
      EndTime: endTime,
      Period: 3600, // 1 hora
      Statistics: ['Average']
    }

    const cpuData = await cloudWatch.getMetricStatistics(cpuParams).promise()

    // Métricas de memoria (si están disponibles)
    const memoryParams = {
      Namespace: 'System/Linux',
      MetricName: 'MemoryUtilization',
      StartTime: startTime,
      EndTime: endTime,
      Period: 3600,
      Statistics: ['Average']
    }

    let memoryData
    try {
      memoryData = await cloudWatch.getMetricStatistics(memoryParams).promise()
    } catch (error) {
      console.log('Memory metrics not available')
    }

    return {
      cpu: cpuData.Datapoints || [],
      memory: memoryData?.Datapoints || [],
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    console.error('Error fetching CloudWatch metrics:', error)
    throw error
  }
}

// Obtener estado de instancias EC2
export const getEC2Instances = async () => {
  try {
    if (!ec2) initializeAWSServices()
    const params = {
      Filters: [
        {
          Name: 'tag:Name',
          Values: ['vigila-optimization-asg-instance']
        }
      ]
    }

    const result = await ec2.describeInstances(params).promise()
    
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
    console.error('Error fetching EC2 instances:', error)
    throw error
  }
}

// Obtener estado de RDS
export const getRDSInstances = async () => {
  try {
    if (!rds) initializeAWSServices()
    const params = {
      DBInstanceIdentifier: 'vigila-optimization-db'
    }

    const result = await rds.describeDBInstances(params).promise()
    
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
    console.error('Error fetching RDS instances:', error)
    throw error
  }
}

// Obtener información de S3
export const getS3Info = async () => {
  try {
    if (!s3) initializeAWSServices()
    const bucketName = process.env.S3_BUCKET_NAME || 'vigila-videos-912235389798'
    
    // Obtener información del bucket
    const bucketParams = {
      Bucket: bucketName
    }

    const [bucketInfo, objects] = await Promise.all([
      s3.headBucket(bucketParams).promise().catch(() => null),
      s3.listObjectsV2({
        Bucket: bucketName,
        MaxKeys: 1000
      }).promise()
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
    console.error('Error fetching S3 info:', error)
    throw error
  }
}

// Obtener métricas de Application Load Balancer
export const getALBMetrics = async () => {
  if (!cloudWatch) initializeAWSServices()

  try {
    const endTime = new Date()
    const startTime = new Date(endTime.getTime() - 60 * 60 * 1000) // Última hora

    const params = {
      Namespace: 'AWS/ApplicationELB',
      MetricName: 'TargetResponseTime',
      StartTime: startTime,
      EndTime: endTime,
      Period: 300, // 5 minutos
      Statistics: ['Average']
    }

    const result = await cloudWatch.getMetricStatistics(params).promise()
    
    return {
      responseTime: result.Datapoints || [],
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    console.error('Error fetching ALB metrics:', error)
    throw error
  }
}

// Función de diagnóstico para verificar credenciales
export const testAWSCredentials = async () => {
  try {
    if (!cloudWatch) initializeAWSServices()
    
    // Prueba simple con CloudWatch
    const params = {
      Namespace: 'AWS/EC2',
      MetricName: 'CPUUtilization',
      StartTime: new Date(Date.now() - 3600000), // 1 hora atrás
      EndTime: new Date(),
      Period: 3600,
      Statistics: ['Average']
    }
    
    const result = await cloudWatch.getMetricStatistics(params).promise()
    
    return {
      success: true,
      message: 'Credenciales AWS válidas',
      data: {
        region: AWS.config.region,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID?.substring(0, 8) + '...',
        metricsCount: result.Datapoints?.length || 0
      }
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error desconocido',
      error: error
    }
  }
}

// Función principal para obtener todos los datos del sistema
export const getSystemStatus = async () => {
  try {
    const [metrics, ec2Instances, rdsInstances, s3Info, albMetrics] = await Promise.all([
      getCloudWatchMetrics(),
      getEC2Instances(),
      getRDSInstances(),
      getS3Info(),
      getALBMetrics()
    ])

    return {
      metrics,
      ec2: ec2Instances,
      rds: rdsInstances,
      s3: s3Info,
      alb: albMetrics,
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    console.error('Error getting system status:', error)
    throw error
  }
}
