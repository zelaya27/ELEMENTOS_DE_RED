// --- Lógica para mostrar/ocultar contraseña ---
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');

if (togglePassword && passwordInput) {
    togglePassword.addEventListener('click', function () {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
    });
}

// --- Manejo del envío del formulario Login ---
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault(); 

    const usuario = document.getElementById('usuario').value;
    const password = passwordInput.value;
    const errorMsg = document.getElementById('login-error');
    const submitBtn = document.getElementById('btn-submit');

    submitBtn.innerText = "Verificando...";
    submitBtn.disabled = true;

    try {
        console.log("Intentando conectar con:", 'https://edr.zelayadk.workers.dev/api/login');

        // IMPORTANTE: Asegúrate de usar la URL completa de tu Worker aquí
        const response = await fetch('https://edr.zelayadk.workers.dev/api/login', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ usuario, password })
        });

        console.log("Respuesta del servidor:", response.status);

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
        console.error("Error crítico en la conexión:", error);
        errorMsg.innerText = "Error de conexión. Revisa la consola (F12).";
        errorMsg.style.display = 'block';
    } finally {
        submitBtn.innerText = "Entrar";
        submitBtn.disabled = false;
    }
});

// --- Botón de Cerrar Sesión ---
document.getElementById('btn-logout').addEventListener('click', () => {
    document.getElementById('app-container').style.display = 'none';
    document.getElementById('login-container').style.display = 'block';
    document.getElementById('usuario').value = '';
    passwordInput.value = '';
    passwordInput.setAttribute('type', 'password');
});

// --- Lógica del Mapa Base (Leaflet + Esri) ---
let map;
function inicializarMapa() {
    if (map) return; 

    // Coordenadas iniciales
    map = L.map('map').setView([15.783471, -86.794211], 13);

    // Capa Satelital de Esri
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri'
    }).addTo(map);

    // Geolocalización
    map.locate({setView: true, maxZoom: 16});

    map.on('locationfound', function(e) {
        L.marker(e.latlng).addTo(map)
            .bindPopup("Tu ubicación").openPopup();
    });
}
