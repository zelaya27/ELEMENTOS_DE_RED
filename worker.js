export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // 1. Respuesta a OPTIONS (necesario para navegadores)
    if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

    // 2. NUEVA VALIDACIÓN: Si no es POST, no intentamos leer JSON
    if (request.method !== "POST") {
      return new Response(JSON.stringify({ 
        message: "Servidor activo. El login requiere una petición POST." 
      }), { 
        headers: { ...corsHeaders, "content-type": "application/json" } 
      });
    }

    // 3. Lógica principal (solo se ejecuta si es POST)
    try {
      const { usuario, contrasena } = await request.json();

      const { results } = await env.DB.prepare(
        "SELECT * FROM bd_usuarios WHERE usuario = ? AND contrasena = ?"
      )
      .bind(usuario, contrasena)
      .all();

      if (results && results.length > 0) {
        return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "content-type": "application/json" } });
      } else {
        return new Response(JSON.stringify({ success: false, error: "Usuario o contraseña incorrectos" }), { headers: { ...corsHeaders, "content-type": "application/json" } });
      }
    } catch (e) {
      return new Response(JSON.stringify({ success: false, error: "Error de Servidor: " + e.message }), { 
        status: 500, 
        headers: { ...corsHeaders, "content-type": "application/json" } 
      });
    }
  },
};
