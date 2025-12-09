const connect = require('../configs/dbConnect');
const queriesAuth = require('./queriesAuth');

const crearUsuario = async ({ nombre_usuario, role_usuario, email, contrasena }) => {
    let client, result;
    try {
        client = await connect();
        result = await client.query(queriesAuth.registro, [nombre_usuario, role_usuario, email, contrasena]);
        return result.rows[0];
    } catch (error) {
        console.log(error);
        throw error;
    } finally {
        client.release();
    }
};

const buscarUsuario = async (email) => {
    let client, result;
    try {
        client = await connect();
        result = await client.query(queriesAuth.login, [email]);
        return result.rows[0];
    } catch (error) {
        console.log(error);
        throw error;
    } finally {
        client.release();
    }
};

const buscarUsuarioPorId = async (id_usuario) => {
    let client, result;
    try {
        client = await connect();
        result = await client.query(queriesAuth.renovarToken, [id_usuario]);
        return result.rows[0];
    } catch (error) {
        console.log(error);
        throw error;
    } finally {
        client.release();
    }
};
const buscarUsuarioPoremil = async (email) => {
    let client, result;
    try {
        client = await connect();
        result = await client.query(queriesAuth.comprobarEmail, [email]);
        return result.rows;
    } catch (error) {
        console.log(error);
        throw error;
    } finally {
        client.release();
    }
};


module.exports = { crearUsuario, buscarUsuario, buscarUsuarioPorId, buscarUsuarioPoremil }