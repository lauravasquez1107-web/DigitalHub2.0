// Script para ejecutar migraciones en producción
// Ejecutar: node migrate-production.js

require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function runMigrations() {
    let connection;
    
    try {
        console.log('🚀 Iniciando migraciones en producción...');
        console.log(`📍 Conectando a: ${process.env.DB_HOST}/${process.env.DB_NAME}`);
        
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
            multipleStatements: true
        });

        console.log('✅ Conexión establecida con la base de datos');

        // Crear tabla de migraciones si no existe
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS migrations (
                id INT AUTO_INCREMENT PRIMARY KEY,
                filename VARCHAR(255) NOT NULL UNIQUE,
                executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Obtener migraciones ya ejecutadas
        const [executedMigrations] = await connection.execute(
            'SELECT filename FROM migrations'
        );
        const executed = executedMigrations.map(row => row.filename);

        // Leer archivos de migración
        const migrationsDir = path.join(__dirname, 'migrations');
        const migrationFiles = fs.readdirSync(migrationsDir)
            .filter(file => file.endsWith('.js'))
            .sort();

        console.log(`📋 Encontradas ${migrationFiles.length} migraciones`);
        console.log(`📋 Ya ejecutadas: ${executed.length} migraciones`);

        let newMigrations = 0;

        for (const file of migrationFiles) {
            if (executed.includes(file)) {
                console.log(`⏭️  Saltando ${file} (ya ejecutada)`);
                continue;
            }

            try {
                console.log(`📄 Ejecutando migración: ${file}`);
                const migrationPath = path.join(migrationsDir, file);
                
                // Leer el contenido del archivo
                const migrationContent = fs.readFileSync(migrationPath, 'utf8');
                
                // Buscar las consultas SQL en el archivo
                const sqlMatches = migrationContent.match(/`([^`]+)`/g) || 
                                 migrationContent.match(/"([^"]+)"/g) || 
                                 migrationContent.match(/'([^']+)'/g);
                
                if (sqlMatches) {
                    for (const match of sqlMatches) {
                        const sql = match.slice(1, -1); // Remover comillas
                        if (sql.toLowerCase().includes('create') || 
                            sql.toLowerCase().includes('alter') || 
                            sql.toLowerCase().includes('insert')) {
                            
                            await connection.execute(sql);
                        }
                    }
                }

                // Marcar como ejecutada
                await connection.execute(
                    'INSERT INTO migrations (filename) VALUES (?)',
                    [file]
                );
                
                console.log(`✅ Migración ${file} ejecutada correctamente`);
                newMigrations++;
                
            } catch (migrationError) {
                console.error(`❌ Error en migración ${file}:`, migrationError.message);
                // Continuar con las siguientes migraciones
            }
        }

        console.log(`🎉 Proceso completado. ${newMigrations} nuevas migraciones ejecutadas`);
        
    } catch (error) {
        console.error('❌ Error al ejecutar migraciones:', error.message);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// Ejecutar solo si se llama directamente
if (require.main === module) {
    runMigrations();
}

module.exports = { runMigrations };