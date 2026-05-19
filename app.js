async function validarLogin() {
    const usuario = document.getElementById('usuario').value;
    const contrasena = document.getElementById('contrasena').value;
    const mensaje = document.getElementById('mensaje');
    
    mensaje.innerText = "Conectando...";

    // CAMBIA ESTO POR LA URL DE TU WORKER
    const URL_WORKER = "TU_URL_AQUI"; 

    try {
        const respuesta = await fetch(URL_WORKER, {
            method: 'POST',
            body: JSON.stringify({ usuario, contrasena }),
            headers: { 'Content-Type': 'application/json' }
        });

        // Revisamos si la respuesta es exitosa
        if (!respuesta.ok) throw new Error("Error en el servidor");

        const datos = await respuesta.json();
        
        if (datos.success) {
            mensaje.innerText = "¡Bienvenido!";
            mensaje.style.color = "green";
        } else {
            mensaje.innerText = "Usuario incorrecto.";
            mensaje.style.color = "red";
        }
    } catch (e) {
        console.error(e);
        mensaje.innerText = "Error de conexión. Revisa consola (F12).";
        mensaje.style.color = "red";
    }
}
