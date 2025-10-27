#!/bin/bash

# 🔧 Script de Configuración S3 para Capturas Web
# Este script te ayuda a configurar los permisos necesarios

echo "🚀 Configurando S3 para capturas web..."
echo ""

# Variables
BUCKET_NAME="vigila-videos-912235389798-logs"
REGION="us-east-1"

echo "📋 Información del Bucket:"
echo "   Nombre: $BUCKET_NAME"
echo "   Región: $REGION"
echo ""

echo "🔑 Pasos para configurar permisos:"
echo ""
echo "1️⃣ CREAR USUARIO IAM:"
echo "   - Ve a AWS Console → IAM → Usuarios"
echo "   - Crear usuario: 'vigila-web-app-user'"
echo "   - Tipo de acceso: Acceso programático"
echo ""

echo "2️⃣ CREAR POLÍTICA PERSONALIZADA:"
echo "   - Nombre: 'VigilaS3UploadPolicy'"
echo "   - Contenido:"
echo ""
cat << 'EOF'
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
EOF
echo ""

echo "3️⃣ GENERAR CREDENCIALES:"
echo "   - Ve al usuario creado → Credenciales de seguridad"
echo "   - Crear clave de acceso"
echo "   - Copiar Access Key ID y Secret Access Key"
echo ""

echo "4️⃣ CONFIGURAR EN VERCEL:"
echo "   Variables de entorno a agregar:"
echo "   - AWS_ACCESS_KEY_ID=tu_access_key"
echo "   - AWS_SECRET_ACCESS_KEY=tu_secret_key"
echo "   - AWS_REGION=us-east-1"
echo "   - S3_BUCKET_NAME=vigila-videos-912235389798-logs"
echo ""

echo "5️⃣ VERIFICAR CONFIGURACIÓN:"
echo "   - Redesplegar la aplicación"
echo "   - Probar captura de imagen"
echo "   - Verificar que aparezca 'S3' en lugar de 'LOCAL'"
echo ""

echo "✅ ¡Configuración completada!"
echo ""
echo "🔍 Para verificar en S3:"
echo "   - Ve a tu bucket: $BUCKET_NAME"
echo "   - Busca la carpeta 'surveillance/'"
echo "   - Deberías ver las imágenes capturadas"
echo ""

echo "📱 Resultado esperado:"
echo "   ✅ Capturas se suben automáticamente a S3"
echo "   ✅ URLs públicas para acceso a archivos"
echo "   ✅ Almacenamiento persistente"
echo "   ✅ Integración completa con vigilancia"
