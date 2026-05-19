export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // Responder a las solicitudes de verificación del navegador (CORS)
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // Si no es un POST, no hacemos nada
    if (request.method !== "POST") {
      return new Response(JSON.stringify({ message: "Servidor activo. Usa POST para login." }), { 
        headers: { ...corsHeaders, "content-type": "application/json" } 
      });
    }

    try {
      const { usuario, contrasena } = await request.json();

      // Consulta a la base de datos D1 usando el binding 'DB'
      const { results } = await env.DB.prepare(
        "SELECT * FROM bd_usuarios WHERE usuario = ? AND contrasena = ?"
      )
      .bind(usuario, contrasena)
      .all();

      if (results && results.length > 0) {
        return new Response(JSON.stringify({ success: true }), { 
          headers: { ...corsHeaders, "content-type": "application/json" } 
        });
      } else {
        return new Response(JSON.stringify({ success: false, error: "Usuario o contraseña incorrectos" }), { 
          headers: { ...corsHeaders, "content-type": "application/json" } 
        });
      }
    } catch (e) {
      return new Response(JSON.stringify({ success: false, error: "Error en servidor: " + e.message }), { 
        status: 500, 
        headers: { ...corsHeaders, "content-type": "application/json" } 
      });
    }
  },
};
