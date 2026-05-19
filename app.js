async function validarLogin() {
    const usuario = document.getElementById('usuario').value;
    const contrasena = document.getElementById('contrasena').value;
    const mensaje = document.getElementById('mensaje');
    
    // CAMBIA ESTO POR LA URL REAL DE TU WORKER
    const URL_WORKER = "https://edr.zelayadk.workers.dev/";

    console.log("Enviando petición a:", URL_WORKER);

    try {
        const respuesta = await fetch(URL_WORKER, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario, contrasena })
        });

        console.log("Respuesta recibida, status:", respuesta.status);

        if (!respuesta.ok) {
            throw new Error(`HTTP error! status: ${respuesta.status}`);
        }

        const datos = await respuesta.json();
        console.log("Datos del servidor:", datos);

        if (datos.success) {
            mensaje.innerText = "¡Acceso concedido!";
            mensaje.style.color = "green";
        } else {
            mensaje.innerText = "Usuario/Contraseña incorrectos.";
            mensaje.style.color = "red";
        }
    } catch (e) {
        console.error("Error detectado:", e);
        mensaje.innerText = "Error: " + e.message;
        mensaje.style.color = "red";
    }
}


