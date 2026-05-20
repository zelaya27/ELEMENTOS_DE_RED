export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 1. Manejo de CORS (para que tu web pueda hablar con el Worker)
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // 2. Ruta de Login
    if (url.pathname === "/api/login" && request.method === "POST") {
      try {
        const { usuario, password } = await request.json();
        
        // El binding "DB" que definiste en wrangler.toml se accede aquí
        const stmt = env.DB.prepare("SELECT * FROM bd_usuarios WHERE usuario = ? AND password = ?");
        const user = await stmt.bind(usuario, password).first();

        if (user) {
          return new Response(JSON.stringify({ status: "ok" }), {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
        return new Response(JSON.stringify({ error: "Credenciales incorrectas" }), {
          status: 401,
          headers: { ...corsHeaders }
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
      }
    }

    return new Response("Not Found", { status: 404 });
  }
};
