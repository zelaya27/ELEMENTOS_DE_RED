async function validarLogin() {
    const usuario = document.getElementById('usuario').value;
    const contrasena = document.getElementById('contrasena').value;
    const mensaje = document.getElementById('mensaje');
    
    mensaje.innerText = "Conectando...";

    // REEMPLAZA ESTA URL CON LA URL QUE TE DA CLOUDFLARE AL DESPLEGAR
    const URL_WORKER = "https://tu-worker.tu-cuenta.workers.dev";

    try {
        const respuesta = await fetch(URL_WORKER, {
            method: 'POST',
            body: JSON.stringify({ usuario, contrasena }),
            headers: { 'Content-Type': 'application/json' }
        });
        const datos = await respuesta.json();
        
        if (datos.success) {
            mensaje.innerText = "¡Bienvenido!";
            mensaje.style.color = "green";
        } else {
            mensaje.innerText = "Acceso denegado.";
            mensaje.style.color = "red";
        }
    } catch (e) {
        mensaje.innerText = "Error de conexión.";
    }
}
