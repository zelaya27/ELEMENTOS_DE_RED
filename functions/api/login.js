export async function onRequestPost(context) {
  try {
    // Recibimos los datos del formulario (index.html)
    const { usuario, password } = await context.request.json();
    
    // Consulta SQL a tu base de datos D1 (binding "DB")
    // Usamos ? como comodines para evitar ataques de inyección SQL
    const stmt = context.env.DB.prepare(
      "SELECT * FROM usuarios WHERE usuario = ? AND contraseña = ?"
    );
    
    // Ejecutamos la consulta
    const user = await stmt.bind(usuario, password).first();

    if (user) {
      // Login exitoso
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      // Login fallido
      return new Response(JSON.stringify({ success: false, message: "Usuario o contraseña incorrectos" }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
