export default {
  async fetch(request, env) {
    // Configuración para permitir conexiones desde tu web (CORS)
    if (request.method === "OPTIONS") {
        return new Response(null, { headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST" } });
    }

    const datos = await request.json();
    const { usuario, contrasena } = datos;

    // Consultamos la base de datos de forma segura
    const { results } = await env.DB.prepare(
      "SELECT * FROM bd_usuarios WHERE usuario = ? AND contrasena = ?"
    )
    .bind(usuario, contrasena)
    .all();

    if (results.length > 0) {
      return new Response(JSON.stringify({ success: true, tipo: results[0].tipo_usuario }), {
        headers: { "content-type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    } else {
      return new Response(JSON.stringify({ success: false }), { 
        status: 401,
        headers: { "content-type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }
  },
// Dentro de tu worker.js
console.log("Intentando loguear con:", usuario, contrasena);
const { results } = await env.DB.prepare(
  "SELECT * FROM bd_usuarios WHERE usuario = ? AND contrasena = ?"
).bind(usuario, contrasena).all();
console.log("Resultados de la BD:", results); // <--- ESTO ES LA CLAVE
};
