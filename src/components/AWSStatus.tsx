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
      <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <AlertCircle className="h-6 w-6 mr-3 text-blue-600" />
        Estado de Conexión AWS
      </h3>
      
      <div className="space-y-4">
        {/* Estado del Hook */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <span className="font-medium">Hook useAWSData:</span>
          <div className="flex items-center space-x-2">
            {loading && <Loader className="h-4 w-4 animate-spin text-blue-500" />}
            {error && <XCircle className="h-4 w-4 text-red-500" />}
            {data && !loading && !error && <CheckCircle className="h-4 w-4 text-green-500" />}
            <span className={`text-sm font-semibold ${
              loading ? 'text-blue-600' : 
              error ? 'text-red-600' : 
              data ? 'text-green-600' : 'text-gray-600'
            }`}>
              {loading ? 'Cargando...' : 
               error ? 'Error' : 
               data ? 'Conectado' : 'Desconectado'}
            </span>
          </div>
        </div>

        {/* Test de Diagnóstico Completo */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <span className="font-medium">Diagnóstico Completo AWS:</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={testDiagnostic}
              disabled={apiTest.status === 'testing'}
              className="btn-primary text-sm px-3 py-1"
            >
              {apiTest.status === 'testing' ? 'Diagnosticando...' : 'Diagnóstico Completo'}
            </button>
            {apiTest.status === 'success' && <CheckCircle className="h-4 w-4 text-green-500" />}
            {apiTest.status === 'error' && <XCircle className="h-4 w-4 text-red-500" />}
          </div>
        </div>

        {/* SDK Version */}
        {sdkVersion && (
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium mb-2 text-blue-800">SDK Version:</h4>
            <div className="text-sm text-blue-700">
              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                sdkVersion === 'v3' ? 'bg-green-100 text-green-800' :
                sdkVersion === 'v2' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                AWS SDK {sdkVersion}
              </span>
            </div>
          </div>
        )}

        {/* Variables de Entorno */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">Variables de Entorno:</h4>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span>AWS_ACCESS_KEY_ID:</span>
              <span className={process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID ? 'text-green-600' : 'text-red-600'}>
                {process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID ? '✓ Configurada' : '✗ No configurada'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>AWS_REGION:</span>
              <span className={process.env.NEXT_PUBLIC_AWS_REGION ? 'text-green-600' : 'text-red-600'}>
                {process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>S3_BUCKET_NAME:</span>
              <span className={process.env.NEXT_PUBLIC_S3_BUCKET_NAME ? 'text-green-600' : 'text-red-600'}>
                {process.env.NEXT_PUBLIC_S3_BUCKET_NAME || 'No configurado'}
              </span>
            </div>
          </div>
        </div>

        {/* Datos Recibidos */}
        {data && (
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium mb-2 text-green-800">Datos AWS Recibidos:</h4>
            <div className="text-sm text-green-700 space-y-1">
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
          <div className="p-4 bg-red-50 rounded-lg">
            <h4 className="font-medium mb-2 text-red-800">Error:</h4>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* API Response */}
        {apiTest.response && (
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium mb-2 text-blue-800">Respuesta de API:</h4>
            <pre className="text-xs text-blue-700 overflow-auto max-h-32">
              {JSON.stringify(apiTest.response, null, 2)}
            </pre>
          </div>
        )}

        {apiTest.error && (
          <div className="p-4 bg-red-50 rounded-lg">
            <h4 className="font-medium mb-2 text-red-800">Error de API:</h4>
            <p className="text-sm text-red-700">{apiTest.error}</p>
          </div>
        )}
      </div>
    </div>
  )
}
