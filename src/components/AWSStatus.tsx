'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, AlertCircle, Loader } from 'lucide-react'

interface AWSStatusProps {
  data: any
  loading: boolean
  error: string | null
  sdkVersion?: string
}

export default function AWSStatus({ data, loading, error, sdkVersion }: AWSStatusProps) {
  const [apiTest, setApiTest] = useState<{
    status: 'idle' | 'testing' | 'success' | 'error'
    response?: any
    error?: string
  }>({ status: 'idle' })

  const testDiagnostic = async () => {
    setApiTest({ status: 'testing' })
    try {
      const response = await fetch('/api/diagnostic-aws')
      const result = await response.json()
      
      if (result.success) {
        setApiTest({ status: 'success', response: result })
      } else {
        setApiTest({ status: 'error', error: result.error })
      }
    } catch (err) {
      setApiTest({ status: 'error', error: err instanceof Error ? err.message : 'Unknown error' })
    }
  }

  return (
    <div className="card">
      <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
        <AlertCircle className="h-6 w-6 mr-3 text-blue-400" />
        Estado de Conexión AWS
      </h3>
      
      <div className="space-y-4">
        {/* Estado del Hook */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg border border-blue-400/20">
          <span className="font-medium text-white">Hook useAWSData:</span>
          <div className="flex items-center space-x-2">
            {loading && <Loader className="h-4 w-4 animate-spin text-blue-400" />}
            {error && <XCircle className="h-4 w-4 text-red-400" />}
            {data && !loading && !error && <CheckCircle className="h-4 w-4 text-green-400" />}
            <span className={`text-sm font-semibold ${
              loading ? 'text-blue-400' : 
              error ? 'text-red-400' : 
              data ? 'text-green-400' : 'text-gray-400'
            }`}>
              {loading ? 'Cargando...' : 
               error ? 'Error' : 
               data ? 'Conectado' : 'Desconectado'}
            </span>
          </div>
        </div>

        {/* Test de Diagnóstico Completo */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-400/20">
          <span className="font-medium text-white">Diagnóstico Completo AWS:</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={testDiagnostic}
              disabled={apiTest.status === 'testing'}
              className="btn-primary text-sm px-3 py-1"
            >
              {apiTest.status === 'testing' ? 'Diagnosticando...' : 'Diagnóstico Completo'}
            </button>
            {apiTest.status === 'success' && <CheckCircle className="h-4 w-4 text-green-400" />}
            {apiTest.status === 'error' && <XCircle className="h-4 w-4 text-red-400" />}
          </div>
        </div>

        {/* SDK Version */}
        {sdkVersion && (
          <div className="p-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-lg border border-emerald-400/20">
            <h4 className="font-medium mb-2 text-emerald-200">SDK Version:</h4>
            <div className="text-sm text-emerald-100">
              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                sdkVersion === 'v3' ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/30' :
                sdkVersion === 'v2' ? 'bg-yellow-500/20 text-yellow-200 border border-yellow-400/30' :
                'bg-red-500/20 text-red-200 border border-red-400/30'
              }`}>
                AWS SDK {sdkVersion}
              </span>
            </div>
          </div>
        )}

        {/* Variables de Entorno */}
        <div className="p-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg border border-orange-400/20">
          <h4 className="font-medium mb-2 text-orange-200">Variables de Entorno:</h4>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-orange-100">AWS_ACCESS_KEY_ID:</span>
              <span className={process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID ? 'text-emerald-400' : 'text-red-400'}>
                {process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID ? '✓ Configurada' : '✗ No configurada'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-orange-100">AWS_REGION:</span>
              <span className={process.env.NEXT_PUBLIC_AWS_REGION ? 'text-emerald-400' : 'text-red-400'}>
                {process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-orange-100">S3_BUCKET_NAME:</span>
              <span className={process.env.NEXT_PUBLIC_S3_BUCKET_NAME ? 'text-emerald-400' : 'text-red-400'}>
                {process.env.NEXT_PUBLIC_S3_BUCKET_NAME || 'No configurado'}
              </span>
            </div>
          </div>
        </div>

        {/* Datos Recibidos */}
        {data && (
          <div className="p-4 bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-lg border border-emerald-400/20">
            <h4 className="font-medium mb-2 text-emerald-200">Datos AWS Recibidos:</h4>
            <div className="text-sm text-emerald-100 space-y-1">
              <div>EC2 Instances: {data.ec2?.length || 0}</div>
              <div>RDS Instances: {data.rds?.length || 0}</div>
              <div>S3 Bucket: {data.s3?.bucketName || 'N/A'}</div>
              <div>S3 Size: {data.s3?.totalSizeGB?.toFixed(2) || '0'} GB</div>
              <div>CPU Metrics: {data.metrics?.cpu?.length || 0} puntos</div>
            </div>
          </div>
        )}

        {/* Error Details */}
        {error && (
          <div className="p-4 bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-lg border border-red-400/20">
            <h4 className="font-medium mb-2 text-red-200">Error:</h4>
            <p className="text-sm text-red-100">{error}</p>
          </div>
        )}

        {/* API Response */}
        {apiTest.response && (
          <div className="p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg border border-blue-400/20">
            <h4 className="font-medium mb-2 text-blue-200">Respuesta de API:</h4>
            <pre className="text-xs text-blue-100 overflow-auto max-h-32">
              {JSON.stringify(apiTest.response, null, 2)}
            </pre>
          </div>
        )}

        {apiTest.error && (
          <div className="p-4 bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-lg border border-red-400/20">
            <h4 className="font-medium mb-2 text-red-200">Error de API:</h4>
            <p className="text-sm text-red-100">{apiTest.error}</p>
          </div>
        )}
      </div>
    </div>
  )
}
