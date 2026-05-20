/**
 * APP PARA REPORTAR POSTES Y ELEMENTOS DE RED DAÑADOS
 * Archivo: app.js
 * Lógica de Control de Acceso e Interfaz de Usuario
 */

// URL de tu Cloudflare Worker (Base de datos y API)
const URL_WORKER = "https://edr.zelayadk.workers.dev/login";

/**
 * Valida las credenciales del usuario comunicándose con el Cloudflare Worker.
 */
async function validarLogin() {
    const usuarioInput = document.getElementById('usuario');
    const contrasenaInput = document.getElementById('contrasena');
    const mensajeTexto = document.getElementById('mensaje');
    
    const usuario = usuarioInput.value.trim();
    const contrasena = contrasenaInput.value;

    // 1. Validación visual previa en el Frontend
    if (!usuario || !contrasena) {
        mensajeTexto.innerText = "⚠️ Por favor, llena todos los campos.";
        mensajeTexto.style.color = "#e74c3c"; // Rojo estético
        return;
    }

    // 2. Estado de carga animado/estético
    mensajeTexto.innerText = "🔄 Conectando de forma segura...";
    mensajeTexto.style.color = "#3498db"; // Azul informativo

    try {
        // 3. Petición POST hacia tu Worker
        const respuesta = await fetch(URL_WORKER, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ usuario: usuario, contrasena: contrasena })
        });
        
        // Si el Worker responde con errores de red o caídas (ej: 500)
        if (!respuesta.ok) {
            throw new Error(`Error en respuesta del servidor: ${respuesta.status}`);
        }

        const data = await respuesta.json();
        
        // 4. Procesar la respuesta de la Base de Datos D1
        if (data.success) {
            mensajeTexto.innerText = "✅ ¡Acceso concedido! Entrando...";
            mensajeTexto.style.color = "#2ecc71"; // Verde éxito
            
            // Guardar sesión en el navegador de manera local
            localStorage.setItem('sesion_activa', 'true');
            localStorage.setItem('usuario_actual', usuario);

            // Redirección al mapa después de un breve delay estético
            // setTimeout(() => { window.location.href = "mapa.html"; }, 1200);
            
        } else {
            // Error devuelto por el Worker (Contraseña incorrecta, etc.)
            mensajeTexto.innerText = `❌ ${data.error || "Credenciales inválidas"}`;
            mensajeTexto.style.color = "#e74c3c";
        }

    } catch (error) {
        // Manejo de errores cuando no hay internet o el Worker está caído
        mensajeTexto.innerText = "🌐 Error de red. No se pudo conectar al servidor.";
        mensajeTexto.style.color = "#e74c3c";
        console.error("Detalle técnico del error:", error);
    }
}

/**
 * Alterna la visibilidad de la contraseña en el formulario.
 * Cambia el tipo de input de 'password' a 'text' e intercambia el ícono del botón.
 */
function togglePassword() {
    const contrasenaInput = document.getElementById('contrasena');
    const botonOjo = document.getElementById('btn-ojo');

    if (contrasenaInput.type === 'password') {
        contrasenaInput.type = 'text';
        botonOjo.innerHTML = "🙈 Ocultar"; // Cambia el texto/emoji de forma limpia
    } else {
        contrasenaInput.type = 'password';
        botonOjo.innerHTML = "👁️ Ver";
    }
}
