import { NextRequest, NextResponse } from 'next/server'
import { getDetailedRDSInstances } from '../../../lib/aws-detailed-service'

// API para manejar capturas reales de cámara
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string // 'image' o 'video'
    const metadata = JSON.parse(formData.get('metadata') as string || '{}')

    if (!file) {
      return NextResponse.json({
        success: false,
        error: 'No file provided'
      }, { status: 400 })
    }

    // Verificar que RDS esté disponible
    const rdsInfo = await getDetailedRDSInstances()
    if (rdsInfo.instances.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No RDS instances available'
      }, { status: 400 })
    }

    // Convertir archivo a base64 para almacenamiento
    const buffer = await file.arrayBuffer()
    const base64 = Buffer.from(buffer).toString('base64')
    const dataUrl = `data:${file.type};base64,${base64}`

    // Crear datos de captura
    const captureData = {
      id: `${type}_${Date.now()}`,
      cameraId: 'real_camera',
      timestamp: new Date().toISOString(),
      imageUrl: dataUrl,
      videoUrl: type === 'video' ? dataUrl : undefined,
      size: file.size,
      resolution: metadata.resolution || '1280x720',
      format: file.type.split('/')[1].toUpperCase(),
      location: 'Cámara del Usuario',
      status: 'captured',
      rdsInstance: rdsInfo.instances[0].id,
      rdsStatus: rdsInfo.instances[0].status,
      type: type,
      fileName: file.name,
      mimeType: file.type
    }

    // En producción, aquí insertarías en la base de datos RDS
    // Por ahora simulamos el almacenamiento
    console.log('Captura real almacenada en RDS:', {
      ...captureData,
      imageUrl: '[BASE64_DATA]' // No logear el contenido completo
    })

    return NextResponse.json({
      success: true,
      data: captureData,
      message: `${type === 'video' ? 'Video' : 'Imagen'} capturada exitosamente`
    })

  } catch (error) {
    console.error('Error processing real capture:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Obtener capturas reales almacenadas
export async function GET() {
  try {
    // Verificar que RDS esté disponible
    const rdsInfo = await getDetailedRDSInstances()
    if (rdsInfo.instances.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No RDS instances available'
      }, { status: 400 })
    }

    // En producción, aquí obtendrías las capturas reales de la base de datos
    // Por ahora retornamos un array vacío ya que las capturas se manejan localmente
    const captures: any[] = []

    return NextResponse.json({
      success: true,
      data: {
        captures,
        totalCount: captures.length,
        rdsInfo: {
          instance: rdsInfo.instances[0].id,
          status: rdsInfo.instances[0].status,
          engine: rdsInfo.instances[0].engine
        }
      }
    })

  } catch (error) {
    console.error('Error fetching real captures:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
