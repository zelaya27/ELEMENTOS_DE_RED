// functions/api/login.js

export async function onRequestPost(context) {
  const { request, env } = context;

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { usuario, password } = await request.json();
    
    // Consulta a tu base de datos D1
    const stmt = env.DB.prepare("SELECT * FROM bd_usuarios WHERE usuario = ? AND password = ?");
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
    return new Response(JSON.stringify({ error: e.message }), { 
      status: 500, 
      headers: { ...corsHeaders, "Content-Type": "application/json" } 
    });
  }
}
