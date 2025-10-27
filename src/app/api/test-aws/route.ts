import { NextResponse } from 'next/server'
import { testAWSCredentials } from '../../../lib/aws-service'

export async function GET() {
  try {
    const result = await testAWSCredentials()
    
    return NextResponse.json({
      success: result.success,
      message: result.message,
      data: result.data,
      error: result.error
    })
  } catch (error) {
    console.error('API Error:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        data: null
      },
      { status: 500 }
    )
  }
}

