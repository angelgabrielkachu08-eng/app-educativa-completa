const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: ['https://institucionneducativa.netlify.app/', 'http://localhost:3000'],
    credentials: true;
app.use(bodyParser.json());

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Importar rutas
const alumnosRoutes = require('./routes/alumnos');
const climaRoutes = require('./routes/clima');

app.use('/api/alumnos', alumnosRoutes);
app.use('/api/clima', climaRoutes);

// Rutas para servir páginas HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.get('/cargar-alumno', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/cargar-alumno.html'));
});

app.get('/listado-alumnos', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/listado-alumnos.html'));
});

app.get('/historia', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/historia.html'));
});

app.get('/ia-generativa', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/ia-generativa.html'));
});

// Ruta de salud
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Servidor funcionando' });
});

// Manejo de errores global
app.use((error, req, res, next) => {
    console.error('Error del servidor:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
});

// Ruta no encontrada
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log('✅ Todas las rutas configuradas correctamente');
});
