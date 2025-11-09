// Datos de clima para Posadas
function obtenerClima(ciudad = 'Posadas') {
    // Simular delay de API
    setTimeout(() => {
        const datosClima = {
            temperatura: Math.floor(Math.random() * 10) + 25, // 25-35°C para Posadas
            descripcion: 'Caluroso y húmedo',
            ubicacion: ciudad + ', Misiones',
            icono: '☀️'
        };
        
        mostrarClima(datosClima);
    }, 1000);
}

function mostrarClima(datos) {
    document.getElementById('temperatura').textContent = `${datos.temperatura}°C`;
    document.getElementById('descripcion').textContent = datos.descripcion;
    document.getElementById('ubicacion').textContent = datos.ubicacion;
    
    const icono = document.querySelector('#clima-widget .text-4xl');
    icono.textContent = datos.icono;
}

function buscarClima() {
    const ciudad = document.getElementById('ciudad-buscador').value.trim();
    if (ciudad) {
        document.getElementById('descripcion').textContent = 'Buscando...';
        obtenerClima(ciudad);
    } else {
        alert('Por favor ingresa una ciudad');
    }
}

// Cargar clima al iniciar
document.addEventListener('DOMContentLoaded', () => {
    obtenerClima();
});