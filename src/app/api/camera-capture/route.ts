import { NextRequest, NextResponse } from 'next/server'
import { getDetailedRDSInstances } from '../../../lib/aws-detailed-service'

// Simulación de captura de cámara (en producción usarías una cámara real)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { cameraId, timestamp } = body

    // Verificar que RDS esté disponible
    const rdsInfo = await getDetailedRDSInstances()
    if (rdsInfo.instances.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No RDS instances available'
      }, { status: 400 })
    }

    // Simular captura de imagen
    const captureData = {
      id: `capture_${Date.now()}`,
      cameraId: cameraId || 'camera_1',
      timestamp: timestamp || new Date().toISOString(),
      imageUrl: `https://picsum.photos/800/600?random=${Date.now()}`, // Imagen aleatoria para demo
      size: Math.floor(Math.random() * 500000) + 100000, // Tamaño aleatorio entre 100KB-600KB
      resolution: '800x600',
      format: 'JPEG',
      location: 'Entrada Principal',
      status: 'captured',
      rdsInstance: rdsInfo.instances[0].id,
      rdsStatus: rdsInfo.instances[0].status
    }

    // En producción, aquí insertarías en la base de datos RDS
    // Por ahora simulamos el almacenamiento
    console.log('Captura almacenada en RDS:', captureData)

    return NextResponse.json({
      success: true,
      data: captureData,
      message: 'Captura almacenada exitosamente en RDS'
    })

  } catch (error) {
    console.error('Error capturing image:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Obtener capturas almacenadas
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

    // Simular capturas almacenadas en RDS
    const captures = Array.from({ length: 10 }, (_, i) => ({
      id: `capture_${Date.now() - i * 60000}`,
      cameraId: `camera_${(i % 4) + 1}`,
      timestamp: new Date(Date.now() - i * 60000).toISOString(),
      imageUrl: `https://picsum.photos/800/600?random=${i}`,
      size: Math.floor(Math.random() * 500000) + 100000,
      resolution: '800x600',
      format: 'JPEG',
      location: ['Entrada Principal', 'Patio Trasero', 'Estacionamiento', 'Recepción'][i % 4],
      status: 'stored',
      rdsInstance: rdsInfo.instances[0].id,
      rdsStatus: rdsInfo.instances[0].status
    }))

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
    console.error('Error fetching captures:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
