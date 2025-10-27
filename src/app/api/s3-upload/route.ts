import { NextRequest, NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getDetailedS3Buckets } from '../../../lib/aws-detailed-service'

// Configurar cliente S3
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
})

// API para subir capturas a S3
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

    // Obtener información de buckets S3
    const s3Info = await getDetailedS3Buckets()
    if (s3Info.buckets.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No S3 buckets available'
      }, { status: 400 })
    }

    const bucketName = s3Info.buckets[0].name

    // Generar nombre único para el archivo
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const fileExtension = type === 'video' ? 'webm' : 'jpg'
    const fileName = `surveillance/${type}s/${timestamp}_${type}_${Date.now()}.${fileExtension}`

    // Convertir archivo a buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Parámetros para S3
    const uploadParams = {
      Bucket: bucketName,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
      Metadata: {
        'original-name': file.name,
        'capture-type': type,
        'resolution': metadata.resolution || '1280x720',
        'quality': metadata.quality?.toString() || '0.8',
        'facing-mode': metadata.facingMode || 'user',
        'upload-timestamp': new Date().toISOString()
      },
      ServerSideEncryption: 'AES256'
    }

    // Subir archivo a S3
    const command = new PutObjectCommand(uploadParams)
    const result = await s3Client.send(command)

    // Generar URL pública del archivo
    const fileUrl = `https://${bucketName}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${fileName}`

    // Crear datos de respuesta
    const uploadData = {
      id: `${type}_${Date.now()}`,
      fileName: fileName,
      originalName: file.name,
      fileUrl: fileUrl,
      bucketName: bucketName,
      size: file.size,
      type: file.type,
      resolution: metadata.resolution || '1280x720',
      uploadTimestamp: new Date().toISOString(),
      s3ETag: result.ETag,
      s3VersionId: result.VersionId
    }

    console.log('Archivo subido a S3:', {
      fileName,
      bucketName,
      size: file.size,
      type: file.type
    })

    return NextResponse.json({
      success: true,
      data: uploadData,
      message: `${type === 'video' ? 'Video' : 'Imagen'} subida exitosamente a S3`
    })

  } catch (error) {
    console.error('Error uploading to S3:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Obtener archivos subidos a S3
export async function GET() {
  try {
    // Obtener información de buckets S3
    const s3Info = await getDetailedS3Buckets()
    if (s3Info.buckets.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No S3 buckets available'
      }, { status: 400 })
    }

    // En producción, aquí usarías ListObjectsV2Command para obtener archivos
    // Por ahora retornamos información del bucket
    const bucketInfo = s3Info.buckets[0]

    return NextResponse.json({
      success: true,
      data: {
        bucketName: bucketInfo.name,
        bucketRegion: bucketInfo.region,
        totalSize: bucketInfo.totalSize,
        objectCount: bucketInfo.objectCount,
        lastModified: bucketInfo.lastModified,
        surveillanceFolder: 'surveillance/',
        message: 'S3 bucket disponible para almacenamiento'
      }
    })

  } catch (error) {
    console.error('Error fetching S3 info:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
