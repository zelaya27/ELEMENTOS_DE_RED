async function validarLogin() {
    const usuario = document.getElementById('usuario').value;
    const contrasena = document.getElementById('contrasena').value;
    const mensaje = document.getElementById('mensaje');
    
    mensaje.innerText = "Conectando...";

    try {
        const respuesta = await fetch("https://edr.zelayadk.workers.dev/", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario, contrasena })
        });

        const datos = await respuesta.json();
        
        if (respuesta.ok && datos.success) {
            mensaje.innerText = "¡Bienvenido!";
            mensaje.style.color = "green";
        } else {
            mensaje.innerText = datos.error || "Usuario/Contraseña incorrectos.";
            mensaje.style.color = "red";
        }
    } catch (e) {
        mensaje.innerText = "Error crítico de conexión.";
    }
}

