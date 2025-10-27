# 🔍 Cómo Verificar que AWS Está Funcionando

## 📋 **Pasos para Verificar la Conexión**

### 1. **Acceder al Dashboard**
- Ve a tu URL de Vercel desplegada
- Haz clic en la pestaña **"Análisis"**
- Verás la sección **"Estado de Conexión AWS"**

### 2. **Indicadores Visuales**

#### **En la Pestaña "Resumen":**
- ✅ **Verde**: "AWS Conectado" + "Datos en Tiempo Real"
- ❌ **Amarillo**: "AWS Desconectado"

#### **En la Pestaña "Análisis":**
- **Hook useAWSData**: Estado del hook de datos
- **API /api/system-status**: Botón para probar la API
- **Variables de Entorno**: Estado de configuración
- **Datos AWS Recibidos**: Información real de AWS

### 3. **Qué Buscar**

#### **✅ Conexión Exitosa:**
```
Hook useAWSData: ✓ Conectado
API /api/system-status: ✓ Respuesta exitosa
Variables de Entorno: ✓ Configuradas
Datos AWS Recibidos:
  - EC2 Instances: 1+
  - RDS Instances: 1
  - S3 Bucket: vigila-videos-xxx
  - S3 Size: X.XX GB
  - CPU Metrics: X puntos
```

#### **❌ Problemas Comunes:**
```
Hook useAWSData: ✗ Error
API /api/system-status: ✗ Error
Variables de Entorno: ✗ No configuradas
```

### 4. **Verificar Variables de Entorno en Vercel**

Ve a tu proyecto en Vercel Dashboard:
1. **Settings** > **Environment Variables**
2. Verifica que estén configuradas:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `AWS_REGION`
   - `S3_BUCKET_NAME`

### 5. **Probar la API Directamente**

Visita: `https://tu-proyecto.vercel.app/api/system-status`

**Respuesta exitosa:**
```json
{
  "success": true,
  "data": {
    "metrics": { "cpu": [...], "memory": [...] },
    "ec2": [{ "id": "i-xxx", "state": "running" }],
    "rds": [{ "id": "vigila-xxx", "status": "available" }],
    "s3": { "bucketName": "vigila-videos-xxx", "totalSizeGB": 0.5 },
    "alb": { "responseTime": [...] },
    "timestamp": "2024-..."
  }
}
```

**Error de credenciales:**
```json
{
  "success": false,
  "error": "AWS credentials not configured"
}
```

### 6. **Solución de Problemas**

#### **Error: "AWS credentials not configured"**
- Verifica que las variables estén en Vercel
- Redespliega la aplicación
- Espera 2-3 minutos para que se propaguen

#### **Error: "Access Denied"**
- Verifica permisos IAM del usuario
- Asegúrate de tener acceso a EC2, RDS, S3, CloudWatch

#### **Error: "Region not specified"**
- Configura `AWS_REGION=us-east-1` en Vercel

#### **No hay datos de EC2/RDS**
- Verifica que las instancias estén ejecutándose
- Comprueba los nombres/tags en `aws-service.ts`

### 7. **Datos que Deberías Ver**

#### **Métricas Reales:**
- **Uso de CPU**: Porcentaje real de CloudWatch
- **Almacenamiento**: Tamaño real del bucket S3
- **Instancias EC2**: Número real de instancias
- **Tiempo de Respuesta**: Datos reales del ALB

#### **Estado de Servicios:**
- **EC2**: "online" si state === 'running'
- **RDS**: "online" si status === 'available'
- **S3**: "online" si el bucket existe
- **CloudWatch**: Siempre "online"
- **ALB**: Siempre "online"

### 8. **Confirmación Final**

Si ves:
- ✅ Indicadores verdes en "Resumen"
- ✅ Datos reales en las métricas
- ✅ Estado "En tiempo real" en servicios
- ✅ Respuesta exitosa en "Análisis"

**¡Entonces AWS está funcionando correctamente!** 🎉

---

**¿Necesitas ayuda?** Revisa los logs en Vercel Dashboard o contacta para soporte técnico.

