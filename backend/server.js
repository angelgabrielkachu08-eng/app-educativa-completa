const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: ['https://institucionneducativa.netlify.app/', 'http://localhost:3000'],
    credentials: true
}));
app.use(bodyParser.json());

// Base de datos en memoria (sin SQLite)
let alumnos = [];
let nextId = 1;

// RUTAS API
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Servidor funcionando en Render',
        alumnosCount: alumnos.length
    });
});

app.get('/api/alumnos', (req, res) => {
    console.log('📥 GET /api/alumnos - Total:', alumnos.length);
    // Ordenar por fecha de creación (más reciente primero)
    const alumnosOrdenados = [...alumnos].sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion));
    res.json(alumnosOrdenados);
});

app.post('/api/alumnos', (req, res) => {
    const { nombre, email, curso, fecha_nacimiento, telefono } = req.body;
    
    console.log('📝 POST /api/alumnos - Creando:', { nombre, email, curso });
    
    // Validación
    if (!nombre || !email || !curso || !fecha_nacimiento) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
    }
    
    // Verificar si el email ya existe
    if (alumnos.some(alumno => alumno.email === email)) {
        return res.status(400).json({ error: 'El email ya está registrado' });
    }
    
    // Crear nuevo alumno
    const nuevoAlumno = {
        id: nextId++,
        nombre,
        email,
        curso,
        fecha_nacimiento,
        telefono: telefono || '',
        fecha_creacion: new Date().toISOString()
    };
    
    alumnos.push(nuevoAlumno);
    console.log('✅ Alumno creado con ID:', nuevoAlumno.id);
    
    res.json({ 
        id: nuevoAlumno.id,
        message: 'Alumno creado exitosamente'
    });
});

app.get('/api/alumnos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const alumno = alumnos.find(a => a.id === id);
    
    if (!alumno) {
        return res.status(404).json({ error: 'Alumno no encontrado' });
    }
    
    res.json(alumno);
});

app.put('/api/alumnos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { nombre, email, curso, fecha_nacimiento, telefono } = req.body;
    
    const alumnoIndex = alumnos.findIndex(a => a.id === id);
    
    if (alumnoIndex === -1) {
        return res.status(404).json({ error: 'Alumno no encontrado' });
    }
    
    // Actualizar alumno
    alumnos[alumnoIndex] = {
        ...alumnos[alumnoIndex],
        nombre,
        email,
        curso,
        fecha_nacimiento,
        telefono: telefono || ''
    };
    
    console.log('✏️ Alumno actualizado:', id);
    res.json({ message: 'Alumno actualizado exitosamente' });
});

app.delete('/api/alumnos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const alumnoIndex = alumnos.findIndex(a => a.id === id);
    
    if (alumnoIndex === -1) {
        return res.status(404).json({ error: 'Alumno no encontrado' });
    }
    
    alumnos.splice(alumnoIndex, 1);
    console.log('🗑️ Alumno eliminado:', id);
    res.json({ message: 'Alumno eliminado exitosamente' });
});

app.get('/api/alumnos/curso/:curso', (req, res) => {
    const curso = req.params.curso;
    const alumnosCurso = alumnos.filter(a => a.curso === curso);
    res.json(alumnosCurso);
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
    console.log(`💾 Base de datos en memoria - Lista para usar`);
});
