// Archivo: functions/api/login.js
export async function onRequestPost(context) {
    const { request, env } = context;
    const { usuario, contrasena } = await request.json();

    try {
        const { results } = await env.DB.prepare(
            "SELECT * FROM bd_usuarios WHERE usuario = ? AND contrasena = ?"
        ).bind(usuario, contrasena).all();

        if (results.length > 0) {
            return new Response(JSON.stringify({ success: true }), { 
                headers: { "Content-Type": "application/json" } 
            });
        }
        return new Response(JSON.stringify({ success: false, error: "Datos incorrectos" }), { 
            status: 401, headers: { "Content-Type": "application/json" } 
        });
    } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
}
