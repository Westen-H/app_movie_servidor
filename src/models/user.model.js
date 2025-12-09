const connect = require('../configs/dbConnect');
const queries = require("../models/queryUsuario");

const eliminarUsuarioModel =  async (email) =>{
    let cliente, result;
    try{
        cliente = await connect();
        //console.log(cliente, "desde cliente modelo")
        result = await cliente.query(queries.eliminarUsuario,[email])
        //console.log(result, "desde result modelo")
        return result.rows;

    }catch (error) {
        console.log(error)
        throw error
    }finally{
        cliente.release();
    }
} 

const obtenerUsuarioModel = async (id_usuario) => {
    let cliente, result;
    try {
        cliente = await connect();
        //console.log(cliente, "desde cliente modelo obtener")
        result = await cliente.query(queries.obtenerUsuario, [id_usuario]);
        //console.log(result, "desde result modelo obtener")
        return result.rows;
    } catch (error) {
        console.log(error)
        throw error;
    } finally {
        cliente.release();
    }
};
const todosUserMenosYo = async (id_usuario) => {
    let cliente, result;
    try {
        cliente = await connect();
        //console.log(cliente, "desde cliente modelo obtener")
        result = await cliente.query(queries.todosLosUserMenosYo, [id_usuario]);
        //console.log(result, "desde result modelo obtener")
        return result.rows;
    } catch (error) {
        console.log(error)
        throw error;
    } finally {
        cliente.release();
    }
};

//comprobar y corregir si hace falta
// Actualizar usuario por id
const actualizarUsuarioModel = async (id_usuario, { nombre_usuario, email, role_usuario, contrasenaEncriptada }) => {
    let cliente, result;
    try {
        cliente = await connect();
        //console.log(cliente, "desde cliente modelo actualizar")
        result = await cliente.query(queries.actualizarUsuario,[nombre_usuario, email, role_usuario, contrasenaEncriptada, id_usuario]);
        //console.log(result, "desde result modelo actualizar")
        return result.rows;
    } catch (error) {
        throw error;
    } finally {
        cliente.release();
    }
};

module.exports = {
    eliminarUsuarioModel,
    obtenerUsuarioModel,
    actualizarUsuarioModel,
    todosUserMenosYo   
}
