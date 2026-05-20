export async function onRequestPost(context) {
  const { request, env } = context;
  const { username, password } = await request.json();

  const user = await env.DB_USUARIOS.prepare(
    "SELECT * FROM usuarios WHERE username = ? AND password = ?"
  ).bind(username, password).first();

  if (user) {
    return new Response(JSON.stringify({ success: true, user: user }), { status: 200 });
  } else {
    return new Response(JSON.stringify({ success: false, message: "Credenciales incorrectas" }), { status: 401 });
  }
}
