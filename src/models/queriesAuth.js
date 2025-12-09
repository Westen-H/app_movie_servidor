const queriesAuth = {
    registro: `INSERT INTO usuarios (nombre_usuario, role_usuario, email, contrasena) VALUES ($1, $2, $3, $4) RETURNING *`,
    login: `SELECT * FROM usuarios WHERE email = $1`,
    renovarToken: `SELECT id_usuario, nombre_usuario, role_usuario FROM usuarios WHERE id_usuario = $1`,
    comprobarEmail:`
    SELECT * FROM usuarios WHERE email = $1
    `
}

module.exports = queriesAuth;
