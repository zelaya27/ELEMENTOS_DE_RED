export async function onRequestPost(context) {
  try {
    const { usuario, contraseña } = await context.request.json();
    
    // Consulta la base de datos D1
    const stmt = context.env.DB.prepare(
      "SELECT * FROM usuarios WHERE usuario = ? AND contraseña = ?"
    );
    const user = await stmt.bind(usuario, contraseña).first();

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
