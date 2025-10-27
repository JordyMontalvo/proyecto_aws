import { NextResponse } from 'next/server'
import { getSystemStatus } from '../../../lib/aws-service'

export async function GET() {
  try {
    const systemStatus = await getSystemStatus()
    
    return NextResponse.json({
      success: true,
      data: systemStatus
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


