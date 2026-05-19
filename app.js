// Lógica para ver/ocultar contraseña
const togglePassword = document.getElementById('togglePassword');
const passInput = document.getElementById('contrasena');

if (togglePassword) {
    togglePassword.addEventListener('click', () => {
        const type = passInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passInput.setAttribute('type', type);
        togglePassword.innerText = type === 'password' ? '👁️' : '🙈';
    });
}

async function validarLogin() {
    const usuario = document.getElementById('usuario').value;
    const contrasena = document.getElementById('contrasena').value;
    const mensaje = document.getElementById('mensaje');
    
    mensaje.innerText = "Conectando...";
    mensaje.style.color = "blue";
    console.log("Iniciando conexión a: https://edr.zelayadk.workers.dev/");

    try {
        const respuesta = await fetch("https://edr.zelayadk.workers.dev/", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario, contrasena })
        });

        // Vemos el código de estado (200 es éxito, 500 error, etc.)
        console.log("Código de respuesta del servidor:", respuesta.status);

        if (respuesta.ok) {
            const datos = await respuesta.json();
            console.log("Datos recibidos:", datos);
            if (datos.success) {
                mensaje.innerText = "¡Acceso concedido!";
                mensaje.style.color = "green";
            } else {
                mensaje.innerText = datos.error || "Datos incorrectos.";
                mensaje.style.color = "red";
            }
        } else {
            // Si el servidor falla (500) o no encuentra la ruta (404)
            mensaje.innerText = "Error del Servidor: " + respuesta.status;
            mensaje.style.color = "red";
        }
    } catch (e) {
        // Aquí es donde caen los errores de CORS o de red
        console.error("DETALLE DEL ERROR:", e);
        mensaje.innerText = "Error: " + e.message + ". (Revisa la pestaña Console en F12)";
        mensaje.style.color = "red";
    }
}
