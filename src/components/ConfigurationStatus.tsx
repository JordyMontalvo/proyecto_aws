'use client'

import { useState, useEffect } from 'react'
import { 
  CheckCircle, 
  AlertTriangle, 
  Cloud, 
  Settings,
  Key,
  Database,
  Globe
} from 'lucide-react'

interface ConfigStatus {
  awsCredentials: boolean
  s3Bucket: boolean
  appUrl: boolean
  region: boolean
}

function ConfigurationStatus() {
  const [configStatus, setConfigStatus] = useState<ConfigStatus>({
    awsCredentials: false,
    s3Bucket: false,
    appUrl: false,
    region: false
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simular verificación de configuración
    const checkConfiguration = async () => {
      try {
        const response = await fetch('/api/s3-upload')
        const result = await response.json()
        
        if (result.success) {
          setConfigStatus({
            awsCredentials: !result.data.simulated,
            s3Bucket: !!result.data.bucketName,
            appUrl: !!process.env.NEXT_PUBLIC_APP_URL,
            region: !!result.data.bucketRegion
          })
        }
      } catch (error) {
        console.error('Error checking configuration:', error)
      } finally {
        setLoading(false)
      }
    }

    checkConfiguration()
  }, [])

  const getStatusIcon = (status: boolean) => {
    return status ? 
      <CheckCircle className="h-5 w-5 text-green-500" /> : 
      <AlertTriangle className="h-5 w-5 text-yellow-500" />
  }

  const getStatusText = (status: boolean) => {
    return status ? 'Configurado' : 'Pendiente'
  }

  const getStatusColor = (status: boolean) => {
    return status ? 'text-green-600' : 'text-yellow-600'
  }

  const allConfigured = Object.values(configStatus).every(status => status)

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-slate-600">Verificando configuración...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-slate-800 flex items-center">
          <Settings className="h-6 w-6 mr-3 text-blue-500" />
          Estado de Configuración
        </h3>
        
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
          allConfigured ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {allConfigured ? 
            <CheckCircle className="h-4 w-4" /> : 
            <AlertTriangle className="h-4 w-4" />
          }
          <span className="text-sm font-medium">
            {allConfigured ? 'Completamente Configurado' : 'Configuración Parcial'}
          </span>
        </div>
      </div>

      {/* Estado General */}
      <div className={`mb-6 p-4 rounded-lg border ${
        allConfigured ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'
      }`}>
        <div className="flex items-center">
          {allConfigured ? 
            <CheckCircle className="h-6 w-6 text-green-500 mr-3" /> : 
            <AlertTriangle className="h-6 w-6 text-yellow-500 mr-3" />
          }
          <div>
            <h4 className={`font-semibold ${allConfigured ? 'text-green-800' : 'text-yellow-800'}`}>
              {allConfigured ? 'Sistema en Modo Producción' : 'Sistema en Modo Demo'}
            </h4>
            <p className={`text-sm ${allConfigured ? 'text-green-600' : 'text-yellow-600'}`}>
              {allConfigured 
                ? 'Todas las funcionalidades están configuradas y funcionando con AWS real.'
                : 'El sistema funciona en modo demo. Configura las credenciales AWS para funcionalidad completa.'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Detalles de Configuración */}
      <div className="space-y-4">
        <h4 className="font-semibold text-slate-700 mb-3">Detalles de Configuración</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Credenciales AWS */}
          <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <Key className="h-5 w-5 text-slate-500" />
              <div>
                <p className="font-medium text-slate-800">Credenciales AWS</p>
                <p className="text-sm text-slate-600">Access Key & Secret Key</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusIcon(configStatus.awsCredentials)}
              <span className={`text-sm font-medium ${getStatusColor(configStatus.awsCredentials)}`}>
                {getStatusText(configStatus.awsCredentials)}
              </span>
            </div>
          </div>

          {/* Bucket S3 */}
          <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <Database className="h-5 w-5 text-slate-500" />
              <div>
                <p className="font-medium text-slate-800">Bucket S3</p>
                <p className="text-sm text-slate-600">vigila-videos-912235389798</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusIcon(configStatus.s3Bucket)}
              <span className={`text-sm font-medium ${getStatusColor(configStatus.s3Bucket)}`}>
                {getStatusText(configStatus.s3Bucket)}
              </span>
            </div>
          </div>

          {/* Región AWS */}
          <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <Globe className="h-5 w-5 text-slate-500" />
              <div>
                <p className="font-medium text-slate-800">Región AWS</p>
                <p className="text-sm text-slate-600">us-east-1</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusIcon(configStatus.region)}
              <span className={`text-sm font-medium ${getStatusColor(configStatus.region)}`}>
                {getStatusText(configStatus.region)}
              </span>
            </div>
          </div>

          {/* URL de la App */}
          <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <Cloud className="h-5 w-5 text-slate-500" />
              <div>
                <p className="font-medium text-slate-800">URL de la App</p>
                <p className="text-sm text-slate-600">Para emails de alerta</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusIcon(configStatus.appUrl)}
              <span className={`text-sm font-medium ${getStatusColor(configStatus.appUrl)}`}>
                {getStatusText(configStatus.appUrl)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Instrucciones */}
      {!allConfigured && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 mb-2">Para Completar la Configuración:</h4>
          <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
            <li>Ve a AWS Console → IAM → Users</li>
            <li>Crea un usuario con permisos de S3</li>
            <li>Genera Access Key y Secret Key</li>
            <li>Agrega las variables en Vercel Dashboard</li>
            <li>Redesplega la aplicación</li>
          </ol>
        </div>
      )}

      {/* Botón de Actualización */}
      <div className="mt-6 text-center">
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
        >
          Actualizar Estado
        </button>
      </div>
    </div>
  )
}

export default ConfigurationStatus
