async function validarLogin() {
    const u = document.getElementById('usuario').value;
    const p = document.getElementById('contrasena').value;
    const m = document.getElementById('mensaje');

    m.innerText = "Conectando...";
    m.style.color = "black";

    try {
        const respuesta = await fetch("/api/login", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario: u, contrasena: p })
        });

        const data = await respuesta.json();

        if (data.success) {
            m.innerText = "¡Bienvenido!";
            m.style.color = "green";
        } else {
            m.innerText = data.error;
            m.style.color = "red";
        }

    } catch (e) {
        m.innerText = "Error de conexión.";
        m.style.color = "red";
    }
}
