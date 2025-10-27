import { NextApiRequest, NextApiResponse } from 'next'
import { getSystemStatus } from '../../lib/aws-service'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const systemStatus = await getSystemStatus()
    
    res.status(200).json({
      success: true,
      data: systemStatus
    })
  } catch (error) {
    console.error('API Error:', error)
    
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      data: null
    })
  }
}
