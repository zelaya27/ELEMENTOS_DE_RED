export default {
  async fetch(request, env) {
    // Permitir conexiones desde tu web
    if (request.method === "OPTIONS") {
        return new Response(null, { headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "*" } });
    }

    const { usuario, contrasena } = await request.json();

    // Consulta segura
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
  },
};
