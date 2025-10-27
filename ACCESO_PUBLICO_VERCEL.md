# 🔓 Configuración de Acceso Público en Vercel

## 🚨 Problema Identificado
Cuando compartes el link `https://proyecto-aws-theta.vercel.app`, Vercel pide login porque:

### Posibles Causas:
1. **Proyecto Privado**: El proyecto está configurado como privado
2. **Autenticación Habilitada**: Hay middleware de auth configurado
3. **Configuración de Dominio**: Problemas con el dominio público
4. **Variables de Entorno**: Configuración que requiere autenticación

## ✅ Soluciones

### 1. **Verificar Configuración del Proyecto**

#### En Vercel Dashboard:
1. Ve a tu proyecto `proyecto-aws-theta`
2. **Settings** → **General**
3. Busca la sección **"Visibility"**
4. Asegúrate de que esté configurado como **"Public"**

### 2. **Verificar Middleware de Autenticación**

Revisa si hay archivos de middleware que requieran autenticación:

```bash
# Buscar archivos de middleware
find . -name "middleware.*" -type f
```

### 3. **Configuración de Variables de Entorno**

Verifica que no haya variables que requieran autenticación:

#### Variables que NO deben requerir auth:
- `NEXT_PUBLIC_APP_URL`
- `S3_BUCKET_NAME`
- `S3_REGION`

#### Variables que SÍ requieren auth (pero no bloquean acceso):
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

### 4. **Verificar Configuración de Next.js**

Revisa `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Asegúrate de que no haya configuraciones de auth aquí
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig
```

### 5. **Configuración de Dominio Público**

#### En Vercel Dashboard:
1. **Settings** → **Domains**
2. Asegúrate de que el dominio esté configurado como público
3. Verifica que no haya restricciones de acceso

## 🔧 Pasos para Solucionar

### Paso 1: Verificar Visibilidad del Proyecto
```bash
# En Vercel Dashboard
Settings → General → Visibility → Public
```

### Paso 2: Revisar Configuración de Deploy
```bash
# Verificar que no haya configuraciones de auth
cat vercel.json
cat next.config.js
```

### Paso 3: Probar Acceso Directo
```bash
# Probar acceso sin cookies/caché
curl -I https://proyecto-aws-theta.vercel.app
```

### Paso 4: Verificar Variables de Entorno
```bash
# En Vercel Dashboard
Settings → Environment Variables
```

## 🎯 Configuración Recomendada

### Para Acceso Público Total:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ]
}
```

### Variables de Entorno Públicas:
```
NEXT_PUBLIC_APP_URL=https://proyecto-aws-theta.vercel.app
S3_BUCKET_NAME=vigila-videos-912235389798
S3_REGION=us-east-1
```

## 🚀 Solución Rápida

### Opción 1: Cambiar a Proyecto Público
1. Ve a Vercel Dashboard
2. Tu proyecto → Settings → General
3. Cambia "Visibility" a "Public"
4. Redesplega

### Opción 2: Verificar Middleware
```bash
# Buscar archivos de middleware
ls -la | grep middleware
```

### Opción 3: Configuración de Dominio
1. Settings → Domains
2. Verificar que el dominio esté público
3. Eliminar restricciones de acceso

## 🔍 Diagnóstico

### Para identificar el problema exacto:

1. **Abre el link en modo incógnito**
2. **Revisa la consola del navegador** para errores
3. **Verifica la respuesta del servidor**:
   ```bash
   curl -v https://proyecto-aws-theta.vercel.app
   ```

### Posibles Mensajes de Error:
- "Authentication required" → Proyecto privado
- "Access denied" → Restricciones de dominio
- "Login required" → Middleware de auth

## ✅ Resultado Esperado

Después de la configuración correcta:
- ✅ **Acceso público** sin login
- ✅ **Link compartible** con cualquiera
- ✅ **Funcionalidad completa** para todos los usuarios
- ✅ **Sin restricciones** de autenticación

## 🆘 Si el Problema Persiste

### Contactar Soporte de Vercel:
1. Ve a Vercel Dashboard
2. Help → Contact Support
3. Describe el problema de acceso público

### Alternativa Temporal:
- Usar **Vercel Preview URLs** para compartir
- Configurar **dominio personalizado** público
- Revisar **configuraciones de equipo** en Vercel
