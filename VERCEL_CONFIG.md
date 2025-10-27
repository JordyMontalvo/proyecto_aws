# 🔧 Configuración Completa para Vercel

## ✅ Variables Ya Configuradas
- `S3_BUCKET_NAME`: `vigila-videos-912235389798`
- `S3_REGION`: `us-east-1`

## 🔑 Variables Faltantes (Necesarias)

Necesitas agregar estas variables en Vercel para que funcione S3 real:

### 1. Credenciales AWS
```
AWS_ACCESS_KEY_ID=tu_access_key_aqui
AWS_SECRET_ACCESS_KEY=tu_secret_key_aqui
```

### 2. URL de la Aplicación
```
NEXT_PUBLIC_APP_URL=https://proyecto-aws-theta.vercel.app
```

## 📋 Pasos para Completar la Configuración

### Paso 1: Obtener Credenciales AWS
1. Ve a **AWS Console** → **IAM** → **Users**
2. Crea un usuario nuevo o usa uno existente
3. Asigna estos permisos:
   ```json
   {
       "Version": "2012-10-17",
       "Statement": [
           {
               "Effect": "Allow",
               "Action": [
                   "s3:PutObject",
                   "s3:GetObject",
                   "s3:ListBucket",
                   "s3:DeleteObject"
               ],
               "Resource": [
                   "arn:aws:s3:::vigila-videos-912235389798",
                   "arn:aws:s3:::vigila-videos-912235389798/*"
               ]
           }
       ]
   }
   ```
4. Genera **Access Key** y **Secret Key**

### Paso 2: Agregar Variables en Vercel
1. Ve a tu proyecto en Vercel
2. **Settings** → **Environment Variables**
3. Agrega estas variables:

| Variable | Valor | Scope |
|----------|-------|-------|
| `AWS_ACCESS_KEY_ID` | `tu_access_key` | All Environments |
| `AWS_SECRET_ACCESS_KEY` | `tu_secret_key` | All Environments |
| `NEXT_PUBLIC_APP_URL` | `https://proyecto-aws-theta.vercel.app` | All Environments |

### Paso 3: Redesplegar
```bash
# Opción 1: Desde Vercel Dashboard
# Hacer un nuevo deploy

# Opción 2: Desde terminal
vercel --prod
```

## 🎯 Resultado Esperado

Una vez configurado correctamente:

### ✅ Modo Producción Activo
- **S3 Real**: Las capturas se subirán a tu bucket `vigila-videos-912235389798`
- **URLs Públicas**: Archivos accesibles desde internet
- **Emails Reales**: Notificaciones por correo funcionarán
- **Indicador Verde**: "Conectado" en lugar de "Modo Demo"

### 📱 Funcionalidades Completas
- Capturas de cámara real → S3
- Alertas con emails automáticos
- URLs públicas para compartir archivos
- Sistema completamente funcional

## 🔍 Verificar Configuración

Después del despliegue, verifica:

1. **Panel S3**: Debe mostrar "Conectado" (verde)
2. **Captura de Imagen**: Debe mostrar "S3" (verde) en lugar de "LOCAL"
3. **URLs**: Los archivos deben tener URLs de S3 reales
4. **Logs**: No debe haber errores 500 en `/api/s3-upload`

## ⚠️ Modo Demo Actual

Sin las credenciales AWS, el sistema funciona en **modo demo**:
- ✅ Todas las funcionalidades disponibles
- ✅ Capturas se procesan localmente
- ✅ Sistema completamente funcional
- ⚠️ Archivos no se suben a S3 real

## 🚀 ¡Casi Listo!

Solo necesitas agregar las credenciales AWS y el sistema estará completamente funcional con S3 real.
