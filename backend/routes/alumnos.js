const express = require('express');
const router = express.Router();
const db = require('../database/database');

// GET - Obtener todos los alumnos
router.get('/', (req, res) => {
    console.log('📥 GET /api/alumnos - Solicitando todos los alumnos');
    db.all('SELECT * FROM alumnos ORDER BY fecha_creacion DESC', (err, rows) => {
        if (err) {
            console.error('❌ Error en GET /api/alumnos:', err);
            return res.status(500).json({ error: 'Error del servidor' });
        }
        console.log(`✅ Enviando ${rows.length} alumnos`);
        res.json(rows);
    });
});

// GET - Obtener un alumno por ID
router.get('/:id', (req, res) => {
    const id = req.params.id;
    console.log(`📥 GET /api/alumnos/${id} - Solicitando alumno`);
    db.get('SELECT * FROM alumnos WHERE id = ?', [id], (err, row) => {
        if (err) {
            console.error('❌ Error obteniendo alumno:', err);
            return res.status(500).json({ error: 'Error del servidor' });
        }
        if (!row) {
            return res.status(404).json({ error: 'Alumno no encontrado' });
        }
        res.json(row);
    });
});

// GET - Obtener alumnos por curso
router.get('/curso/:curso', (req, res) => {
    const curso = req.params.curso;
    console.log(`📥 GET /api/alumnos/curso/${curso}`);
    db.all('SELECT * FROM alumnos WHERE curso = ? ORDER BY nombre', [curso], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// POST - Crear nuevo alumno
router.post('/', (req, res) => {
    const { nombre, email, curso, fecha_nacimiento, telefono } = req.body;
    console.log('📝 POST /api/alumnos - Creando alumno:', { nombre, email, curso });
    
    // Validación básica
    if (!nombre || !email || !curso || !fecha_nacimiento) {
        return res.status(400).json({ error: 'Faltan campos requeridos' });
    }
    
    db.run(
        'INSERT INTO alumnos (nombre, email, curso, fecha_nacimiento, telefono) VALUES (?, ?, ?, ?, ?)',
        [nombre, email, curso, fecha_nacimiento, telefono],
        function(err) {
            if (err) {
                console.error('❌ Error creando alumno:', err);
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(400).json({ error: 'El email ya está registrado' });
                }
                return res.status(400).json({ error: 'Error al crear alumno: ' + err.message });
            }
            console.log(`✅ Alumno creado con ID: ${this.lastID}`);
            res.json({ 
                id: this.lastID,
                message: 'Alumno creado exitosamente'
            });
        }
    );
});

// PUT - Actualizar alumno
router.put('/:id', (req, res) => {
    const { nombre, email, curso, fecha_nacimiento, telefono } = req.body;
    const id = req.params.id;
    console.log(`✏️ PUT /api/alumnos/${id} - Actualizando alumno`);
    
    db.run(
        'UPDATE alumnos SET nombre = ?, email = ?, curso = ?, fecha_nacimiento = ?, telefono = ? WHERE id = ?',
        [nombre, email, curso, fecha_nacimiento, telefono, id],
        function(err) {
            if (err) {
                console.error('❌ Error actualizando alumno:', err);
                return res.status(400).json({ error: err.message });
            }
            console.log(`✅ Alumno ${id} actualizado`);
            res.json({ message: 'Alumno actualizado exitosamente' });
        }
    );
});

// DELETE - Eliminar alumno
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    console.log(`🗑️ DELETE /api/alumnos/${id} - Eliminando alumno`);
    
    db.run('DELETE FROM alumnos WHERE id = ?', [id], function(err) {
        if (err) {
            console.error('❌ Error eliminando alumno:', err);
            return res.status(400).json({ error: err.message });
        }
        console.log(`✅ Alumno ${id} eliminado`);
        res.json({ message: 'Alumno eliminado exitosamente' });
    });
});

module.exports = router;