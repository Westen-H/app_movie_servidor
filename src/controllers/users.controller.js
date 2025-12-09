const express = require('express');
const bcrypt = require('bcryptjs');
const { JWTgenerador } = require('../helpers/jwt');
const { eliminarUsuarioModel, actualizarUsuarioModel, obtenerUsuarioModel, todosUserMenosYo } = require("../models/user.model");
const modeloFavorito = require('../models/favorito.model');
const { crearUsuario, buscarUsuarioPoremil} = require('../models/auth.model');


const crearusuario = async (req, res) => {
    const { nombre_usuario, email, role_usuario, contrasena } = req.body;
    try {
        const salt = bcrypt.genSaltSync();
        const contrasenaEncriptada = bcrypt.hashSync(contrasena, salt);

        //comprobar que el email no este registrado ya
        const existe = await buscarUsuarioPoremil(email);
        console.log(email)
        if(existe.length > 0){
            return res.status(401).json({
                ok: false,
                msg: "Este correo ya esta registrado."
            });
        }

        const values = {
            nombre_usuario,
            role_usuario,
            email,
            contrasena: contrasenaEncriptada
        };
        
        const data = await crearUsuario(values);

        const payload = {
            uid: data.id_usuario,
            nombre_usuario: data.nombre_usuario,
            role_usuario: data.role_usuario
        };

        const token = await JWTgenerador(payload);

        return res.status(201).json({
            ok: true,
            msg: "Usuario creado correctamente.",
            usuario: data,
            token
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: "Error del servidor. Consulte su administrador."
        });
    }
};

const eliminarUsuario  = async (req, res) => {
   const {id_usuario, email} = req.body;
    try {
        const encontrado = await obtenerUsuarioModel(id_usuario);
        //console.log(encontrado);
        if (encontrado.length == 0) {
            return res.status(404).json({
                ok: false,
                msg: 'el usuario con ese id no existe'
            });
        }
        const buscadoEnfav = await modeloFavorito.buscarTodosFavidUser(id_usuario);
        console.log(buscadoEnfav);
        if(buscadoEnfav.length > 0){
            const eliminarUserFav = await modeloFavorito.eliminarFavoritoUsers(id_usuario);
        }
        await eliminarUsuarioModel(email)
        res.status(200).json({
            ok:true,
            msg: "Usuario eliminado"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok:false,
            msg: "Error al eliminar el usuario"
        });
    }
}

const obtenerUsuario = async (req, res) => {
    const { id } = req.params;
    
    try {
        const usuario = await obtenerUsuarioModel(id);

        if (usuario.length == 0) {
            return res.status(404).json({ 
                ok:false,
                msg: "Usuario no encontrado" 
            });
        }
        res.status(200).json(usuario);
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok:false,
            msg: "Error al obtener usuario" 
        });
    }
};
const todosUser = async (req, res) => {

    const { id } = req.params;
    try {
        const usuarios = await todosUserMenosYo(id);
        
        if (usuarios.length == 0) {
            return res.status(404).json({ 
                ok:false,
                msg: "No se encontraron los usuarios" 
            });
        }
        return res.status(200).json({ 
            ok:true,
            msg: "Estos son todos los usuarios",
            data: usuarios 
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok:false,
            msg: "Error al obtener usuario" 
        });
    }
};


//comprobar y correguir si hace falta
const editarUsuario = async (req, res) => {
    const { id } = req.params;
    const { nombre_usuario, email, role_usuario, contrasena } = req.body;
    
    try {
        const usuario = await obtenerUsuarioModel(id);
        if (usuario.length == 0) {
            return res.status(404).json({ 
                ok:false,
                msg: "Usuario no encontrado" 
            });
        }
        const salt = bcrypt.genSaltSync();
        const contrasenaEncriptada = bcrypt.hashSync(contrasena, salt);
        const datos = { nombre_usuario, email, role_usuario, contrasenaEncriptada };
        //console.log(datos);
        const actualizado = await actualizarUsuarioModel(id, datos);
        //console.log(actualizado);
        
        if (!actualizado) {
            return res.status(404).json({ 
                ok:false,
                msg: "Usuario no encontrado" 
            });
        }
        res.status(200).json({ 
            ok:true,
            msg: "Usuario actualizado" 
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok:false,
            msg: "Error al actualizar usuario" 
        });
    }
};


module.exports = {    
    eliminarUsuario,
    editarUsuario,
    obtenerUsuario,
    todosUser,
    crearusuario
};