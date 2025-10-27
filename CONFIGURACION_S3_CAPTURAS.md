# 🔧 Configuración S3 para Subir Capturas desde la Web

## 📋 **Estado Actual**
- ✅ **Bucket S3**: `vigila-videos-912235389798-logs`
- ✅ **Región**: `us-east-1` (Norte de Virginia)
- ✅ **Puntos de acceso**: 0 (necesitas configurar permisos)

## 🚀 **Configuración Paso a Paso**

### **Opción 1: Configurar Permisos del Bucket (Recomendado)**

#### **Paso 1: Ir a Permisos del Bucket**
1. En la consola S3, ve a tu bucket `vigila-videos-912235389798-logs`
2. Haz clic en la pestaña **"Permisos"**
3. Busca la sección **"Política del bucket"**

#### **Paso 2: Agregar Política de Bucket**
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "AllowWebAppUpload",
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::TU_ACCOUNT_ID:user/TU_USUARIO_IAM"
            },
            "Action": [
                "s3:PutObject",
                "s3:PutObjectAcl",
                "s3:GetObject",
                "s3:DeleteObject"
            ],
            "Resource": [
                "arn:aws:s3:::vigila-videos-912235389798-logs",
                "arn:aws:s3:::vigila-videos-912235389798-logs/*"
            ]
        }
    ]
}
```

### **Opción 2: Crear Usuario IAM (Más Seguro)**

#### **Paso 1: Crear Usuario IAM**
1. Ve a **IAM** → **Usuarios** → **Crear usuario**
2. Nombre: `vigila-web-app-user`
3. Tipo de acceso: **Acceso programático**

#### **Paso 2: Crear Política Personalizada**
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:PutObjectAcl",
                "s3:GetObject",
                "s3:DeleteObject",
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::vigila-videos-912235389798-logs",
                "arn:aws:s3:::vigila-videos-912235389798-logs/*"
            ]
        }
    ]
}
```

#### **Paso 3: Generar Credenciales**
1. Ve a **IAM** → **Usuarios** → `vigila-web-app-user`
2. Pestaña **"Credenciales de seguridad"**
3. **"Crear clave de acceso"**
4. **Copia** el `Access Key ID` y `Secret Access Key`

### **Opción 3: Usar Punto de Acceso (Avanzado)**

#### **Paso 1: Crear Punto de Acceso**
1. En tu bucket S3, pestaña **"Puntos de acceso"**
2. Clic en **"Crear punto de acceso"**
3. Nombre: `vigila-web-access-point`
4. Configurar política de acceso

## 🔑 **Configurar Variables de Entorno**

### **En Vercel Dashboard:**
```
AWS_ACCESS_KEY_ID=tu_access_key_aqui
AWS_SECRET_ACCESS_KEY=tu_secret_key_aqui
AWS_REGION=us-east-1
S3_BUCKET_NAME=vigila-videos-912235389798-logs
```

### **En tu archivo .env.local (desarrollo):**
```bash
AWS_ACCESS_KEY_ID=tu_access_key_aqui
AWS_SECRET_ACCESS_KEY=tu_secret_key_aqui
AWS_REGION=us-east-1
S3_BUCKET_NAME=vigila-videos-912235389798-logs
```

## 📁 **Estructura de Carpetas Recomendada**

```
vigila-videos-912235389798-logs/
├── surveillance/
│   ├── images/
│   │   ├── 2024-01-15/
│   │   └── 2024-01-16/
│   ├── videos/
│   │   ├── 2024-01-15/
│   │   └── 2024-01-16/
│   └── metadata/
│       ├── captures.json
│       └── alerts.json
└── logs/
    ├── access-logs/
    └── error-logs/
```

## 🔧 **Actualizar tu API S3**

Tu API ya está configurada correctamente en `/api/s3-upload/route.ts`, solo necesitas:

1. **Agregar las credenciales** en Vercel
2. **Verificar el nombre del bucket** en las variables de entorno
3. **Redesplegar** la aplicación

## ✅ **Verificación de Configuración**

### **Paso 1: Probar Subida**
1. Ve a tu aplicación web
2. Pestaña **"Cámaras"**
3. Captura una imagen
4. Verifica que aparezca **"S3"** en lugar de **"LOCAL"**

### **Paso 2: Verificar en S3**
1. Ve a tu bucket S3
2. Pestaña **"Objetos"**
3. Deberías ver la carpeta `surveillance/`
4. Dentro, las imágenes y videos capturados

## 🚨 **Solución de Problemas**

### **Error: Access Denied**
- ✅ Verificar que las credenciales sean correctas
- ✅ Verificar que la política de bucket permita `s3:PutObject`
- ✅ Verificar que el usuario IAM tenga los permisos necesarios

### **Error: Bucket Not Found**
- ✅ Verificar que el nombre del bucket sea exacto
- ✅ Verificar que estés en la región correcta (`us-east-1`)

### **Error: Invalid Credentials**
- ✅ Regenerar las credenciales en IAM
- ✅ Verificar que las variables de entorno estén configuradas

## 🎯 **Configuración Recomendada**

### **Para Producción:**
1. **Crear usuario IAM** específico para la aplicación
2. **Política mínima** solo con permisos necesarios
3. **Rotar credenciales** regularmente
4. **Monitorear acceso** con CloudTrail

### **Para Desarrollo:**
1. **Usar credenciales temporales**
2. **Bucket separado** para desarrollo
3. **Políticas restrictivas** por IP si es posible

## 🚀 **Próximos Pasos**

1. **Configurar permisos** en S3 o crear usuario IAM
2. **Agregar credenciales** en Vercel
3. **Probar subida** desde la aplicación
4. **Verificar archivos** en S3
5. **Configurar notificaciones** S3 si es necesario

## 📱 **Resultado Esperado**

Una vez configurado correctamente:
- ✅ **Capturas se suben** a S3 automáticamente
- ✅ **URLs públicas** para acceso a archivos
- ✅ **Almacenamiento persistente** de todas las capturas
- ✅ **Integración completa** con tu sistema de vigilancia

**¡Con esta configuración podrás subir todas las capturas de tu cámara directamente a S3!** 🎉

