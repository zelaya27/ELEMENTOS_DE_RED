export async function onRequestPost(context) {
  try {
    const { usuario, contrasena } = await context.request.json();
    
    // Consulta la base de datos D1
    const stmt = context.env.DB.prepare(
      "SELECT * FROM bd_usuarios WHERE usuario = ? AND contrasena = ?"
    );
    const user = await stmt.bind(usuario, contrasena).first();

    if (user) {
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      return new Response(JSON.stringify({ success: false }), { status: 401 });
    }
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
