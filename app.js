// Lógica para mostrar/ocultar contraseña
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');

togglePassword.addEventListener('click', function () {
    // Alterna el tipo de input entre 'password' y 'text'
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    
    // Alterna el ícono (ojo abierto / ojo cerrado)
    this.classList.toggle('fa-eye');
    this.classList.toggle('fa-eye-slash');
});

// Manejo del envío del formulario Login
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault(); // Evita recargar la página

    const usuario = document.getElementById('usuario').value;
    const password = passwordInput.value;
    const errorMsg = document.getElementById('login-error');
    const submitBtn = document.getElementById('btn-submit');

    // Cambiar estado del botón a "Cargando"
    submitBtn.innerText = "Verificando...";
    submitBtn.disabled = true;

    try {
        // Enviar al backend
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario, password })
        });

        if (response.ok) {
            // LOGIN CORRECTO
            document.getElementById('login-container').style.display = 'none';
            document.getElementById('app-container').style.display = 'flex';
            errorMsg.style.display = 'none';
            inicializarMapa();
        } else {
            // LOGIN INCORRECTO
            errorMsg.innerText = "Usuario o contraseña incorrectos";
            errorMsg.style.display = 'block';
        }
    } catch (error) {
        console.error("Error en la conexión:", error);
        errorMsg.innerText = "Error al conectar con la base de datos.";
        errorMsg.style.display = 'block';
    } finally {
        // Restaurar el botón
        submitBtn.innerText = "Entrar";
        submitBtn.disabled = false;
    }
});

// Botón de Cerrar Sesión
document.getElementById('btn-logout').addEventListener('click', () => {
    document.getElementById('app-container').style.display = 'none';
    document.getElementById('login-container').style.display = 'block';
    
    // Limpiar campos
    document.getElementById('usuario').value = '';
    passwordInput.value = '';
    
    // Restaurar vista de contraseña
    passwordInput.setAttribute('type', 'password');
    togglePassword.classList.add('fa-eye');
    togglePassword.classList.remove('fa-eye-slash');
});

// Lógica del Mapa Base (Esri)
let map;
function inicializarMapa() {
    if (map) return; 

    // Inicia el mapa
    map = L.map('map').setView([15.783471, -86.794211], 13);

    // Carga la capa Satelital
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri'
    }).addTo(map);

    // Geolocalización del dispositivo
    map.locate({setView: true, maxZoom: 16});

    map.on('locationfound', function(e) {
        L.marker(e.latlng).addTo(map)
            .bindPopup("Tu ubicación actual").openPopup();
    });

    map.on('locationerror', function(e) {
        console.log("GPS no disponible o permiso denegado.");
    });
}
