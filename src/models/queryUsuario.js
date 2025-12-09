const queries = {
    eliminarUsuario: `
    DELETE FROM usuarios WHERE email = $1
    `,
    obtenerUsuario: `
    SELECT * FROM usuarios WHERE id_usuario = $1
    `,
    actualizarUsuario: `
    UPDATE usuarios
    SET nombre_usuario = $1, email = $2, role_usuario = $3, contrasena = $4
    WHERE id_usuario = $5
    `,
    todosLosUserMenosYo:`
    SELECT *
    FROM usuarios
    WHERE id_usuario <> $1;
    `
};

module.exports = queries;

