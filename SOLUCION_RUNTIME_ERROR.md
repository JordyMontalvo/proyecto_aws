# 🚀 SOLUCIÓN ERROR VERCEL - Runtime Configuration

## ❌ **Error Encontrado:**
```
Error: Function Runtimes must have a valid version, for example `now-php@1.0.0`.
```

## ✅ **Solución Aplicada:**

He simplificado el archivo `vercel.json` para evitar conflictos de configuración.

## 🔧 **Configuración Correcta en Vercel:**

### **1. Configuración del Proyecto**
- **Framework Preset:** Next.js
- **Root Directory:** `infrastructure/vigila-dashboard`
- **Build Command:** `npm run build` (automático)
- **Output Directory:** `.next` (automático)
- **Install Command:** `npm install` (automático)

### **2. Variables de Entorno**
Agregar estas variables en Settings > Environment Variables:

```env
AWS_ACCESS_KEY_ID=AKIA5IZLXMNTO53MSX6H
AWS_SECRET_ACCESS_KEY=jZkqRpUG9Jc71i/p28Ky2LNGNlfcHq++jvtJpj
AWS_REGION=us-east-1
DATABASE_URL=postgresql://vigila_admin:}=}jg]Pus*5iF07TJBLKyK<QP?3NFjcj@vigila-optimization-db.c6rqoaqe6e6u.us-east-1.rds.amazonaws.com:5432/vigila_db
DB_HOST=vigila-optimization-db.c6rqoaqe6e6u.us-east-1.rds.amazonaws.com
DB_PORT=5432
DB_NAME=vigila_db
DB_USER=vigila_admin
DB_PASSWORD=}=}jg]Pus*5iF07TJBLKyK<QP?3NFjcj
S3_BUCKET_NAME=vigila-videos-912235389798
S3_REGION=us-east-1
CLOUDWATCH_NAMESPACE=VIGILA/Surveillance
NODE_ENV=production
JWT_SECRET=vigila_jwt_secret_key_2024_production
ENCRYPTION_KEY=vigila_encryption_key_2024_production
METRICS_UPDATE_INTERVAL=30
AWS_TIMEOUT=10000
```

### **3. Pasos para Redesplegar**

1. **Hacer commit** de los cambios:
   ```bash
   git add .
   git commit -m "Fix vercel.json configuration"
   git push origin main
   ```

2. **En Vercel Dashboard:**
   - Ve a Deployments
   - Haz clic en "Redeploy" en el último deployment
   - O espera el auto-deploy del push

### **4. Verificación**

Después del redespliegue deberías ver:
- ✅ Build exitoso
- ✅ Sin errores de runtime
- ✅ Dashboard funcionando

## 🔧 **Archivo vercel.json Corregido**

```json
{
  "framework": "nextjs"
}
```

## 📋 **Configuración Manual en Vercel (Si es Necesario)**

Si el auto-detection no funciona:

1. **Ve a Settings > General**
2. **Framework Preset:** Next.js
3. **Root Directory:** `infrastructure/vigila-dashboard`
4. **Build Command:** `npm run build`
5. **Output Directory:** `.next`
6. **Install Command:** `npm install`

## 🚨 **Si Persiste el Error**

1. **Elimina** el proyecto de Vercel
2. **Reimporta** desde GitHub
3. **Configura** manualmente:
   - Root Directory: `infrastructure/vigila-dashboard`
   - Framework: Next.js
4. **Agrega** las variables de entorno
5. **Despliega**

---

**¡Con esta configuración simplificada el error debería resolverse!**
