# 🚀 GUÍA DE CONFIGURACIÓN PARA VERCEL - PROYECTO VIGILA

## 📋 **PASOS PARA CONFIGURAR VERCEL**

### **1. Obtener Valores de la Infraestructura AWS**

Ejecuta estos comandos en el directorio `infrastructure/`:

```bash
# Obtener endpoint de RDS
terraform output rds_endpoint

# Obtener contraseña de RDS  
terraform output rds_password

# Obtener nombre del bucket S3
terraform output s3_bucket_name

# Obtener todos los outputs
terraform output
```

### **2. Variables de Entorno para Vercel**

Copia estas variables en **Vercel Dashboard > Project Settings > Environment Variables**:

```env
# AWS Credentials
AWS_ACCESS_KEY_ID=AKIA5IZLXMNTO53MSX6H
AWS_SECRET_ACCESS_KEY=jZkqRpUG9Jc71i/p28Ky2LNGNlfcHq++jvtJpj
AWS_REGION=us-east-1

# Database (reemplazar con valores reales)
DATABASE_URL=postgresql://vigila_admin:[PASSWORD]@[RDS_ENDPOINT]:5432/vigila_db
DB_HOST=[RDS_ENDPOINT]
DB_PORT=5432
DB_NAME=vigila_db
DB_USER=vigila_admin
DB_PASSWORD=[PASSWORD_FROM_TERRAFORM_OUTPUT]

# S3 Storage
S3_BUCKET_NAME=[BUCKET_NAME_FROM_TERRAFORM_OUTPUT]
S3_REGION=us-east-1

# Application
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://[TU_PROYECTO].vercel.app

# Security (generar nuevas para producción)
JWT_SECRET=generar_clave_secreta_nueva
ENCRYPTION_KEY=generar_clave_encriptacion_nueva

# Monitoring
CLOUDWATCH_NAMESPACE=VIGILA/Surveillance
METRICS_UPDATE_INTERVAL=30
AWS_TIMEOUT=10000
```

### **3. Configuración en Vercel**

1. **Conectar GitHub:**
   - Ve a [vercel.com](https://vercel.com)
   - Importa el repositorio `proyecto_aws`
   - Selecciona la carpeta `infrastructure/vigila-dashboard`

2. **Configurar Variables:**
   - Ve a Project Settings > Environment Variables
   - Agrega todas las variables de arriba
   - Reemplaza los valores entre `[]` con los reales

3. **Configurar Build:**
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

### **4. Despliegue**

1. **Push a GitHub:**
   ```bash
   git add .
   git commit -m "Configuración para Vercel"
   git push origin main
   ```

2. **Vercel Auto-Deploy:**
   - Vercel detectará automáticamente el push
   - Iniciará el build y despliegue
   - Te dará una URL pública

### **5. Verificación Post-Despliegue**

1. **Verificar URL:** La aplicación debería estar disponible en `https://[proyecto].vercel.app`

2. **Verificar Conexiones AWS:**
   - Revisar logs en Vercel Dashboard
   - Verificar que las métricas se cargan
   - Comprobar estado de servicios AWS

### **6. Troubleshooting Común**

**Error: "AWS credentials not found"**
- Verificar que las variables están en Vercel
- Comprobar que no hay espacios extra

**Error: "Database connection failed"**
- Verificar endpoint de RDS
- Comprobar Security Groups
- Verificar contraseña

**Error: "S3 bucket not found"**
- Verificar nombre del bucket
- Comprobar permisos IAM
- Verificar región

### **7. URLs Importantes**

- **Vercel Dashboard:** https://vercel.com/dashboard
- **GitHub Repository:** https://github.com/JordyMontalvo/proyecto_aws
- **AWS Console:** https://console.aws.amazon.com
- **Terraform State:** En el directorio `infrastructure/`

---

## 🎯 **RESULTADO ESPERADO**

Después de completar estos pasos tendrás:

✅ **Dashboard público** en Vercel  
✅ **Conexión con AWS** funcionando  
✅ **Métricas en tiempo real** de la infraestructura  
✅ **URL pública** para presentación  
✅ **Monitoreo completo** del sistema  

---

*Esta guía te llevará paso a paso para tener tu proyecto VIGILA funcionando en Vercel.*
