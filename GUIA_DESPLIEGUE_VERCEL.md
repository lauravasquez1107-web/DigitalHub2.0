# 🚀 Guía Completa de Despliegue en Vercel - DigitalHub 2.0

## 📋 Resumen del Proyecto
- **Backend:** Node.js + Express + MySQL
- **Frontend:** React + Vite
- **Repositorio:** https://github.com/lauravasquez1107-web/DigitalHub2.0.git
- **Estado:** ✅ Código subido y listo para despliegue

---

## 🎯 PASO 1: Configurar Base de Datos MySQL en la Nube

### Opción A: PlanetScale (Recomendado) 🌟

1. **Crear cuenta:**
   - Ir a [PlanetScale](https://planetscale.com/)
   - Registrarse con GitHub o email
   - Verificar cuenta

2. **Crear base de datos:**
   ```
   - Click "Create database"
   - Nombre: "digital-hub" 
   - Región: "US East" (más rápido para Vercel)
   - Plan: "Hobby" (gratis)
   ```

3. **Obtener credenciales:**
   ```
   - Ir a "Settings" > "Passwords"
   - Click "New password"
   - Nombre: "vercel-production"
   - Copiar las credenciales:
     * Host: xxxxx.us-east-1.psdb.cloud
     * Username: xxxxx
     * Password: xxxxx
     * Database: digital_hub
   ```

### Opción B: Railway 🚂

1. **Crear cuenta:**
   - Ir a [Railway](https://railway.app/)
   - Conectar con GitHub

2. **Crear servicio MySQL:**
   ```
   - New Project > Deploy MySQL
   - Esperar a que se despliegue
   - Ir a Variables > Connect
   - Copiar credenciales de conexión
   ```

---

## 🚀 PASO 2: Desplegar Backend en Vercel

### 2.1 Importar Proyecto

1. **Ir a Vercel Dashboard:**
   - [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "Add New..." > "Project"

2. **Importar repositorio:**
   ```
   - Buscar: "DigitalHub2.0"
   - Click "Import"
   - Root Directory: "backend"
   - Framework Preset: "Other"
   ```

### 2.2 Configurar Variables de Entorno

En la sección "Environment Variables" agregar:

```env
NODE_ENV=production
PORT=3001
JWT_SECRET=tu_jwt_secret_super_seguro_cambiar_por_uno_real_de_64_caracteres
FRONTEND_URL=https://digital-hub-frontend.vercel.app

# Credenciales de PlanetScale (ejemplo)
DB_HOST=xxxxx.us-east-1.psdb.cloud
DB_USER=xxxxx
DB_PASS=pscale_pw_xxxxx
DB_NAME=digital_hub

# Gmail para envío de correos
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_app_password_de_gmail
```

### 2.3 Desplegar

```
- Click "Deploy"
- Esperar 2-3 minutos
- Copiar la URL generada (ej: https://digital-hub-backend-git-main-lauravasquez1107-web.vercel.app)
```

---

## 🎨 PASO 3: Desplegar Frontend en Vercel

### 3.1 Crear Segundo Proyecto

1. **Nuevo proyecto:**
   ```
   - Vercel Dashboard > "Add New..." > "Project"
   - Mismo repositorio: "DigitalHub2.0"
   - Root Directory: "frontend"
   - Framework Preset: "Vite"
   ```

### 3.2 Configurar Variables de Entorno

```env
VITE_API_URL=https://digital-hub-backend-git-main-lauravasquez1107-web.vercel.app
```

### 3.3 Desplegar

```
- Click "Deploy"
- Esperar 1-2 minutos
- Copiar la URL del frontend
```

---

## 🔗 PASO 4: Conectar Frontend y Backend

### 4.1 Actualizar FRONTEND_URL en Backend

1. **Ir al proyecto backend en Vercel:**
   ```
   - Settings > Environment Variables
   - Editar FRONTEND_URL
   - Nuevo valor: URL_REAL_DEL_FRONTEND
   - Redeploy
   ```

### 4.2 Verificar CORS

El backend ya está configurado para aceptar el frontend. Si hay problemas:

```javascript
// En backend/src/app.js ya está configurado:
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));
```

---

## 🗄️ PASO 5: Configurar Base de Datos

### 5.1 Ejecutar Migraciones

**Opción A: Desde tu computadora**
```bash
# En la carpeta backend/
node migrate-production.js
```

**Opción B: Desde Vercel (Recomendado)**
1. Ir al proyecto backend en Vercel
2. Functions > Ver logs
3. Las migraciones se ejecutarán automáticamente en el primer request

### 5.2 Verificar Conexión

```bash
# Probar la conexión
node init-production.js
```

---

## ✅ PASO 6: Verificar Funcionamiento

### 6.1 Probar Endpoints

```bash
# Verificar que el backend responde
curl https://tu-backend.vercel.app/api/test

# Verificar conexión a BD
curl https://tu-backend.vercel.app/api/usuarios
```

### 6.2 Probar Frontend

1. **Abrir la URL del frontend**
2. **Probar login/registro**
3. **Verificar que se conecta al backend**

---

## 🔧 PASO 7: Configuraciones Adicionales

### 7.1 Configurar Gmail para Correos

1. **Habilitar 2FA en Gmail**
2. **Generar App Password:**
   ```
   - Google Account > Security
   - 2-Step Verification > App passwords
   - Generar password para "Mail"
   - Usar este password en EMAIL_PASS
   ```

### 7.2 Configurar Dominio Personalizado (Opcional)

```
- Vercel Dashboard > Domains
- Add Domain
- Configurar DNS
```

---

## 🚨 Solución de Problemas Comunes

### Error de CORS
```javascript
// Verificar que FRONTEND_URL esté correcto en backend
console.log('FRONTEND_URL:', process.env.FRONTEND_URL);
```

### Error de Base de Datos
```javascript
// Verificar conexión en backend/src/db/database.js
// Logs en Vercel Functions
```

### Error 404 en Frontend
```json
// Verificar vercel.json en frontend
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## 📱 URLs Finales

Una vez completado el despliegue:

- **Frontend:** `https://digital-hub-frontend-git-main-lauravasquez1107-web.vercel.app`
- **Backend:** `https://digital-hub-backend-git-main-lauravasquez1107-web.vercel.app`

---

## 🎉 ¡Listo!

Tu aplicación DigitalHub 2.0 está ahora funcionando en producción con:

✅ Backend desplegado en Vercel  
✅ Frontend desplegado en Vercel  
✅ Base de datos MySQL en la nube  
✅ Variables de entorno configuradas  
✅ CORS y seguridad configurados  
✅ Sistema de correos funcionando  

**¡Tu aplicación está lista para usar! 🚀**