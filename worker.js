export default {
  async fetch(request, env) {
    // Configuración para permitir que tu web hable con el worker
    if (request.method === "OPTIONS") {
        return new Response(null, { headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "*" } });
    }

    const { usuario, contrasena } = await request.json();

    // Consultamos la base de datos de forma segura
    // env.DB es el puente configurado en tu wrangler.toml
    try {
        const { results } = await env.DB.prepare(
          "SELECT * FROM bd_usuarios WHERE usuario = ? AND contrasena = ?"
        )
        .bind(usuario, contrasena)
        .all();

        if (results.length > 0) {
          return new Response(JSON.stringify({ success: true }), {
            headers: { "content-type": "application/json", "Access-Control-Allow-Origin": "*" }
          });
        } else {
          return new Response(JSON.stringify({ success: false }), { 
            status: 401,
            headers: { "content-type": "application/json", "Access-Control-Allow-Origin": "*" }
          });
        }
    } catch (error) {
        return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
    }
  },
};
