export default {
  async fetch(request, env) {
    // ESTA PARTE ES CRÍTICA PARA EL ERROR DE CONEXIÓN
    if (request.method === "OPTIONS") {
        return new Response(null, { headers: { 
            "Access-Control-Allow-Origin": "*", 
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "*"
        }});
    }
    // ... resto de tu código

    if (request.method !== "POST") return new Response("Solo POST", { status: 405 });

    const { usuario, contrasena } = await request.json();

    // 2. Consulta a la base de datos
    const { results } = await env.DB.prepare(
      "SELECT * FROM bd_usuarios WHERE usuario = ? AND contrasena = ?"
    )
    .bind(usuario, contrasena)
    .all();

    // 3. Respuesta con encabezados de seguridad
    const headers = { 
        "content-type": "application/json", 
        "Access-Control-Allow-Origin": "*" 
    };

    if (results.length > 0) {
      return new Response(JSON.stringify({ success: true }), { headers });
    } else {
      return new Response(JSON.stringify({ success: false }), { status: 401, headers });
    }
  },
};
