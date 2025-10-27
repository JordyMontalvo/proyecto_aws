'use client'

import { useState, useEffect } from 'react'
import { 
  Server, 
  Database, 
  HardDrive, 
  Activity,
  Download,
  RefreshCw,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin
} from 'lucide-react'
import ModernTable from './ModernTable'

interface EC2Instance {
  id: string
  name: string
  type: string
  state: string
  publicIp: string
  privateIp: string
  launchTime: string
  region: string
  vpc: string
  securityGroups: string[]
}

interface RDSInstance {
  id: string
  engine: string
  version: string
  status: string
  endpoint: string
  port: number
  size: string
  multiAZ: boolean
  backupRetention: number
  createdTime: string
}

interface S3Bucket {
  name: string
  region: string
  size: string
  objects: number
  lastModified: string
  versioning: boolean
  encryption: boolean
  publicAccess: boolean
}

export default function AWSDataTables() {
  const [ec2Data, setEc2Data] = useState<EC2Instance[]>([])
  const [rdsData, setRdsData] = useState<RDSInstance[]>([])
  const [s3Data, setS3Data] = useState<S3Bucket[]>([])
  const [loading, setLoading] = useState(true)

  // Simular datos de AWS
  useEffect(() => {
    const generateMockData = () => {
      // Datos EC2
      const ec2Instances: EC2Instance[] = [
        {
          id: 'i-0123456789abcdef0',
          name: 'Web-Server-01',
          type: 't3.medium',
          state: 'running',
          publicIp: '54.123.45.67',
          privateIp: '10.0.1.100',
          launchTime: '2024-01-15T10:30:00Z',
          region: 'us-east-1',
          vpc: 'vpc-12345678',
          securityGroups: ['sg-web', 'sg-ssh']
        },
        {
          id: 'i-0987654321fedcba0',
          name: 'Database-Server',
          type: 't3.large',
          state: 'running',
          publicIp: '54.123.45.68',
          privateIp: '10.0.2.100',
          launchTime: '2024-01-10T08:15:00Z',
          region: 'us-east-1',
          vpc: 'vpc-12345678',
          securityGroups: ['sg-database']
        },
        {
          id: 'i-0abcdef1234567890',
          name: 'Backup-Server',
          type: 't3.small',
          state: 'stopped',
          publicIp: '-',
          privateIp: '10.0.3.100',
          launchTime: '2024-01-20T14:45:00Z',
          region: 'us-east-1',
          vpc: 'vpc-12345678',
          securityGroups: ['sg-backup']
        }
      ]

      // Datos RDS
      const rdsInstances: RDSInstance[] = [
        {
          id: 'db-instance-01',
          engine: 'MySQL',
          version: '8.0.35',
          status: 'available',
          endpoint: 'db-instance-01.abc123.us-east-1.rds.amazonaws.com',
          port: 3306,
          size: 'db.t3.micro',
          multiAZ: false,
          backupRetention: 7,
          createdTime: '2024-01-05T09:00:00Z'
        },
        {
          id: 'db-instance-02',
          engine: 'PostgreSQL',
          version: '15.4',
          status: 'available',
          endpoint: 'db-instance-02.def456.us-east-1.rds.amazonaws.com',
          port: 5432,
          size: 'db.t3.small',
          multiAZ: true,
          backupRetention: 14,
          createdTime: '2024-01-12T11:30:00Z'
        }
      ]

      // Datos S3
      const s3Buckets: S3Bucket[] = [
        {
          name: 'proyecto-aws-storage',
          region: 'us-east-1',
          size: '2.5 GB',
          objects: 1247,
          lastModified: '2024-01-20T16:30:00Z',
          versioning: true,
          encryption: true,
          publicAccess: false
        },
        {
          name: 'proyecto-aws-backups',
          region: 'us-east-1',
          size: '15.8 GB',
          objects: 3421,
          lastModified: '2024-01-20T18:45:00Z',
          versioning: false,
          encryption: true,
          publicAccess: false
        },
        {
          name: 'proyecto-aws-logs',
          region: 'us-east-1',
          size: '856 MB',
          objects: 892,
          lastModified: '2024-01-20T19:15:00Z',
          versioning: false,
          encryption: false,
          publicAccess: false
        }
      ]

      setEc2Data(ec2Instances)
      setRdsData(rdsInstances)
      setS3Data(s3Buckets)
      setLoading(false)
    }

    generateMockData()
  }, [])

  const getStateBadge = (state: string) => {
    const stateColors = {
      running: 'bg-green-100 text-green-800',
      stopped: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
      stopping: 'bg-orange-100 text-orange-800'
    }
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${stateColors[state as keyof typeof stateColors] || 'bg-gray-100 text-gray-800'}`}>
        {state}
      </span>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
      case 'available':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'stopped':
      case 'stopping':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const ec2Columns = [
    { key: 'status', label: 'Estado', sortable: true, width: '100px' },
    { key: 'name', label: 'Nombre', sortable: true, filterable: true },
    { key: 'id', label: 'ID de Instancia', sortable: true, filterable: true },
    { key: 'type', label: 'Tipo', sortable: true },
    { key: 'publicIp', label: 'IP Pública', sortable: true },
    { key: 'privateIp', label: 'IP Privada', sortable: true },
    { key: 'region', label: 'Región', sortable: true },
    { key: 'launchTime', label: 'Fecha de Lanzamiento', sortable: true }
  ]

  const rdsColumns = [
    { key: 'status', label: 'Estado', sortable: true, width: '100px' },
    { key: 'id', label: 'ID de Instancia', sortable: true, filterable: true },
    { key: 'engine', label: 'Motor', sortable: true },
    { key: 'version', label: 'Versión', sortable: true },
    { key: 'endpoint', label: 'Endpoint', sortable: true, filterable: true },
    { key: 'port', label: 'Puerto', sortable: true, align: 'center' as const },
    { key: 'size', label: 'Tamaño', sortable: true },
    { key: 'multiAZ', label: 'Multi-AZ', sortable: true, align: 'center' as const },
    { key: 'createdTime', label: 'Fecha de Creación', sortable: true }
  ]

  const s3Columns = [
    { key: 'name', label: 'Nombre del Bucket', sortable: true, filterable: true },
    { key: 'region', label: 'Región', sortable: true },
    { key: 'size', label: 'Tamaño', sortable: true, align: 'right' as const },
    { key: 'objects', label: 'Objetos', sortable: true, align: 'right' as const },
    { key: 'versioning', label: 'Versionado', sortable: true, align: 'center' as const },
    { key: 'encryption', label: 'Encriptación', sortable: true, align: 'center' as const },
    { key: 'publicAccess', label: 'Acceso Público', sortable: true, align: 'center' as const },
    { key: 'lastModified', label: 'Última Modificación', sortable: true }
  ]

  const processEC2Data = (data: EC2Instance[]) => {
    return data.map(instance => ({
      ...instance,
      status: (
        <div className="flex items-center space-x-2">
          {getStatusIcon(instance.state)}
          {getStateBadge(instance.state)}
        </div>
      ),
      launchTime: formatDate(instance.launchTime),
      securityGroups: instance.securityGroups.join(', ')
    }))
  }

  const processRDSData = (data: RDSInstance[]) => {
    return data.map(instance => ({
      ...instance,
      status: (
        <div className="flex items-center space-x-2">
          {getStatusIcon(instance.status)}
          {getStateBadge(instance.status)}
        </div>
      ),
      multiAZ: instance.multiAZ ? 'Sí' : 'No',
      createdTime: formatDate(instance.createdTime)
    }))
  }

  const processS3Data = (data: S3Bucket[]) => {
    return data.map(bucket => ({
      ...bucket,
      versioning: bucket.versioning ? '✅' : '❌',
      encryption: bucket.encryption ? '✅' : '❌',
      publicAccess: bucket.publicAccess ? '⚠️' : '🔒',
      lastModified: formatDate(bucket.lastModified)
    }))
  }

  const handleRefresh = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }

  const handleDownload = (type: string) => {
    console.log(`Descargando datos de ${type}`)
    // Implementar descarga real aquí
  }

  return (
    <div className="space-y-6">
      {/* Tabla EC2 */}
      <ModernTable
        title="Instancias EC2"
        icon={<Server className="h-5 w-5" />}
        columns={ec2Columns}
        data={processEC2Data(ec2Data)}
        loading={loading}
        onRefresh={handleRefresh}
        onDownload={() => handleDownload('EC2')}
        emptyMessage="No hay instancias EC2 disponibles"
      />

      {/* Tabla RDS */}
      <ModernTable
        title="Instancias RDS"
        icon={<Database className="h-5 w-5" />}
        columns={rdsColumns}
        data={processRDSData(rdsData)}
        loading={loading}
        onRefresh={handleRefresh}
        onDownload={() => handleDownload('RDS')}
        emptyMessage="No hay instancias RDS disponibles"
      />

      {/* Tabla S3 */}
      <ModernTable
        title="Buckets S3"
        icon={<HardDrive className="h-5 w-5" />}
        columns={s3Columns}
        data={processS3Data(s3Data)}
        loading={loading}
        onRefresh={handleRefresh}
        onDownload={() => handleDownload('S3')}
        emptyMessage="No hay buckets S3 disponibles"
      />
    </div>
  )
}
