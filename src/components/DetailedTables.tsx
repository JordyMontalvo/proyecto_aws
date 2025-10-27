'use client'

import { DetailedSystemStatus } from '../lib/useDetailedAWSData'
import { 
  Server, 
  Database, 
  HardDrive, 
  Activity, 
  TrendingUp, 
  TrendingDown,
  Clock,
  MapPin,
  Shield,
  Zap
} from 'lucide-react'

interface EC2TableProps {
  data: DetailedSystemStatus['ec2']
}

export function EC2Table({ data }: EC2TableProps) {
  const getStateBadge = (state: string) => {
    switch (state) {
      case 'running': return 'status-badge running'
      case 'stopped': return 'status-badge stopped'
      case 'terminated': return 'status-badge offline'
      default: return 'status-badge warning'
    }
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-white flex items-center">
          <Server className="h-6 w-6 mr-3 text-blue-400" />
          Instancias EC2
        </h3>
        <div className="flex space-x-4 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            <span className="text-white/80">Running: {data.runningCount}</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
            <span className="text-white/80">Stopped: {data.stoppedCount}</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
            <span className="text-white/80">Terminated: {data.terminatedCount}</span>
          </div>
        </div>
      </div>

      <div className="modern-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Estado</th>
              <th>Tipo</th>
              <th>IP Pública</th>
              <th>Zona</th>
              <th>Lanzamiento</th>
            </tr>
          </thead>
          <tbody>
            {data.instances.map((instance) => (
              <tr key={instance.id}>
                <td className="font-mono text-sm text-blue-300">
                  {instance.id}
                </td>
                <td className="font-medium text-white">
                  {instance.name}
                </td>
                <td>
                  <span className={getStateBadge(instance.state)}>
                    {instance.state}
                  </span>
                </td>
                <td className="text-white/80">
                  {instance.type}
                </td>
                <td className="font-mono text-sm text-cyan-300">
                  {instance.publicIp || 'N/A'}
                </td>
                <td className="text-white/80">
                  {instance.availabilityZone}
                </td>
                <td className="text-white/80">
                  {new Date(instance.launchTime).toLocaleDateString('es-ES')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

interface RDSTableProps {
  data: DetailedSystemStatus['rds']
}

export function RDSTable({ data }: RDSTableProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available': return 'status-badge available'
      case 'upgrading': return 'status-badge warning'
      case 'stopped': return 'status-badge stopped'
      default: return 'status-badge warning'
    }
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-white flex items-center">
          <Database className="h-6 w-6 mr-3 text-green-400" />
          Base de Datos RDS
        </h3>
        <div className="flex space-x-4 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            <span className="text-white/80">Available: {data.availableCount}</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-400 rounded-full mr-2"></div>
            <span className="text-white/80">Upgrading: {data.upgradingCount}</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
            <span className="text-white/80">Other: {data.otherStatusCount}</span>
          </div>
        </div>
      </div>

      <div className="modern-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Estado</th>
              <th>Motor</th>
              <th>Clase</th>
              <th>Almacenamiento</th>
              <th>Endpoint</th>
              <th>Zona</th>
            </tr>
          </thead>
          <tbody>
            {data.instances.map((instance) => (
              <tr key={instance.id}>
                <td className="font-mono text-sm text-green-300">
                  {instance.id}
                </td>
                <td>
                  <span className={getStatusBadge(instance.status)}>
                    {instance.status}
                  </span>
                </td>
                <td className="text-white/80">
                  {instance.engine} {instance.engineVersion}
                </td>
                <td className="text-white/80">
                  {instance.instanceClass}
                </td>
                <td className="text-white/80">
                  {instance.allocatedStorage} GB ({instance.storageType})
                </td>
                <td className="font-mono text-sm text-cyan-300">
                  {instance.endpoint || 'N/A'}
                </td>
                <td className="text-white/80">
                  {instance.availabilityZone}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

interface S3TableProps {
  data: DetailedSystemStatus['s3']
}

export function S3Table({ data }: S3TableProps) {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-white flex items-center">
          <HardDrive className="h-6 w-6 mr-3 text-purple-400" />
          Almacenamiento S3
        </h3>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">
            {(data.totalSizeGB || 0).toFixed(2)} GB
          </div>
          <div className="text-sm text-white/80">
            {data.objectCount} objetos
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="data-card">
          <div className="flex items-center mb-2">
            <HardDrive className="h-5 w-5 text-purple-400 mr-2" />
            <span className="font-semibold text-white">Tamaño Total</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {(data.totalSizeGB || 0).toFixed(2)} GB
          </div>
          <div className="text-sm text-white/60">
            {data.totalSizeBytes.toLocaleString()} bytes
          </div>
        </div>

        <div className="data-card">
          <div className="flex items-center mb-2">
            <Activity className="h-5 w-5 text-blue-400 mr-2" />
            <span className="font-semibold text-white">Objetos</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {data.objectCount.toLocaleString()}
          </div>
          <div className="text-sm text-white/60">
            Promedio: {(data.avgObjectSizeMB || 0).toFixed(2)} MB
          </div>
        </div>

        <div className="data-card">
          <div className="flex items-center mb-2">
            <Clock className="h-5 w-5 text-green-400 mr-2" />
            <span className="font-semibold text-white">Última Modificación</span>
          </div>
          <div className="text-sm font-bold text-white">
            {data.lastModified ? 
              new Date(data.lastModified).toLocaleString('es-ES') : 
              'N/A'
            }
          </div>
        </div>
      </div>

      {/* Tipos de archivo */}
      <div className="mb-6">
        <h4 className="font-semibold text-white mb-3">Tipos de Archivo</h4>
        <div className="flex flex-wrap gap-2">
          {Object.entries(data.fileTypes).map(([type, count]) => (
            <div key={type} className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-200 px-3 py-1 rounded-full text-sm border border-purple-400/30">
              {type}: {count}
            </div>
          ))}
        </div>
      </div>

      {/* Archivos recientes */}
      <div>
        <h4 className="font-semibold text-white mb-3">Archivos Recientes</h4>
        <div className="modern-table">
          <table>
            <thead>
              <tr>
                <th>Archivo</th>
                <th>Tamaño</th>
                <th>Modificado</th>
              </tr>
            </thead>
            <tbody>
              {data.recentFiles.slice(0, 5).map((file, index) => (
                <tr key={index}>
                  <td className="font-mono text-sm text-cyan-300">
                    {file.key}
                  </td>
                  <td className="text-white/80">
                    {(file.sizeMB || 0).toFixed(2)} MB
                  </td>
                  <td className="text-white/80">
                    {new Date(file.lastModified).toLocaleString('es-ES')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

interface MetricsCardProps {
  data: DetailedSystemStatus['metrics']
}

export function MetricsCard({ data }: MetricsCardProps) {
  const metrics = [
    {
      name: 'CPU',
      value: data.cpu.average,
      unit: '%',
      trend: data.cpu.trend,
      max: data.cpu.maximum,
      min: data.cpu.minimum,
      dataPoints: data.cpu.dataPoints,
      color: 'blue'
    },
    {
      name: 'Memoria',
      value: data.memory.average,
      unit: '%',
      trend: data.memory.trend,
      max: data.memory.maximum,
      min: data.memory.minimum,
      dataPoints: data.memory.dataPoints,
      color: 'green'
    },
    {
      name: 'Disco',
      value: data.disk.average,
      unit: '%',
      trend: data.disk.trend,
      max: data.disk.maximum,
      min: data.disk.minimum,
      dataPoints: data.disk.dataPoints,
      color: 'purple'
    }
  ]

  return (
    <div className="card">
      <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <Activity className="h-6 w-6 mr-3 text-blue-600" />
        Métricas CloudWatch (24h)
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((metric) => (
          <div key={metric.name} className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-700">{metric.name}</h4>
              <div className={`w-3 h-3 rounded-full bg-${metric.color}-500`}></div>
            </div>
            
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {(metric.value || 0).toFixed(1)}{metric.unit}
            </div>
            
            <div className="flex items-center text-sm text-gray-600 mb-3">
              {metric.trend > 0 ? (
                <TrendingUp className="h-4 w-4 text-red-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
              )}
              <span>
                {metric.trend > 0 ? '+' : ''}{(metric.trend || 0).toFixed(1)}% vs inicio
              </span>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Máximo:</span>
                <span className="font-semibold">{(metric.max || 0).toFixed(1)}{metric.unit}</span>
              </div>
              <div className="flex justify-between">
                <span>Mínimo:</span>
                <span className="font-semibold">{(metric.min || 0).toFixed(1)}{metric.unit}</span>
              </div>
              <div className="flex justify-between">
                <span>Puntos de datos:</span>
                <span className="font-semibold">{metric.dataPoints}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
