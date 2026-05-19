export default {
  async fetch(request, env) {
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });

    try {
      const { usuario, contrasena } = await request.json();
      const { results } = await env.DB.prepare(
        "SELECT * FROM bd_usuarios WHERE usuario = ? AND contrasena = ?"
      ).bind(usuario, contrasena).all();

      if (results.length > 0) {
        return new Response(JSON.stringify({ success: true }), { headers: { ...cors, "Content-Type": "application/json" } });
      }
      return new Response(JSON.stringify({ success: false, error: "Credenciales inválidas" }), { headers: { ...cors, "Content-Type": "application/json" } });
    } catch (e) {
      return new Response(JSON.stringify({ success: false, error: e.message }), { status: 500, headers: { ...cors, "Content-Type": "application/json" } });
    }
  }
};
