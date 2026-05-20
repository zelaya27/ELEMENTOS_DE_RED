export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 1. Manejo de CORS (esencial para que tu HTML hable con la API)
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // 2. Lógica de Login
    if (url.pathname === '/api/login' && request.method === 'POST') {
      try {
        const { usuario, password } = await request.json();
        
        // Aquí conectamos con la base de datos D1
        const stmt = env.DB.prepare("SELECT * FROM usuarios WHERE usuario = ? AND password = ?");
        const user = await stmt.bind(usuario, password).first();

        if (user) {
          return new Response(JSON.stringify({ status: "ok", nombre: user.nombre }), { 
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
