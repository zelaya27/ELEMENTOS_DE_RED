export default {
  async fetch(request, env) {
    // Definimos los permisos de CORS de forma global
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // 1. EL "SALUDO" (OPTIONS): Siempre debe responder OK
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers });
    }

    // 2. LA PETICIÓN REAL
    try {
      if (request.method !== "POST") {
        return new Response(JSON.stringify({ error: "Método no permitido" }), { status: 405, headers });
      }

      const { usuario, contrasena } = await request.json();
      
      // Intentar conectar a la base de datos (Si el Binding no está activo, esto fallará aquí)
      if (!env.DB) {
          return new Response(JSON.stringify({ error: "Error de configuración: DB no está vinculada" }), { status: 500, headers });
      }

      const { results } = await env.DB.prepare(
        "SELECT * FROM bd_usuarios WHERE usuario = ? AND contrasena = ?"
      ).bind(usuario, contrasena).all();

      if (results.length > 0) {
        return new Response(JSON.stringify({ success: true }), { headers: { ...headers, "Content-Type": "application/json" } });
      } else {
        return new Response(JSON.stringify({ success: false, error: "Datos incorrectos" }), { headers: { ...headers, "Content-Type": "application/json" } });
      }
    } catch (e) {
      return new Response(JSON.stringify({ success: false, error: "Error en DB: " + e.message }), { status: 500, headers: { ...headers, "Content-Type": "application/json" } });
    }
  }
};
