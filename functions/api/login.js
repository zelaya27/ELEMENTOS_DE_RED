export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const { usuario, password } = await request.json();
    
    // Consulta a la D1 (usa el binding DB que está en el wrangler.toml)
    // IMPORTANTE: Tu tabla debe llamarse 'bd_usuarios'
    const stmt = env.DB.prepare("SELECT * FROM bd_usuarios WHERE usuario = ? AND password = ?");
    const user = await stmt.bind(usuario, password).first();

    if (user) {
      // Credenciales válidas
      return new Response(JSON.stringify({ status: "ok", mensaje: "Bienvenido" }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    } else {
      // Credenciales inválidas
      return new Response(JSON.stringify({ error: "Credenciales incorrectas" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
  } catch (e) {
    // Error en la base de datos o consulta
    return new Response(JSON.stringify({ error: e.message }), { 
      status: 500, 
      headers: { "Content-Type": "application/json" } 
    });
  }
}
