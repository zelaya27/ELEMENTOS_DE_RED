export default {
  async fetch(request, env, ctx) {
    // 1. Manejo de CORS (necesario para conectar desde tu HTML)
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // 2. Lógica de Login
    const url = new URL(request.url);
    if (url.pathname === '/api/login' && request.method === 'POST') {
      try {
        const { usuario, password } = await request.json();
        
        // Consultamos D1 (tu binding se llama DB según el error)
        const stmt = env.DB.prepare("SELECT * FROM usuarios WHERE usuario = ? AND password = ?");
        const user = await stmt.bind(usuario, password).first();

        if (user) {
          return new Response(JSON.stringify({ status: "ok", mensaje: "Login exitoso" }), { 
            status: 200, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          });
        } else {
          return new Response(JSON.stringify({ error: "Credenciales incorrectas" }), { 
            status: 401, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          });
        }
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders });
      }
    }

    return new Response("Ruta no encontrada", { status: 404 });
  }
};
