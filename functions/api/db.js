export async function onRequestPost(context) {
  const { request, env } = context;
  const { table, query, params } = await request.json();

  // Mapeo de bindings para seguridad
  const databases = {
    'usuarios': env.DB_USUARIOS,
    'tbl_postes': env.DB_POSTES,
    'main_postes': env.DB_MAIN,
    'circuitos': env.DB_CIRCUITOS
  };

  const db = databases[table];
  if (!db) return new Response("Tabla no encontrada", { status: 400 });

  try {
    const result = await db.prepare(query).bind(...(params || [])).all();
    return new Response(JSON.stringify(result.results), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
