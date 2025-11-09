const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware - CORS CORREGIDO
app.use(cors({
    origin: ['https://tu-app.netlify.app', 'http://localhost:3000'],
    credentials: true
}));
app.use(bodyParser.json());

// Base de datos en memoria para producción
const db = new sqlite3.Database(':memory:');

// Crear tabla
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
        console.error('Error creando tabla:', err);
    } else {
        console.log('✅ Tabla de alumnos creada en memoria');
    }
});

// RUTAS API
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Servidor funcionando en Render' });
});

app.get('/api/alumnos', (req, res) => {
    db.all('SELECT * FROM alumnos ORDER BY fecha_creacion DESC', (err, rows) => {
        if (err) {
            console.error('Error en GET /api/alumnos:', err);
            return res.status(500).json({ error: 'Error del servidor' });
        }
        res.json(rows || []);
    });
});

app.post('/api/alumnos', (req, res) => {
    const { nombre, email, curso, fecha_nacimiento, telefono } = req.body;
    
    if (!nombre || !email || !curso || !fecha_nacimiento) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
    }
    
    db.run(
        'INSERT INTO alumnos (nombre, email, curso, fecha_nacimiento, telefono) VALUES (?, ?, ?, ?, ?)',
        [nombre, email, curso, fecha_nacimiento, telefono],
        function(err) {
            if (err) {
                console.error('Error creando alumno:', err);
                return res.status(400).json({ error: 'Error al crear alumno' });
            }
            res.json({ 
                id: this.lastID,
                message: 'Alumno creado exitosamente'
            });
        }
    );
});

// Ruta simple para el clima
app.get('/api/clima', (req, res) => {
    res.json({ 
        temperatura: 25, 
        ciudad: 'Posadas, Misiones',
        mensaje: 'Datos de clima simulados'
    });
});

// Manejo de errores
app.use((err, req, res, next) => {
    console.error('Error del servidor:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
});

// Ruta no encontrada
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor funcionando en puerto ${PORT}`);
    console.log(`✅ Health check: http://localhost:${PORT}/api/health`);
});
