export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

    try {
      const { usuario, contrasena } = await request.json();

      // ESTA ES LA LÍNEA QUE FALLA SI EL BINDING 'DB' NO ESTÁ CONFIGURADO
      const { results } = await env.DB.prepare(
        "SELECT * FROM bd_usuarios WHERE usuario = ? AND contrasena = ?"
      )
      .bind(usuario, contrasena)
      .all();

      if (results && results.length > 0) {
        return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "content-type": "application/json" } });
      } else {
        return new Response(JSON.stringify({ success: false, error: "Usuario no encontrado" }), { headers: { ...corsHeaders, "content-type": "application/json" } });
      }
    } catch (e) {
      return new Response(JSON.stringify({ success: false, error: "Error de Servidor: " + e.message }), { 
        status: 500, 
        headers: { ...corsHeaders, "content-type": "application/json" } 
      });
    }
  },
};
