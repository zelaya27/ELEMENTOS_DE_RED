document.addEventListener('DOMContentLoaded', () => {
    
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
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault(); 

            const usuario = document.getElementById('usuario').value;
            const password = passwordInput.value;
            const errorMsg = document.getElementById('login-error');
            const submitBtn = document.getElementById('btn-submit');

            submitBtn.innerText = "Verificando...";
            submitBtn.disabled = true;

            try {
                // LLAMADA RELATIVA (La solución al error 404)
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
                console.error("Error crítico en la conexión:", error);
                errorMsg.innerText = "Error de conexión. Revisa la consola.";
                errorMsg.style.display = 'block';
            } finally {
                submitBtn.innerText = "Entrar";
                submitBtn.disabled = false;
            }
        });
    }

    // --- Botón de Cerrar Sesión ---
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            document.getElementById('app-container').style.display = 'none';
            document.getElementById('login-container').style.display = 'block';
            document.getElementById('usuario').value = '';
            passwordInput.value = '';
            passwordInput.setAttribute('type', 'password');
        });
    }
});

// --- Función para consultar cualquier tabla desde el Frontend ---
async function queryDB(table, query, params = []) {
    const response = await fetch('/api/db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ table, query, params })
    });
    return await response.json();
}

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

// Ejemplo: Consultar circuitos de un sector al cargar el mapa
async function cargarCircuitos(sectorUsuario) {
    const data = await queryDB('circuitos', 'SELECT * FROM circuitos WHERE sector = ?', [sectorUsuario]);
    console.log("Circuitos cargados:", data);
    // Aquí pintas los circuitos en el mapa
}
