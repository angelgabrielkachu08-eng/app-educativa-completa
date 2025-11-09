const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'institucion.db');
const db = new sqlite3.Database(dbPath);

// Crear tabla de alumnos
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS alumnos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        curso TEXT NOT NULL,
        fecha_nacimiento TEXT NOT NULL,
        telefono TEXT,
        fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            console.error('❌ Error creando tabla:', err);
        } else {
            console.log('✅ Tabla de alumnos lista');
        }
    });
});

module.exports = db;