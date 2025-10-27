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
  const getStateColor = (state: string) => {
    switch (state) {
      case 'running': return 'text-green-600 bg-green-100'
      case 'stopped': return 'text-red-600 bg-red-100'
      case 'terminated': return 'text-gray-600 bg-gray-100'
      default: return 'text-yellow-600 bg-yellow-100'
    }
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900 flex items-center">
          <Server className="h-6 w-6 mr-3 text-blue-600" />
          Instancias EC2
        </h3>
        <div className="flex space-x-4 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span>Running: {data.runningCount}</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <span>Stopped: {data.stoppedCount}</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-500 rounded-full mr-2"></div>
            <span>Terminated: {data.terminatedCount}</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">ID</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Nombre</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Estado</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Tipo</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">IP Pública</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Zona</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Lanzamiento</th>
            </tr>
          </thead>
          <tbody>
            {data.instances.map((instance) => (
              <tr key={instance.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 font-mono text-sm text-gray-600">
                  {instance.id}
                </td>
                <td className="py-3 px-4 font-medium text-gray-900">
                  {instance.name}
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStateColor(instance.state)}`}>
                    {instance.state}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-600">
                  {instance.type}
                </td>
                <td className="py-3 px-4 font-mono text-sm text-gray-600">
                  {instance.publicIp || 'N/A'}
                </td>
                <td className="py-3 px-4 text-gray-600">
                  {instance.availabilityZone}
                </td>
                <td className="py-3 px-4 text-gray-600">
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
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'text-green-600 bg-green-100'
      case 'upgrading': return 'text-blue-600 bg-blue-100'
      case 'stopped': return 'text-red-600 bg-red-100'
      default: return 'text-yellow-600 bg-yellow-100'
    }
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900 flex items-center">
          <Database className="h-6 w-6 mr-3 text-green-600" />
          Base de Datos RDS
        </h3>
        <div className="flex space-x-4 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span>Available: {data.availableCount}</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span>Upgrading: {data.upgradingCount}</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
            <span>Other: {data.otherStatusCount}</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">ID</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Estado</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Motor</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Clase</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Almacenamiento</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Endpoint</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Zona</th>
            </tr>
          </thead>
          <tbody>
            {data.instances.map((instance) => (
              <tr key={instance.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 font-mono text-sm text-gray-600">
                  {instance.id}
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(instance.status)}`}>
                    {instance.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-600">
                  {instance.engine} {instance.engineVersion}
                </td>
                <td className="py-3 px-4 text-gray-600">
                  {instance.instanceClass}
                </td>
                <td className="py-3 px-4 text-gray-600">
                  {instance.allocatedStorage} GB ({instance.storageType})
                </td>
                <td className="py-3 px-4 font-mono text-sm text-gray-600">
                  {instance.endpoint || 'N/A'}
                </td>
                <td className="py-3 px-4 text-gray-600">
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
        <h3 className="text-2xl font-bold text-gray-900 flex items-center">
          <HardDrive className="h-6 w-6 mr-3 text-purple-600" />
          Almacenamiento S3
        </h3>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">
            {data.totalSizeGB.toFixed(2)} GB
          </div>
          <div className="text-sm text-gray-600">
            {data.objectCount} objetos
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <HardDrive className="h-5 w-5 text-gray-600 mr-2" />
            <span className="font-semibold text-gray-700">Tamaño Total</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {data.totalSizeGB.toFixed(2)} GB
          </div>
          <div className="text-sm text-gray-600">
            {data.totalSizeBytes.toLocaleString()} bytes
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <Activity className="h-5 w-5 text-gray-600 mr-2" />
            <span className="font-semibold text-gray-700">Objetos</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {data.objectCount.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">
            Promedio: {data.avgObjectSizeMB.toFixed(2)} MB
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <Clock className="h-5 w-5 text-gray-600 mr-2" />
            <span className="font-semibold text-gray-700">Última Modificación</span>
          </div>
          <div className="text-sm font-bold text-gray-900">
            {data.lastModified ? 
              new Date(data.lastModified).toLocaleString('es-ES') : 
              'N/A'
            }
          </div>
        </div>
      </div>

      {/* Tipos de archivo */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-700 mb-3">Tipos de Archivo</h4>
        <div className="flex flex-wrap gap-2">
          {Object.entries(data.fileTypes).map(([type, count]) => (
            <div key={type} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              {type}: {count}
            </div>
          ))}
        </div>
      </div>

      {/* Archivos recientes */}
      <div>
        <h4 className="font-semibold text-gray-700 mb-3">Archivos Recientes</h4>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-3 font-semibold text-gray-700">Archivo</th>
                <th className="text-left py-2 px-3 font-semibold text-gray-700">Tamaño</th>
                <th className="text-left py-2 px-3 font-semibold text-gray-700">Modificado</th>
              </tr>
            </thead>
            <tbody>
              {data.recentFiles.slice(0, 5).map((file, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-2 px-3 font-mono text-sm text-gray-600">
                    {file.key}
                  </td>
                  <td className="py-2 px-3 text-gray-600">
                    {file.sizeMB.toFixed(2)} MB
                  </td>
                  <td className="py-2 px-3 text-gray-600">
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
              {metric.value.toFixed(1)}{metric.unit}
            </div>
            
            <div className="flex items-center text-sm text-gray-600 mb-3">
              {metric.trend > 0 ? (
                <TrendingUp className="h-4 w-4 text-red-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
              )}
              <span>
                {metric.trend > 0 ? '+' : ''}{metric.trend.toFixed(1)}% vs inicio
              </span>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Máximo:</span>
                <span className="font-semibold">{metric.max.toFixed(1)}{metric.unit}</span>
              </div>
              <div className="flex justify-between">
                <span>Mínimo:</span>
                <span className="font-semibold">{metric.min.toFixed(1)}{metric.unit}</span>
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
