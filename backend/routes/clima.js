const express = require('express');
const router = express.Router();

// Ruta simple del clima
router.get('/', (req, res) => {
    res.json({ 
        message: 'API de clima funcionando',
        temperatura: 25,
        ciudad: 'Posadas, Misiones'
    });
});

module.exports = router;