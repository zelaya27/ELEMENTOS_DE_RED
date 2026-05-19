export async function onRequestPost(context) {
    const { request, env } = context;
    const { usuario, contrasena } = await request.json();

    const { results } = await env.DB.prepare(
        "SELECT * FROM bd_usuarios WHERE usuario = ? AND contrasena = ?"
    )
    .bind(usuario, contrasena)
    .all();

    if (results && results.length > 0) {
        return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
    } else {
        return new Response(JSON.stringify({ success: false, error: "Datos incorrectos" }), { headers: { "Content-Type": "application/json" } });
    }
}
