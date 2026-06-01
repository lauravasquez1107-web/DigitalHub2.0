// Script para configurar Railway MySQL con las tablas de DigitalHub
// Ejecutar: node setup-railway-database.js

const mysql = require('mysql2/promise');

// Configuración real de Railway
const RAILWAY_CONFIG = {
    host: 'maglev.proxy.rlwy.net',
    port: 27264,
    user: 'root',
    password: 'rWKJrkHQoiMJwsIShmHBaHQlVLCQDLDr',
    database: 'railway',
    ssl: { rejectUnauthorized: false }
};

async function setupRailwayDatabase() {
    let connection;
    
    try {
        console.log('🚂 Conectando a Railway MySQL...');
        console.log(`📍 Host: ${RAILWAY_CONFIG.host}:${RAILWAY_CONFIG.port}`);
        
        connection = await mysql.createConnection(RAILWAY_CONFIG);
        console.log('✅ Conexión exitosa a Railway');

        // Crear tablas principales
        console.log('📋 Creando tablas en Railway...');

        // 1. Tabla usuario
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS usuario (
                id_usuario INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL,
                correo VARCHAR(100) UNIQUE NOT NULL,
                contrasena VARCHAR(255) NOT NULL,
                rol ENUM('administrador', 'instructor', 'aprendiz') NOT NULL,
                estado ENUM('activo', 'inactivo') DEFAULT 'activo',
                fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Tabla usuario creada');

        // 2. Tabla ambiente
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS ambiente (
                id_ambiente INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL,
                direccion VARCHAR(200),
                fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Tabla ambiente creada');

        // 3. Tabla portatil
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS portatil (
                id_portatil INT AUTO_INCREMENT PRIMARY KEY,
                num_serie VARCHAR(100) UNIQUE NOT NULL,
                marca VARCHAR(50) NOT NULL,
                tipo VARCHAR(50) NOT NULL,
                modelo VARCHAR(100) NOT NULL,
                estado ENUM('disponible', 'asignado', 'mantenimiento', 'dañado') DEFAULT 'disponible',
                ubicacion VARCHAR(200),
                descripcion TEXT,
                id_instructor INT,
                id_aprendiz INT,
                fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_instructor (id_instructor),
                INDEX idx_aprendiz (id_aprendiz)
            )
        `);
        console.log('✅ Tabla portatil creada');

        // 4. Tabla ficha
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS ficha (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL,
                programa_formacion VARCHAR(200) NOT NULL,
                jornada ENUM('mañana', 'tarde', 'noche') NOT NULL,
                id_instructor INT NOT NULL,
                cupo_maximo INT NOT NULL,
                estado ENUM('activa', 'inactiva', 'finalizada') DEFAULT 'activa',
                fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                ambiente_nombre VARCHAR(100),
                ambiente_nave VARCHAR(50),
                eliminada BOOLEAN DEFAULT FALSE,
                fecha_eliminacion TIMESTAMP NULL,
                INDEX idx_instructor (id_instructor)
            )
        `);
        console.log('✅ Tabla ficha creada');

        // 5. Tabla ficha_aprendiz
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS ficha_aprendiz (
                id INT AUTO_INCREMENT PRIMARY KEY,
                id_ficha INT NOT NULL,
                id_aprendiz INT NOT NULL,
                fecha_union TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                estado ENUM('activo', 'inactivo') DEFAULT 'activo',
                UNIQUE KEY unique_ficha_aprendiz (id_ficha, id_aprendiz),
                INDEX idx_ficha (id_ficha),
                INDEX idx_aprendiz (id_aprendiz)
            )
        `);
        console.log('✅ Tabla ficha_aprendiz creada');

        // 6. Tabla asignacion
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS asignacion (
                id_asignacion INT AUTO_INCREMENT PRIMARY KEY,
                id_portatil INT NOT NULL,
                id_ficha INT NOT NULL,
                fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                estado ENUM('activa', 'finalizada') DEFAULT 'activa',
                INDEX idx_portatil (id_portatil),
                INDEX idx_ficha (id_ficha)
            )
        `);
        console.log('✅ Tabla asignacion creada');

        // 7. Tabla reportes
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS reportes (
                id_reporte INT AUTO_INCREMENT PRIMARY KEY,
                id_aprendiz INT NOT NULL,
                id_portatil INT NOT NULL,
                descripcion TEXT NOT NULL,
                estado_reporte ENUM('pendiente', 'en_revision', 'resuelto') DEFAULT 'pendiente',
                fecha_reporte TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                id_instructor INT,
                id_administrador INT,
                INDEX idx_aprendiz (id_aprendiz),
                INDEX idx_portatil (id_portatil)
            )
        `);
        console.log('✅ Tabla reportes creada');

        // 8. Tabla notificaciones
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS notificaciones (
                id INT AUTO_INCREMENT PRIMARY KEY,
                id_usuario INT NOT NULL,
                titulo VARCHAR(200) NOT NULL,
                mensaje TEXT NOT NULL,
                tipo ENUM('info', 'warning', 'error', 'success') DEFAULT 'info',
                leida BOOLEAN DEFAULT FALSE,
                fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_usuario (id_usuario),
                INDEX idx_leida (leida)
            )
        `);
        console.log('✅ Tabla notificaciones creada');

        // 9. Tabla chat_ficha
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS chat_ficha (
                id INT AUTO_INCREMENT PRIMARY KEY,
                id_ficha INT NOT NULL,
                id_usuario INT NOT NULL,
                mensaje TEXT NOT NULL,
                fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_ficha (id_ficha),
                INDEX idx_usuario (id_usuario)
            )
        `);
        console.log('✅ Tabla chat_ficha creada');

        // 10. Tabla recuperacion_contrasena
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS recuperacion_contrasena (
                id INT AUTO_INCREMENT PRIMARY KEY,
                correo VARCHAR(100) NOT NULL,
                codigo VARCHAR(6) NOT NULL,
                fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                fecha_expiracion TIMESTAMP NOT NULL,
                usado BOOLEAN DEFAULT FALSE,
                INDEX idx_correo (correo),
                INDEX idx_codigo (codigo)
            )
        `);
        console.log('✅ Tabla recuperacion_contrasena creada');

        // 11. Tabla historial_portatil
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS historial_portatil (
                id INT AUTO_INCREMENT PRIMARY KEY,
                id_portatil INT NOT NULL,
                accion VARCHAR(100) NOT NULL,
                descripcion TEXT,
                id_usuario INT,
                fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_portatil (id_portatil),
                INDEX idx_usuario (id_usuario)
            )
        `);
        console.log('✅ Tabla historial_portatil creada');

        // Crear usuario administrador por defecto
        console.log('👤 Creando usuario administrador...');
        
        // Verificar si ya existe
        const [existing] = await connection.execute(
            'SELECT id_usuario FROM usuario WHERE correo = ?',
            ['admin@digitalhub.com']
        );

        if (existing.length === 0) {
            const bcrypt = require('bcrypt');
            const hashedPassword = await bcrypt.hash('admin123', 10);
            
            await connection.execute(`
                INSERT INTO usuario (nombre, correo, contrasena, rol) 
                VALUES ('Administrador', 'admin@digitalhub.com', ?, 'administrador')
            `, [hashedPassword]);
            
            console.log('✅ Usuario administrador creado');
        } else {
            console.log('ℹ️  Usuario administrador ya existe');
        }

        // Crear algunos ambientes de ejemplo
        console.log('🏢 Creando ambientes de ejemplo...');
        const ambientes = [
            ['Laboratorio 1', 'Bloque A - Piso 1'],
            ['Laboratorio 2', 'Bloque A - Piso 2'],
            ['Aula Magna', 'Bloque B - Piso 1']
        ];

        for (const [nombre, direccion] of ambientes) {
            await connection.execute(`
                INSERT IGNORE INTO ambiente (nombre, direccion) VALUES (?, ?)
            `, [nombre, direccion]);
        }
        console.log('✅ Ambientes de ejemplo creados');

        console.log('\n🎉 ¡Base de datos configurada exitosamente en Railway!');
        console.log('🔗 Tu aplicación ya puede conectarse a la base de datos');
        console.log('\n📧 Credenciales de administrador:');
        console.log('   Email: admin@digitalhub.com');
        console.log('   Password: admin123');
        console.log('\n🚀 Próximo paso: Configurar variables en Vercel y hacer redeploy');
        
    } catch (error) {
        console.error('❌ Error configurando Railway:', error.message);
        
        if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.error('🔑 Verifica tus credenciales de Railway');
        } else if (error.code === 'ENOTFOUND') {
            console.error('🌐 Verifica la URL del host de Railway');
        }
        
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// Ejecutar setup
if (require.main === module) {
    setupRailwayDatabase();
}

module.exports = { setupRailwayDatabase };