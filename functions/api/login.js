export async function onRequestPost(context) {
    try {
        const { usuario, password } = await context.request.json();
        
        // Conexión a D1 usando el binding 'DB'
        const stmt = context.env.DB.prepare(
            "SELECT * FROM usuarios WHERE usuario = ? AND password = ?"
        );
        
        const user = await stmt.bind(usuario, password).first();

        if (user) {
            return new Response(JSON.stringify({ 
                status: "success", 
                nombre: user.nombre, 
                sector: user.sector 
            }), { status: 200, headers: { 'Content-Type': 'application/json' }});
        } else {
            return new Response(JSON.stringify({ error: "Usuario o contraseña incorrectos" }), { 
                status: 401, headers: { 'Content-Type': 'application/json' } 
            });
        }
    } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
}
