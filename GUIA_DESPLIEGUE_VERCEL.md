# 🚀 Guía de Despliegue en Vercel - DigitalHub

## 📋 Requisitos Previos

1. **Cuenta en Vercel**: [vercel.com](https://vercel.com)
2. **Base de datos MySQL en la nube** (recomendado):
   - [PlanetScale](https://planetscale.com) (Gratis)
   - [Railway](https://railway.app) (Gratis con límites)
   - [Aiven](https://aiven.io) (Gratis con límites)
3. **Repositorio en GitHub** con tu código

## 🗄️ Paso 1: Configurar Base de Datos

### Opción A: PlanetScale (Recomendado)
1. Crear cuenta en [PlanetScale](https://planetscale.com)
2. Crear nueva base de datos llamada `digital-hub`
3. Obtener string de conexión
4. Ejecutar migraciones desde tu local:
   ```bash
   cd backend
   npm install -g knex
   knex migrate:latest
   ```

### Opción B: Railway
1. Crear cuenta en [Railway](https://railway.app)
2. Crear nuevo proyecto MySQL
3. Obtener credenciales de conexión

## 🔧 Paso 2: Desplegar Backend

1. **Subir código a GitHub** (si no lo has hecho):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/tu-usuario/tu-repo.git
   git push -u origin main
   ```

2. **Conectar con Vercel**:
   - Ir a [vercel.com](https://vercel.com)
   - Hacer clic en "New Project"
   - Importar tu repositorio de GitHub
   - Seleccionar la carpeta `backend`

3. **Configurar variables de entorno en Vercel**:
   ```
   NODE_ENV=production
   PORT=3001
   JWT_SECRET=tu_jwt_secret_super_seguro_cambiar_esto
   DB_HOST=tu_host_mysql_de_planetscale
   DB_USER=tu_usuario_mysql
   DB_PASS=tu_password_mysql
   DB_NAME=digital_hub
   EMAIL_USER=tu_email@gmail.com
   EMAIL_PASS=tu_app_password_gmail
   FRONTEND_URL=https://tu-frontend.vercel.app
   ```

4. **Desplegar**: Vercel desplegará automáticamente

## 🎨 Paso 3: Desplegar Frontend

1. **Crear nuevo proyecto en Vercel**:
   - Nuevo proyecto desde el mismo repositorio
   - Seleccionar la carpeta `frontend`

2. **Configurar variables de entorno**:
   ```
   VITE_API_URL=https://tu-backend.vercel.app
   ```

3. **Configurar Build Settings**:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

## 🔗 Paso 4: Conectar Frontend y Backend

1. **Actualizar CORS en backend**:
   - Ir a tu proyecto backend en Vercel
   - Actualizar variable `FRONTEND_URL` con la URL real del frontend

2. **Actualizar API URL en frontend**:
   - Ir a tu proyecto frontend en Vercel
   - Actualizar variable `VITE_API_URL` con la URL real del backend

## 🧪 Paso 5: Probar el Despliegue

1. **Verificar backend**: Visitar `https://tu-backend.vercel.app`
2. **Verificar frontend**: Visitar `https://tu-frontend.vercel.app`
3. **Probar funcionalidades**:
   - Login/registro
   - CRUD de portátiles
   - Reportes
   - Subida de archivos

## 🔧 Comandos Útiles

### Desarrollo Local
```bash
# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm run dev
```

### Migraciones de Base de Datos
```bash
cd backend
npx knex migrate:latest
```

### Ver logs en Vercel
```bash
npm install -g vercel
vercel logs tu-proyecto-backend
```

## 🚨 Solución de Problemas Comunes

### Error de CORS
- Verificar que `FRONTEND_URL` esté configurada correctamente
- Verificar que las URLs en `corsOptions` sean correctas

### Error de Base de Datos
- Verificar credenciales de conexión
- Verificar que las migraciones se ejecutaron
- Verificar que la base de datos esté accesible desde Vercel

### Error 404 en rutas del Frontend
- Verificar que `vercel.json` esté en la carpeta frontend
- Verificar configuración de rewrites

### Archivos no se suben
- Los archivos se almacenan temporalmente en Vercel
- Para persistencia, usar servicios como Cloudinary o AWS S3

## 📝 URLs Finales

Después del despliegue, tendrás:
- **Backend**: `https://tu-backend.vercel.app`
- **Frontend**: `https://tu-frontend.vercel.app`

## 🔄 Actualizaciones Automáticas

Vercel redesplegará automáticamente cuando hagas push a tu repositorio de GitHub.

---

¡Tu aplicación DigitalHub ya está en línea! 🎉