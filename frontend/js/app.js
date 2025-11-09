// Funcionalidades generales de la aplicación
console.log('🚀 Aplicación cargada correctamente');

// Navegación activa
document.addEventListener('DOMContentLoaded', function() {
    // Resaltar enlace activo en el navbar
    const currentPage = window.location.pathname;
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('font-bold', 'underline');
        }
    });
    
    // Cargar datos iniciales si es necesario
    if (currentPage === '/listado-alumnos') {
        // El listado se carga automáticamente con su propio script
        console.log('Página de listado cargada');
    }
});