// Base de datos en el navegador del usuario
function obtenerAlumnos() {
    const alumnos = localStorage.getItem('alumnos');
    return alumnos ? JSON.parse(alumnos) : [];
}

function guardarAlumnos(alumnos) {
    localStorage.setItem('alumnos', JSON.stringify(alumnos));
}

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
    
    const nombre = document.getElementById('nombre').value.trim();
    if (!nombre) {
        mostrarError('error-nombre', 'El nombre es requerido');
        valido = false;
    } else {
        ocultarError('error-nombre');
    }
    
    const email = document.getElementById('email').value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        mostrarError('error-email', 'Email válido requerido');
        valido = false;
    } else {
        ocultarError('error-email');
    }
    
    const curso = document.getElementById('curso').value;
    if (!curso) {
        mostrarError('error-curso', 'Selecciona un curso');
        valido = false;
    } else {
        ocultarError('error-curso');
    }
    
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
        id: Date.now(), // ID único
        nombre: document.getElementById('nombre').value.trim(),
        email: document.getElementById('email').value.trim(),
        curso: document.getElementById('curso').value,
        fecha_nacimiento: document.getElementById('fecha_nacimiento').value,
        telefono: document.getElementById('telefono').value.trim(),
        fecha_creacion: new Date().toISOString()
    };
    
    console.log('Guardando alumno:', alumno);
    
    const boton = document.querySelector('button[type="submit"]');
    const textoOriginal = boton.textContent;
    boton.textContent = 'Guardando...';
    boton.disabled = true;
    
    // Simular delay de red
    setTimeout(() => {
        try {
            const alumnos = obtenerAlumnos();
            
            // Verificar email único
            if (alumnos.some(a => a.email === alumno.email)) {
                alert('Error: El email ya está registrado');
                return;
            }
            
            alumnos.push(alumno);
            guardarAlumnos(alumnos);
            
            mostrarMensajeExito();
            limpiarFormulario();
            
        } catch (error) {
            console.error('Error:', error);
            alert('Error al guardar el alumno.');
        } finally {
            boton.textContent = textoOriginal;
            boton.disabled = false;
        }
    }, 800);
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
    document.querySelectorAll('[id^="error-"]').forEach(el => {
        el.classList.add('hidden');
    });
}
