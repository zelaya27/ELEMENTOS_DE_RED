export default {
  async fetch(request, env) {
    // Definimos las reglas de "permiso"
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*", // Esto abre la puerta a todos
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // 1. Responder a la pregunta de seguridad del navegador
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // 2. Intentar procesar el login
    try {
      // Si no es POST, no permitimos la entrada
      if (request.method !== "POST") {
        return new Response(JSON.stringify({ error: "Solo permitimos POST" }), { 
          status: 405, 
          headers: { ...corsHeaders } 
        });
      }

      const { usuario, contrasena } = await request.json();

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
      // Si falla, enviamos el error CON las cabeceras CORS
      return new Response(JSON.stringify({ success: false, error: e.message }), { 
        status: 500, 
        headers: { ...corsHeaders, "content-type": "application/json" } 
      });
    }
  },
};
