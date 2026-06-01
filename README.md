# DigitalHub 2.0 🚀

Sistema de gestión de portátiles para instituciones educativas con backend Node.js/Express/MySQL y frontend React/Vite.

## 📋 Estructura del Proyecto

```
DigitalHub2.0/
├── backend/          # API Node.js con Express y MySQL
├── frontend/         # Aplicación React con Vite
└── README.md
```

## 🚀 Despliegue en Vercel

### 1. Configurar Base de Datos MySQL

**Opción A: PlanetScale (Recomendado)**
1. Crear cuenta en [PlanetScale](https://planetscale.com/)
2. Crear nueva base de datos
3. Obtener string de conexión
4. Ejecutar migraciones

**Opción B: Railway**
1. Crear cuenta en [Railway](https://railway.app/)
2. Crear servicio MySQL
3. Obtener credenciales de conexión

### 2. Desplegar Backend

1. **Conectar repositorio con Vercel:**
   ```bash
   # En Vercel Dashboard
   - Import Git Repository
   - Seleccionar: https://github.com/lauravasquez1107-web/DigitalHub2.0.git
   - Root Directory: backend
   ```

2. **Configurar variables de entorno en Vercel:**
   ```
   NODE_ENV=production
   JWT_SECRET=tu_jwt_secret_super_seguro_aqui
   FRONTEND_URL=https://tu-frontend.vercel.app
   DB_HOST=tu_host_mysql.com
   DB_USER=tu_usuario
   DB_PASS=tu_password_seguro
   DB_NAME=digital_hub
   EMAIL_USER=tu_email@gmail.com
   EMAIL_PASS=tu_app_password_gmail
   ```

3. **Deploy automático** - Vercel detectará `vercel.json` y desplegará

### 3. Desplegar Frontend

1. **Crear nuevo proyecto en Vercel:**
   ```bash
   # En Vercel Dashboard
   - Import Git Repository (mismo repo)
   - Root Directory: frontend
   ```

2. **Configurar variables de entorno:**
   ```
   VITE_API_URL=https://tu-backend.vercel.app
   ```

3. **Deploy automático** - Vercel ejecutará `npm run build`

### 4. Configurar Base de Datos

Ejecutar migraciones en producción:
```bash
# Conectar a tu base de datos y ejecutar archivos en /backend/migrations/
# O usar el script init-production.js
```

## 🔧 Variables de Entorno Requeridas

### Backend (.env)
```env
PORT=3001
NODE_ENV=production
JWT_SECRET=tu_jwt_secret_super_seguro
FRONTEND_URL=https://tu-frontend.vercel.app
DB_HOST=tu_host_mysql.com
DB_USER=tu_usuario
DB_PASS=tu_password_seguro
DB_NAME=digital_hub
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_app_password_gmail
```

### Frontend (.env)
```env
VITE_API_URL=https://tu-backend.vercel.app
```

## 📱 URLs de Producción

- **Frontend:** `https://tu-frontend.vercel.app`
- **Backend API:** `https://tu-backend.vercel.app`

## 🛠️ Desarrollo Local

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📊 Funcionalidades

- ✅ Gestión de usuarios (Admin, Instructor, Aprendiz)
- ✅ Gestión de portátiles y asignaciones
- ✅ Sistema de reportes y notificaciones
- ✅ Chat por ficha
- ✅ Importación/Exportación Excel
- ✅ Recuperación de contraseñas
- ✅ Historial de portátiles

## 🔒 Seguridad

- JWT para autenticación
- Bcrypt para hash de contraseñas
- Helmet para headers de seguridad
- Validaciones de entrada
- CORS configurado

## 📧 Soporte

Para soporte técnico, contactar al equipo de desarrollo.