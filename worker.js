export default {
  async fetch(request, env) {
    // 1. Definimos las cabeceras de CORS estrictas
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*", // Permite peticiones desde cualquier origen
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    // 2. RESPUESTA AL SALUDO (Preflight OPTIONS request)
    // El navegador pide permiso antes de enviar los datos reales.
    if (request.method === "OPTIONS") {
      return new Response(null, { 
        status: 204, // 204 significa "Todo bien, no hay contenido que devolver"
        headers: corsHeaders 
      });
    }

    // 3. PROCESAMIENTO DE DATOS (POST request)
    try {
      if (request.method !== "POST") {
        return new Response(JSON.stringify({ error: "Solo permitimos POST" }), { 
          status: 405, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
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
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        });
      } else {
        return new Response(JSON.stringify({ success: false, error: "Usuario incorrecto" }), { 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        });
      }
    } catch (e) {
      return new Response(JSON.stringify({ success: false, error: e.message }), { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      });
    }
  },
};
