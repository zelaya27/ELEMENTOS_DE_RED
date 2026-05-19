export default {
  async fetch(request, env) {
    // Definimos las cabeceras CORS
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400", // Cachea la respuesta de permiso por 24 horas
    };

    // 1. EL "SALUDO" (Preflight OPTIONS request)
    // ESTO ES LO QUE ESTÁ FALLANDO. Si el navegador no recibe esto, bloquea todo.
    if (request.method === "OPTIONS") {
      return new Response(null, { 
        status: 204, 
        headers: corsHeaders 
      });
    }

    // 2. LA PETICIÓN REAL
    try {
      if (request.method !== "POST") {
        return new Response(JSON.stringify({ error: "Solo POST" }), { status: 405, headers: corsHeaders });
      }

      // Si env.DB es nulo, el binding NO funcionó. 
      // Ver esto en la consola nos dará la respuesta final.
      if (!env.DB) {
          return new Response(JSON.stringify({ error: "DB no vinculada. Configura el Binding en el panel." }), { status: 500, headers: corsHeaders });
      }

      const { usuario, contrasena } = await request.json();
      
      const { results } = await env.DB.prepare(
        "SELECT * FROM bd_usuarios WHERE usuario = ? AND contrasena = ?"
      ).bind(usuario, contrasena).all();

      if (results.length > 0) {
        return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      } else {
        return new Response(JSON.stringify({ success: false, error: "Usuario o contraseña incorrectos" }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    } catch (e) {
      return new Response(JSON.stringify({ success: false, error: e.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
  }
};
