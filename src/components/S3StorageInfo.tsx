'use client'

import { useState, useEffect } from 'react'
import { Database, Cloud, HardDrive, Upload, Download, Shield, Activity } from 'lucide-react'

interface S3Info {
  bucketName: string
  bucketRegion: string
  totalSize: string
  objectCount: number
  lastModified: string
  surveillanceFolder: string
  message: string
  simulated?: boolean
}

export default function S3StorageInfo() {
  const [s3Info, setS3Info] = useState<S3Info | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchS3Info()
  }, [])

  const fetchS3Info = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/s3-upload')
      const result = await response.json()
      
      if (result.success) {
        setS3Info(result.data)
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('Error conectando con S3')
    } finally {
      setLoading(false)
    }
  }

  const formatFileSize = (sizeStr: string) => {
    // Si ya está formateado, devolverlo tal como está
    if (sizeStr.includes('GB') || sizeStr.includes('MB') || sizeStr.includes('KB')) {
      return sizeStr
    }
    
    // Si es un número, formatearlo
    const size = parseFloat(sizeStr)
    if (size < 1024) return size + ' B'
    if (size < 1024 * 1024) return (size / 1024).toFixed(1) + ' KB'
    if (size < 1024 * 1024 * 1024) return (size / (1024 * 1024)).toFixed(1) + ' MB'
    return (size / (1024 * 1024 * 1024)).toFixed(1) + ' GB'
  }

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-slate-600">Cargando información de S3...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
            <div>
              <h3 className="font-semibold text-red-800">Error de Conexión S3</h3>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-slate-800 flex items-center">
          <Cloud className="h-6 w-6 mr-3 text-blue-500" />
          Almacenamiento Amazon S3
        </h3>
        
        <div className="flex items-center text-sm text-slate-600">
          <div className={`w-3 h-3 rounded-full mr-2 ${s3Info?.simulated ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
          <span>{s3Info?.simulated ? 'Modo Demo' : 'Conectado'}</span>
        </div>
      </div>

      {s3Info && (
        <>
          {/* Notificación de Modo Demo */}
          {s3Info.simulated && (
            <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                <div>
                  <h4 className="font-semibold text-yellow-800">Modo Demo Activo</h4>
                  <p className="text-sm text-yellow-600">
                    El sistema está funcionando en modo demo. Las capturas se procesan localmente.
                    Para usar S3 real, configura las credenciales AWS en las variables de entorno.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Información del Bucket */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">Bucket</p>
                  <p className="text-lg font-bold text-blue-800">{s3Info.bucketName}</p>
                </div>
                <Database className="h-8 w-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">Región</p>
                  <p className="text-lg font-bold text-green-800">{s3Info.bucketRegion}</p>
                </div>
                <Activity className="h-8 w-8 text-green-500" />
              </div>
            </div>
          </div>

          {/* Estadísticas de Almacenamiento */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 font-medium">Tamaño Total</p>
                  <p className="text-lg font-bold text-purple-800">{formatFileSize(s3Info.totalSize)}</p>
                </div>
                <HardDrive className="h-6 w-6 text-purple-500" />
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-600 font-medium">Archivos</p>
                  <p className="text-lg font-bold text-orange-800">{s3Info.objectCount}</p>
                </div>
                <Upload className="h-6 w-6 text-orange-500" />
              </div>
            </div>

            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-indigo-600 font-medium">Carpeta Vigilancia</p>
                  <p className="text-sm font-bold text-indigo-800">{s3Info.surveillanceFolder}</p>
                </div>
                <Shield className="h-6 w-6 text-indigo-500" />
              </div>
            </div>
          </div>

          {/* Información Detallada */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-slate-700 mb-3 flex items-center">
              <Database className="h-4 w-4 mr-2" />
              Detalles del Almacenamiento
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-600"><strong>Bucket:</strong> {s3Info.bucketName}</p>
                <p className="text-slate-600"><strong>Región:</strong> {s3Info.bucketRegion}</p>
                <p className="text-slate-600"><strong>Última Modificación:</strong> {s3Info.lastModified}</p>
              </div>
              <div>
                <p className="text-slate-600"><strong>Carpeta de Vigilancia:</strong> {s3Info.surveillanceFolder}</p>
                <p className="text-slate-600"><strong>Estado:</strong> <span className="text-green-600">Activo</span></p>
                <p className="text-slate-600"><strong>Encriptación:</strong> <span className="text-blue-600">AES256</span></p>
              </div>
            </div>
          </div>

          {/* Estado del Sistema */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                <div>
                  <p className="font-semibold text-green-800">Sistema de Almacenamiento Activo</p>
                  <p className="text-sm text-green-600">
                    Las capturas se suben automáticamente a S3 para almacenamiento seguro y duradero
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-green-600">Estado: Online</p>
                <p className="text-xs text-green-500">S3: Conectado</p>
              </div>
            </div>
          </div>

          {/* Botón de Actualización */}
          <div className="mt-4 text-center">
            <button
              onClick={fetchS3Info}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors flex items-center space-x-2 mx-auto"
            >
              <Download className="h-4 w-4" />
              <span>Actualizar Información</span>
            </button>
          </div>
        </>
      )}
    </div>
  )
}
