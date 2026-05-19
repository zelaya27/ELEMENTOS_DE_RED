export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    };

    // 1. Responder inmediatamente a OPTIONS (Preflight)
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // 2. Solo permitir POST
    if (request.method !== "POST") {
      return new Response("Solo se permite POST", { status: 405, headers: corsHeaders });
    }

    try {
      const { usuario, contrasena } = await request.json();

      const { results } = await env.DB.prepare(
        "SELECT * FROM bd_usuarios WHERE usuario = ? AND contrasena = ?"
      )
      .bind(usuario, contrasena)
      .all();

      if (results.length > 0) {
        return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "content-type": "application/json" } });
      } else {
        return new Response(JSON.stringify({ success: false, message: "Usuario no encontrado" }), { status: 401, headers: { ...corsHeaders, "content-type": "application/json" } });
      }
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { ...corsHeaders, "content-type": "application/json" } });
    }
  },
};
