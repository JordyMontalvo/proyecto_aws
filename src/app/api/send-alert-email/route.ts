import { NextRequest, NextResponse } from 'next/server'

// API para enviar emails de alerta
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { alert, contacts } = body

    if (!alert || !contacts || contacts.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Missing alert data or contacts'
      }, { status: 400 })
    }

    // Simular envío de email (en producción usarías SendGrid, AWS SES, etc.)
    const emailData = {
      to: contacts.filter((contact: string) => contact.includes('@')),
      subject: `🚨 ALERTA DE SEGURIDAD - ${alert.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #ef4444, #dc2626); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">🚨 ALERTA DE SEGURIDAD</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">Sistema de Vigilancia - ${new Date().toLocaleString('es-ES')}</p>
          </div>
          
          <div style="background: white; padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
            <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin-bottom: 20px;">
              <h2 style="margin: 0 0 10px 0; color: #dc2626; font-size: 18px;">${alert.title}</h2>
              <p style="margin: 0; color: #7f1d1d; font-size: 16px;">${alert.message}</p>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
              <div>
                <h3 style="margin: 0 0 10px 0; color: #374151; font-size: 14px; font-weight: bold;">DETALLES DE LA ALERTA</h3>
                <table style="width: 100%; font-size: 14px; color: #6b7280;">
                  <tr>
                    <td style="padding: 5px 0; font-weight: bold;">Prioridad:</td>
                    <td style="padding: 5px 0;">
                      <span style="background: ${alert.priority === 'critical' ? '#ef4444' : alert.priority === 'high' ? '#f97316' : alert.priority === 'medium' ? '#eab308' : '#3b82f6'}; color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: bold;">
                        ${alert.priority.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0; font-weight: bold;">Ubicación:</td>
                    <td style="padding: 5px 0;">${alert.location}</td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0; font-weight: bold;">Cámara:</td>
                    <td style="padding: 5px 0;">${alert.cameraId}</td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0; font-weight: bold;">Hora:</td>
                    <td style="padding: 5px 0;">${new Date(alert.timestamp).toLocaleString('es-ES')}</td>
                  </tr>
                </table>
              </div>
              
              <div>
                <h3 style="margin: 0 0 10px 0; color: #374151; font-size: 14px; font-weight: bold;">ACCIONES RECOMENDADAS</h3>
                <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #6b7280;">
                  ${alert.priority === 'critical' ? '<li>Contactar autoridades inmediatamente</li>' : ''}
                  <li>Revisar las cámaras de seguridad</li>
                  <li>Verificar el área afectada</li>
                  <li>Actualizar el estado de la alerta</li>
                  ${alert.priority === 'critical' ? '<li>Activar protocolo de emergencia</li>' : ''}
                </ul>
              </div>
            </div>
            
            ${alert.imageUrl ? `
              <div style="margin-bottom: 20px;">
                <h3 style="margin: 0 0 10px 0; color: #374151; font-size: 14px; font-weight: bold;">EVIDENCIA CAPTURADA</h3>
                <img src="${alert.imageUrl}" alt="Evidencia de la alerta" style="max-width: 100%; height: auto; border-radius: 8px; border: 1px solid #e5e7eb;" />
              </div>
            ` : ''}
            
            <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin-top: 20px;">
              <h3 style="margin: 0 0 10px 0; color: #374151; font-size: 14px; font-weight: bold;">ACCESO AL SISTEMA</h3>
              <p style="margin: 0; font-size: 14px; color: #6b7280;">
                Para más información o para gestionar esta alerta, accede al sistema de vigilancia:
                <br>
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}" style="color: #3b82f6; text-decoration: none; font-weight: bold;">
                  🔗 Abrir Sistema de Vigilancia
                </a>
              </p>
            </div>
          </div>
          
          <div style="background: #f3f4f6; padding: 15px; border-radius: 0 0 8px 8px; text-align: center;">
            <p style="margin: 0; font-size: 12px; color: #6b7280;">
              Este es un mensaje automático del Sistema de Vigilancia AWS.<br>
              No responder a este email.
            </p>
          </div>
        </div>
      `,
      text: `
        🚨 ALERTA DE SEGURIDAD - ${alert.title}
        
        ${alert.message}
        
        Detalles:
        - Prioridad: ${alert.priority.toUpperCase()}
        - Ubicación: ${alert.location}
        - Cámara: ${alert.cameraId}
        - Hora: ${new Date(alert.timestamp).toLocaleString('es-ES')}
        
        Acciones recomendadas:
        ${alert.priority === 'critical' ? '- Contactar autoridades inmediatamente' : ''}
        - Revisar las cámaras de seguridad
        - Verificar el área afectada
        - Actualizar el estado de la alerta
        ${alert.priority === 'critical' ? '- Activar protocolo de emergencia' : ''}
        
        Acceso al sistema: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}
        
        ---
        Sistema de Vigilancia AWS - Mensaje automático
      `
    }

    // En producción, aquí enviarías el email real usando un servicio como:
    // - AWS SES (Simple Email Service)
    // - SendGrid
    // - Mailgun
    // - Nodemailer con SMTP

    console.log('Email de alerta enviado:', {
      to: emailData.to,
      subject: emailData.subject,
      alertId: alert.id,
      priority: alert.priority
    })

    // Simular delay de envío
    await new Promise(resolve => setTimeout(resolve, 1000))

    return NextResponse.json({
      success: true,
      data: {
        messageId: `email_${Date.now()}`,
        recipients: emailData.to,
        subject: emailData.subject,
        sentAt: new Date().toISOString()
      },
      message: 'Email de alerta enviado exitosamente'
    })

  } catch (error) {
    console.error('Error sending alert email:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// API para enviar SMS de alerta
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { alert, contacts } = body

    if (!alert || !contacts || contacts.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Missing alert data or contacts'
      }, { status: 400 })
    }

    // Filtrar números de teléfono
    const phoneNumbers = contacts.filter((contact: string) => 
      contact.startsWith('+') || /^\d{10,15}$/.test(contact)
    )

    if (phoneNumbers.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No valid phone numbers found'
      }, { status: 400 })
    }

    // Simular envío de SMS (en producción usarías AWS SNS, Twilio, etc.)
    const smsData = {
      to: phoneNumbers,
      message: `🚨 ALERTA SEGURIDAD: ${alert.title} - ${alert.location} - ${new Date().toLocaleString('es-ES')} - Prioridad: ${alert.priority.toUpperCase()} - Ver sistema: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}`
    }

    console.log('SMS de alerta enviado:', {
      to: smsData.to,
      alertId: alert.id,
      priority: alert.priority
    })

    // Simular delay de envío
    await new Promise(resolve => setTimeout(resolve, 500))

    return NextResponse.json({
      success: true,
      data: {
        messageId: `sms_${Date.now()}`,
        recipients: smsData.to,
        sentAt: new Date().toISOString()
      },
      message: 'SMS de alerta enviado exitosamente'
    })

  } catch (error) {
    console.error('Error sending alert SMS:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
