// Función para mostrar/ocultar contraseña
function togglePassword() {
    const input = document.getElementById('contrasena');
    input.type = (input.type === "password") ? "text" : "password";
}

// Función de Login que habla con Cloudflare
async function validarLogin() {
    const usuario = document.getElementById('usuario').value.trim();
    const contrasena = document.getElementById('contrasena').value.trim();
    const mensaje = document.getElementById('mensaje');
    
    mensaje.innerText = "Conectando...";
    
    // --- IMPORTANTE: Aquí debes poner la URL de tu Cloudflare Worker ---
    const URL_WORKER = "https://tu-worker.tu-dominio.workers.dev"; 

    try {
        const respuesta = await fetch(URL_WORKER, {
            method: 'POST',
            body: JSON.stringify({ usuario, contrasena }),
            headers: { 'Content-Type': 'application/json' }
        });

        const datos = await respuesta.json();

        if (datos.success) {
            mensaje.style.color = "green";
            mensaje.innerText = "¡Bienvenido!";
            window.location.href = "mapa.html"; // Redirigir a tu mapa
        } else {
            mensaje.style.color = "red";
            mensaje.innerText = "Usuario o contraseña incorrectos.";
        }
    } catch (e) {
        mensaje.style.color = "red";
        mensaje.innerText = "Error de conexión al servidor.";
    }
}
