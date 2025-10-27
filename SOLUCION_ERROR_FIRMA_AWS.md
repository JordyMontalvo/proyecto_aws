# 🔧 SOLUCIÓN: Error de Firma AWS

## ❌ **Error Encontrado:**
```
The request signature we calculated does not match the signature you provided. 
Check your AWS Secret Access Key and signing method.
```

## 🔍 **Causas Posibles:**

### 1. **Credenciales Incorrectas**
- Access Key ID o Secret Access Key mal copiados
- Caracteres especiales o espacios extra
- Credenciales expiradas o inválidas

### 2. **Variables de Entorno Mal Configuradas**
- Variables no configuradas en Vercel
- Nombres incorrectos de variables
- Valores con espacios o caracteres especiales

### 3. **Región Incorrecta**
- Región no coincide con los recursos
- Configuración de región incorrecta

## ✅ **SOLUCIÓN PASO A PASO:**

### **Paso 1: Verificar Credenciales AWS**

1. **Ve a AWS Console** → **IAM** → **Users** → Tu usuario
2. **Security credentials** → **Access keys**
3. **Verifica que las credenciales sean correctas:**
   - Access Key ID: `AKIA...` (20 caracteres)
   - Secret Access Key: `...` (40 caracteres)

### **Paso 2: Configurar Variables en Vercel**

1. **Ve a tu proyecto en Vercel Dashboard**
2. **Settings** → **Environment Variables**
3. **Agrega estas variables EXACTAMENTE así:**

```env
AWS_ACCESS_KEY_ID=AKIA5IZLXMNTO53MSX6H
AWS_SECRET_ACCESS_KEY=jZkqRpUG9Jc71i/p28Ky2LNGNlfcHq++jvtJpj
AWS_REGION=us-east-1
S3_BUCKET_NAME=vigila-videos-912235389798
```

### **Paso 3: Verificar Configuración**

**IMPORTANTE:**
- ✅ **NO** agregues espacios antes o después de los valores
- ✅ **NO** agregues comillas alrededor de los valores
- ✅ **NO** agregues `export` o `=` extra
- ✅ **SÍ** usa los nombres exactos mostrados arriba

### **Paso 4: Redesplegar**

1. **Después de agregar las variables:**
   - Haz clic en **"Save"**
   - Ve a **"Deployments"**
   - Haz clic en **"Redeploy"** en el último deployment

2. **Espera 2-3 minutos** para que se propaguen las variables

### **Paso 5: Probar la Conexión**

1. **Ve a tu dashboard desplegado**
2. **Pestaña "Análisis"** → **"Estado de Conexión AWS"**
3. **Haz clic en "Probar Credenciales"**

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Credenciales AWS válidas",
  "data": {
    "region": "us-east-1",
    "accessKeyId": "AKIA5IZL...",
    "metricsCount": 0
  }
}
```

## 🚨 **Si el Error Persiste:**

### **Opción 1: Generar Nuevas Credenciales**
1. **AWS Console** → **IAM** → **Users** → Tu usuario
2. **Security credentials** → **Create access key**
3. **Copiar las nuevas credenciales**
4. **Actualizar en Vercel**

### **Opción 2: Verificar Permisos IAM**
Asegúrate de que tu usuario tenga estas políticas:
- `AmazonEC2ReadOnlyAccess`
- `AmazonRDSReadOnlyAccess`
- `AmazonS3ReadOnlyAccess`
- `CloudWatchReadOnlyAccess`

### **Opción 3: Verificar Región**
- Asegúrate de que todos tus recursos estén en `us-east-1`
- Verifica que `AWS_REGION=us-east-1` esté configurado

## 🔧 **Herramientas de Debug:**

### **Test Directo de API:**
Visita: `https://tu-proyecto.vercel.app/api/test-aws`

### **Logs de Vercel:**
1. **Vercel Dashboard** → **Functions** → **View Function Logs**
2. Busca errores relacionados con AWS

### **Variables de Entorno:**
En el componente de debug verás:
- ✅ `AWS_ACCESS_KEY_ID: ✓ Configurada`
- ✅ `AWS_REGION: us-east-1`
- ✅ `S3_BUCKET_NAME: vigila-videos-xxx`

## 📞 **Si Necesitas Ayuda:**

1. **Revisa los logs** en Vercel Dashboard
2. **Verifica las credenciales** en AWS Console
3. **Confirma la región** de tus recursos
4. **Contacta para soporte** si el problema persiste

---

**¡Con estos pasos el error debería resolverse!** 🎉

