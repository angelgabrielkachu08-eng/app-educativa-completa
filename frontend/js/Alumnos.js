// Validación y envío del formulario de alumnos
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('form-alumno');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validarFormulario()) {
                guardarAlumno();
            }
        });
    }
});

function validarFormulario() {
    let valido = true;
    
    // Validar nombre
    const nombre = document.getElementById('nombre').value.trim();
    if (!nombre) {
        mostrarError('error-nombre', 'El nombre es requerido');
        valido = false;
    } else {
        ocultarError('error-nombre');
    }
    
    // Validar email
    const email = document.getElementById('email').value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        mostrarError('error-email', 'Email válido requerido');
        valido = false;
    } else {
        ocultarError('error-email');
    }
    
    // Validar curso
    const curso = document.getElementById('curso').value;
    if (!curso) {
        mostrarError('error-curso', 'Selecciona un curso');
        valido = false;
    } else {
        ocultarError('error-curso');
    }
    
    // Validar fecha
    const fecha = document.getElementById('fecha_nacimiento').value;
    if (!fecha) {
        mostrarError('error-fecha', 'Fecha válida requerida');
        valido = false;
    } else {
        ocultarError('error-fecha');
    }
    
    return valido;
}

function mostrarError(id, mensaje) {
    const elemento = document.getElementById(id);
    elemento.textContent = mensaje;
    elemento.classList.remove('hidden');
}

function ocultarError(id) {
    const elemento = document.getElementById(id);
    elemento.classList.add('hidden');
}

function guardarAlumno() {
    const alumno = {
        nombre: document.getElementById('nombre').value.trim(),
        email: document.getElementById('email').value.trim(),
        curso: document.getElementById('curso').value,
        fecha_nacimiento: document.getElementById('fecha_nacimiento').value,
        telefono: document.getElementById('telefono').value.trim()
    };
    
    console.log('📤 Enviando alumno:', alumno);
    
    // URL de tu backend en Render - IMPORTANTE: ESTA ES TU URL
    const backendURL = 'https://institucion-backend.onrender.com';
    
    const boton = document.querySelector('button[type="submit"]');
    const textoOriginal = boton.textContent;
    boton.textContent = 'Guardando...';
    boton.disabled = true;
    
    fetch(backendURL + '/api/alumnos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(alumno)
    })
    .then(response => {
        console.log('📥 Respuesta recibida, status:', response.status);
        if (!response.ok) {
            throw new Error('Error del servidor: ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        console.log('✅ Datos recibidos:', data);
        
        if (data.error) {
            alert('Error: ' + data.error);
        } else if (data.id) {
            mostrarMensajeExito();
            limpiarFormulario();
        } else {
            alert('Respuesta inesperada del servidor');
        }
    })
    .catch(error => {
        console.error('❌ Error:', error);
        alert('Error al guardar el alumno. Verifica que el servidor esté funcionando.');
    })
    .finally(() => {
        boton.textContent = textoOriginal;
        boton.disabled = false;
    });
}

function mostrarMensajeExito() {
    const mensaje = document.getElementById('mensaje-exito');
    mensaje.classList.remove('hidden');
    
    setTimeout(() => {
        mensaje.classList.add('hidden');
    }, 3000);
}

function limpiarFormulario() {
    document.getElementById('form-alumno').reset();
    // Ocultar todos los errores
    document.querySelectorAll('[id^="error-"]').forEach(el => {
        el.classList.add('hidden');
    });
}
