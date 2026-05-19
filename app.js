async function validarLogin() {
    const usuario = document.getElementById('usuario').value;
    const contrasena = document.getElementById('contrasena').value;
    const mensaje = document.getElementById('mensaje');

    // Cambia esta URL por la URL de tu Cloudflare Worker real
    const URL_WORKER = "https://api-poda.proyectos-jdop.workers.dev"; 

    try {
        const respuesta = await fetch(URL_WORKER, {
            method: 'POST',
            body: JSON.stringify({ usuario, contrasena }),
            headers: { 'Content-Type': 'application/json' }
        });

        const datos = await respuesta.json();

        if (datos.success) {
            mensaje.innerText = "¡Bienvenido!";
            // Aquí puedes redirigir a la pantalla del mapa
            window.location.href = "mapa.html"; 
        } else {
            mensaje.innerText = "Usuario o contraseña incorrectos.";
        }
    } catch (error) {
        mensaje.innerText = "Error de conexión con el servidor.";
    }
}
