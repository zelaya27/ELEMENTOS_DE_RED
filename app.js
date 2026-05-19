// Lógica para ver/ocultar contraseña
const togglePassword = document.getElementById('togglePassword');
const passInput = document.getElementById('contrasena');

togglePassword.addEventListener('click', () => {
    const type = passInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passInput.setAttribute('type', type);
    togglePassword.innerText = type === 'password' ? '👁️' : '🙈';
});

async function validarLogin() {
    const usuario = document.getElementById('usuario').value;
    const contrasena = document.getElementById('contrasena').value;
    const mensaje = document.getElementById('mensaje');
    
    mensaje.innerText = "Validando...";
    mensaje.style.color = "blue";

    try {
        const respuesta = await fetch("https://edr.zelayadk.workers.dev/", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario, contrasena })
        });

        const datos = await respuesta.json();
        
        if (datos.success) {
            mensaje.innerText = "¡Acceso concedido!";
            mensaje.style.color = "green";
            // Aquí puedes redirigir a la siguiente página:
            // window.location.href = "mapa.html";
        } else {
            mensaje.innerText = datos.error || "Datos incorrectos.";
            mensaje.style.color = "red";
        }
    } catch (e) {
        mensaje.innerText = "Error de conexión con el servidor.";
        mensaje.style.color = "red";
    }
}
