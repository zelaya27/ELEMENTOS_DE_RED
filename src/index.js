export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 🔐 LOGIN
    if (url.pathname === "/api/login" && request.method === "POST") {
      try {
        const body = await request.json();

        // Usuario de prueba
        if (body.usuario === "admin" && body.contrasena === "1234") {
          return new Response(JSON.stringify({
            success: true,
            message: "Login correcto"
          }), {
            headers: { "Content-Type": "application/json" }
          });
        }

        return new Response(JSON.stringify({
          success: false,
          error: "Usuario o contraseña incorrectos"
        }), {
          status: 401,
          headers: { "Content-Type": "application/json" }
        });

      } catch (e) {
        return new Response(JSON.stringify({
          success: false,
          error: "Error en el servidor"
        }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }
    }

    // 🌐 SERVIR ARCHIVOS ESTÁTICOS (HTML, JS, CSS)
    return env.ASSETS.fetch(request);
  }
};
