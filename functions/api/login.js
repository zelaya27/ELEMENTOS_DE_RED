export async function onRequest(context) {
  const { request, env } = context;

  // 1. Manejo de CORS (Permitir peticiones desde tu web)
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*", // O cambia * por tu dominio específico
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  // Si es un pre-flight (OPTIONS), responde inmediatamente
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // 2. Solo permitir POST para login
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405, headers: corsHeaders });
  }

  try {
    const { usuario, password } = await request.json();
    
    // Consulta a la D1
    const stmt = env.DB.prepare("SELECT * FROM bd_usuarios WHERE usuario = ? AND password = ?");
    const user = await stmt.bind(usuario, password).first();

    if (user) {
      return new Response(JSON.stringify({ status: "ok", mensaje: "Bienvenido" }), {
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
    return new Response(JSON.stringify({ error: e.message }), { 
      status: 500, 
      headers: { ...corsHeaders, "Content-Type": "application/json" } 
    });
  }
}
