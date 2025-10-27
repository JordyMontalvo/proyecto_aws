import { NextResponse } from 'next/server'
import { testAWSCredentialsV3, getSystemStatusV3 } from '../../../lib/aws-service-v3'

export async function GET() {
  try {
    // Primero probamos las credenciales
    const credentialsTest = await testAWSCredentialsV3()
    
    if (!credentialsTest.success) {
      return NextResponse.json({
        success: false,
        error: credentialsTest.message,
        sdkVersion: 'v3',
        credentialsTest
      }, { status: 400 })
    }

    // Si las credenciales son válidas, obtenemos los datos
    const systemStatus = await getSystemStatusV3()
    
    return NextResponse.json({
      success: true,
      data: systemStatus,
      credentialsTest,
      sdkVersion: 'v3'
    })
  } catch (error) {
    console.error('API Error (v3):', error)
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        sdkVersion: 'v3',
        data: null
      },
      { status: 500 }
    )
  }
}

