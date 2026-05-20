export async function onRequestPost(context) {
  const { request, env } = context;

  // Encabezados para permitir la comunicación con el frontend
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
    
    // CORRECCIÓN: La tabla se llama 'usuarios'
    // Estamos buscando exactamente en las columnas 'usuario' y 'password'
    const stmt = env.DB.prepare("SELECT * FROM usuarios WHERE usuario = ? AND password = ?");
    const user = await stmt.bind(usuario, password).first();

    if (user) {
      // Credenciales correctas
      return new Response(JSON.stringify({ status: "ok", mensaje: "Bienvenido" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    } else {
      // Credenciales incorrectas
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
