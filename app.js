async function validarLogin() {
    const usuario = document.getElementById('usuario').value;
    const contrasena = document.getElementById('contrasena').value;
    const mensaje = document.getElementById('mensaje');
    mensaje.innerText = "Validando...";

    try {
        const respuesta = await fetch("/api/login", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario, contrasena })
        });
        const datos = await respuesta.json();
        mensaje.innerText = datos.success ? "¡Bienvenido!" : datos.error;
        mensaje.style.color = datos.success ? "green" : "red";
    } catch (e) {
        mensaje.innerText = "Error de conexión.";
    }
}
