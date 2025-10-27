# 📹 VIGILA Dashboard - Sistema de Vigilancia Inteligente

## 🚀 **Descripción**

Dashboard moderno y funcional para el sistema de vigilancia VIGILA, desarrollado con Next.js y conectado a infraestructura AWS. Incluye funcionalidad de cámaras en tiempo real, captura de fotos y monitoreo de métricas.

## ✨ **Características**

### 🎨 **Diseño Moderno**
- Interfaz con gradientes y efectos glassmorphism
- Animaciones suaves y transiciones
- Diseño responsivo para todos los dispositivos
- Pestañas de navegación (Resumen, Cámaras, Análisis)

### 📹 **Funcionalidad de Cámaras**
- Acceso directo a cámara web del dispositivo
- Captura de fotos en tiempo real
- Descarga de imágenes capturadas
- Simulación de múltiples cámaras de seguridad
- Controles individuales por cámara

### 📊 **Monitoreo en Tiempo Real**
- Métricas de sistema AWS
- Estado de servicios (EC2, RDS, S3, CloudWatch)
- Información de infraestructura
- Análisis de tendencias de seguridad

## 🛠️ **Tecnologías**

- **Frontend:** Next.js 16, React 19, TypeScript
- **Styling:** Tailwind CSS con componentes personalizados
- **Iconos:** Lucide React
- **Backend:** AWS (EC2, RDS, S3, CloudWatch)
- **Deployment:** Vercel

## 📁 **Estructura del Proyecto**

```
vigila-dashboard/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Dashboard principal
│   │   ├── layout.tsx        # Layout con metadata
│   │   └── globals.css       # Estilos globales
│   └── components/
│       ├── SecurityCamera.tsx # Componente de cámara
│       └── CameraGrid.tsx     # Grid de cámaras
├── package.json              # Dependencias
├── tailwind.config.ts        # Configuración Tailwind
├── vercel.json              # Configuración Vercel
└── env.example              # Variables de entorno ejemplo
```

## 🔧 **Configuración**

### **Variables de Entorno**

1. **Copiar archivo de ejemplo:**
   ```bash
   cp env.example .env.local
   ```

2. **Configurar valores reales:**
   - Obtener credenciales AWS
   - Configurar endpoint RDS
   - Establecer bucket S3
   - Generar claves de seguridad

3. **Para Vercel:**
   - Agregar variables en Project Settings > Environment Variables
   - Usar los valores del archivo `env-production.txt`

### **Desarrollo Local**

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Build para producción
npm run build

# Iniciar servidor de producción
npm start
```

## 🔒 **Seguridad**

### **Archivos Protegidos**
Los siguientes archivos están en `.gitignore` y NO se suben al repositorio:

- `.env*` - Variables de entorno
- `env-production.txt` - Valores reales de producción
- `env-vercel.txt` - Configuración de Vercel
- `*.tfstate` - Estado de Terraform
- `*.pem`, `*.key` - Claves privadas

### **Buenas Prácticas**
- ✅ Usar `env.example` como plantilla
- ✅ Nunca subir credenciales reales
- ✅ Rotar claves regularmente
- ✅ Usar variables de entorno en Vercel
- ❌ No hardcodear credenciales en código

## 📹 **Uso de Cámaras**

### **Acceso a Cámara Web**
1. Ir a la pestaña "Cámaras"
2. Seleccionar una cámara (ej: Cámara Principal)
3. Hacer clic en "Iniciar Cámara"
4. Permitir acceso cuando el navegador lo solicite
5. Usar "Capturar" para tomar fotos
6. Descargar imágenes con "Descargar"

### **Permisos Requeridos**
- Acceso a cámara web
- Descarga de archivos
- Almacenamiento local (para preview)

## 🚀 **Despliegue**

### **Vercel (Recomendado)**
1. Conectar repositorio GitHub
2. Seleccionar carpeta `infrastructure/vigila-dashboard`
3. Configurar variables de entorno
4. Desplegar automáticamente

### **Variables de Vercel**
```env
AWS_ACCESS_KEY_ID=tu_access_key
AWS_SECRET_ACCESS_KEY=tu_secret_key
DATABASE_URL=postgresql://...
S3_BUCKET_NAME=tu_bucket
# ... más variables
```

## 📊 **Métricas Disponibles**

- **Cámaras Activas:** Estado de cámaras de seguridad
- **Alertas:** Número de alertas del día
- **CPU:** Uso de procesador del servidor
- **Almacenamiento:** Espacio usado en S3/RDS
- **Usuarios:** Usuarios conectados al sistema
- **Respuesta:** Tiempo de respuesta de servicios

## 🔧 **Troubleshooting**

### **Error de Cámara**
- Verificar permisos del navegador
- Comprobar que la cámara no esté en uso
- Revisar configuración HTTPS (requerido para cámara)

### **Error de Conexión AWS**
- Verificar credenciales en variables de entorno
- Comprobar región AWS
- Revisar permisos IAM

### **Error de Build**
- Verificar dependencias: `npm install`
- Comprobar TypeScript: `npm run build`
- Revisar configuración Tailwind

## 📞 **Soporte**

Para problemas o preguntas:
- Revisar logs en Vercel Dashboard
- Verificar configuración AWS
- Consultar documentación de Next.js

## 🎯 **Próximas Mejoras**

- [ ] Integración completa con CloudWatch API
- [ ] Subida automática de fotos a S3
- [ ] Notificaciones en tiempo real
- [ ] Análisis de IA para detección de movimiento
- [ ] App móvil complementaria

---

**Desarrollado por:** VIGILA Team  
**Versión:** 1.0.0  
**Licencia:** MIT
