# 🚀 Sistema de Vigilancia AWS - Guía de Configuración

## 📋 Descripción
Sistema completo de vigilancia con cámaras reales, almacenamiento en S3, alertas en tiempo real y analytics avanzados.

## ⚙️ Configuración

### 🔧 Variables de Entorno

El sistema funciona en **dos modos**:

#### 1. **Modo Demo (Sin AWS)**
- ✅ Funciona inmediatamente sin configuración
- ✅ Capturas se procesan localmente
- ✅ Todas las funcionalidades disponibles
- ✅ Perfecto para demostraciones

#### 2. **Modo Producción (Con AWS)**
- 🔐 Requiere credenciales AWS
- ☁️ Capturas se suben a S3 real
- 📧 Emails de alerta funcionan
- 🚀 Sistema completamente funcional

### 📝 Configuración de AWS (Opcional)

Si quieres usar S3 real, crea un archivo `.env.local`:

```bash
# AWS Credentials
AWS_ACCESS_KEY_ID=tu_access_key_aqui
AWS_SECRET_ACCESS_KEY=tu_secret_key_aqui
AWS_REGION=us-east-1

# Bucket S3
S3_BUCKET_NAME=proyecto-aws-storage

# URL de la aplicación
NEXT_PUBLIC_APP_URL=https://tu-dominio.vercel.app
```

### 🔑 Obtener Credenciales AWS

1. **Ve a AWS Console** → IAM → Users
2. **Crea un usuario** con permisos de S3
3. **Genera Access Key** y Secret Key
4. **Configura permisos** necesarios para S3

#### Permisos IAM Requeridos:
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::tu-bucket-name",
                "arn:aws:s3:::tu-bucket-name/*"
            ]
        }
    ]
}
```

## 🚀 Despliegue

### Vercel (Recomendado)
```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel

# Configurar variables de entorno en Vercel Dashboard
```

### Variables en Vercel:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`
- `S3_BUCKET_NAME`
- `NEXT_PUBLIC_APP_URL`

## 📱 Funcionalidades

### 🎥 Sistema de Cámaras
- ✅ Captura de imágenes desde cámara real
- ✅ Grabación de video en tiempo real
- ✅ Cambio entre cámara frontal/trasera
- ✅ Subida automática a S3 (o local en demo)

### 🚨 Sistema de Alertas
- ✅ Alertas automáticas en tiempo real
- ✅ Notificaciones del navegador
- ✅ Emails automáticos profesionales
- ✅ SMS de emergencia
- ✅ Escalación inteligente

### 📊 Analytics Avanzados
- ✅ Mapa de calor de alertas
- ✅ Tendencias temporales
- ✅ Estadísticas en tiempo real
- ✅ Recomendaciones de seguridad

### ☁️ Almacenamiento AWS
- ✅ Integración completa con S3
- ✅ Encriptación automática
- ✅ Metadatos completos
- ✅ URLs públicas para acceso

### 📋 Tablas Organizadas
- ✅ Tablas AWS (EC2, RDS, S3)
- ✅ Tablas de capturas de cámara
- ✅ Búsqueda y filtros avanzados
- ✅ Ordenamiento dinámico
- ✅ Exportación de datos

## 🎯 Modos de Operación

### Modo Demo
- **Sin credenciales AWS**: Sistema funciona completamente
- **Capturas locales**: Se procesan en el navegador
- **Alertas simuladas**: Funcionan normalmente
- **Perfecto para**: Demostraciones, desarrollo, testing

### Modo Producción
- **Con credenciales AWS**: Sistema completo
- **S3 real**: Archivos en la nube
- **Emails reales**: Notificaciones por correo
- **Perfecto para**: Uso profesional, producción

## 🔧 Solución de Problemas

### Error 500 en `/api/s3-upload`
- ✅ **Solucionado**: El sistema ahora funciona en modo demo
- ✅ **Sin credenciales**: No hay errores, funciona localmente
- ✅ **Con credenciales**: Se conecta a S3 real

### Error 404 en `/favicon.ico`
- ⚠️ **Menor**: Solo afecta el icono del navegador
- ✅ **Solución**: Agregar favicon.ico en `/public/`

### Variables de entorno no cargan
- ✅ **Verificar**: Archivo `.env.local` existe
- ✅ **Reiniciar**: Servidor de desarrollo
- ✅ **Vercel**: Configurar en dashboard

## 📞 Soporte

El sistema está diseñado para funcionar **perfectamente en modo demo** sin ninguna configuración adicional. Todas las funcionalidades están disponibles y el sistema es completamente funcional.

Para usar S3 real, simplemente configura las credenciales AWS y el sistema automáticamente cambiará al modo producción.

## 🎉 ¡Listo para Usar!

El sistema está completamente funcional y listo para usar. No requiere configuración adicional para funcionar en modo demo.

