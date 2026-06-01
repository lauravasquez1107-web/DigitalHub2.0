// Endpoint temporal para inicializar la base de datos
const pool = require('./db/database');
const bcrypt = require('bcrypt');

async function initializeDatabase(req, res) {
    try {
        console.log('🚀 Iniciando configuración de base de datos...');
        
        // 1. Tabla usuario
        await pool.execute(`
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

        // 2. Tabla ambiente
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS ambiente (
                id_ambiente INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL,
                direccion VARCHAR(200),
                fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 3. Tabla portatil
        await pool.execute(`
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
                fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Crear usuario admin
        const [existing] = await pool.execute(
            'SELECT id_usuario FROM usuario WHERE correo = ?',
            ['admin@digitalhub.com']
        );

        if (existing.length === 0) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await pool.execute(`
                INSERT INTO usuario (nombre, correo, contrasena, rol) 
                VALUES ('Administrador', 'admin@digitalhub.com', ?, 'administrador')
            `, [hashedPassword]);
        }

        res.json({
            success: true,
            message: 'Base de datos inicializada correctamente',
            admin: {
                email: 'admin@digitalhub.com',
                password: 'admin123'
            }
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

module.exports = { initializeDatabase };