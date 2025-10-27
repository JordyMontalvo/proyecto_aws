# 🚀 GUÍA DE CONFIGURACIÓN VERCEL - SOLUCIÓN AL ERROR

## ❌ **Error Encontrado:**
```
Environment Variable "AWS_ACCESS_KEY_ID" references Secret "aws_access_key_id", which does not exist.
```

## ✅ **Solución Paso a Paso:**

### **1. Ir a Vercel Dashboard**
- Ve a [vercel.com/dashboard](https://vercel.com/dashboard)
- Selecciona tu proyecto `proyecto_aws`

### **2. Configurar Variables de Entorno**
- Ve a **Settings** > **Environment Variables**
- Haz clic en **Add New**

### **3. Agregar Variables Una por Una**

**Variable 1:**
```
Name: AWS_ACCESS_KEY_ID
Value: AKIA5IZLXMNTO53MSX6H
Environment: Production, Preview, Development
```

**Variable 2:**
```
Name: AWS_SECRET_ACCESS_KEY
Value: jZkqRpUG9Jc71i/p28Ky2LNGNlfcHq++jvtJpj
Environment: Production, Preview, Development
```

**Variable 3:**
```
Name: AWS_REGION
Value: us-east-1
Environment: Production, Preview, Development
```

**Variable 4:**
```
Name: DATABASE_URL
Value: postgresql://vigila_admin:}=}jg]Pus*5iF07TJBLKyK<QP?3NFjcj@vigila-optimization-db.c6rqoaqe6e6u.us-east-1.rds.amazonaws.com:5432/vigila_db
Environment: Production, Preview, Development
```

**Variable 5:**
```
Name: DB_HOST
Value: vigila-optimization-db.c6rqoaqe6e6u.us-east-1.rds.amazonaws.com
Environment: Production, Preview, Development
```

**Variable 6:**
```
Name: DB_PASSWORD
Value: }=}jg]Pus*5iF07TJBLKyK<QP?3NFjcj
Environment: Production, Preview, Development
```

**Variable 7:**
```
Name: S3_BUCKET_NAME
Value: vigila-videos-912235389798
Environment: Production, Preview, Development
```

**Variable 8:**
```
Name: NODE_ENV
Value: production
Environment: Production, Preview, Development
```

**Variable 9:**
```
Name: JWT_SECRET
Value: vigila_jwt_secret_key_2024_production
Environment: Production, Preview, Development
```

**Variable 10:**
```
Name: ENCRYPTION_KEY
Value: vigila_encryption_key_2024_production
Environment: Production, Preview, Development
```

### **4. Configurar Build Settings**
- Ve a **Settings** > **General**
- **Framework Preset:** Next.js
- **Root Directory:** `infrastructure/vigila-dashboard`
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`

### **5. Redesplegar**
- Ve a **Deployments**
- Haz clic en **Redeploy** en el último deployment
- O haz un nuevo push a GitHub

## 🔧 **Archivo vercel.json Corregido**

He actualizado el archivo `vercel.json` para eliminar las referencias a secrets que no existen.

## 📋 **Lista Completa de Variables**

Copia y pega estas variables en Vercel:

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

## ✅ **Verificación**

Después de agregar todas las variables:
1. **Verifica** que todas estén marcadas para Production
2. **Redesplega** el proyecto
3. **Revisa** los logs de build para confirmar que no hay errores

## 🚨 **Si Persiste el Error**

Si el error continúa:
1. **Elimina** todas las variables de entorno
2. **Espera** 2-3 minutos
3. **Agrega** las variables nuevamente
4. **Redesplega** el proyecto

---

**¡Con estos pasos el error debería resolverse y tu dashboard debería desplegarse correctamente!**
