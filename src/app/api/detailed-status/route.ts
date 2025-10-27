import { NextResponse } from 'next/server'
import { getDetailedSystemStatus } from '../../../lib/aws-detailed-service'

export async function GET() {
  try {
    const systemStatus = await getDetailedSystemStatus()
    
    return NextResponse.json({
      success: true,
      data: systemStatus,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('API Error (detailed):', error)
    
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
