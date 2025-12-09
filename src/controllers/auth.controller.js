const bcrypt = require('bcryptjs');
const { JWTgenerador } = require('../helpers/jwt');
const { crearUsuario, buscarUsuario, buscarUsuarioPorId, buscarUsuarioPoremil } = require('../models/auth.model');

const registarUsuario = async (req, res) => {
    const { nombre_usuario, email, contrasena } = req.body;
    try {
        const salt = bcrypt.genSaltSync();
        const contrasenaEncriptada = bcrypt.hashSync(contrasena, salt);

        const values = {
            nombre_usuario,
            role_usuario: 'user',
            email,
            contrasena: contrasenaEncriptada
        };
        //comprobar que el email no este registrado ya
        const existe = await buscarUsuarioPoremil(email);
        console.log(email)
        if(existe.length > 0){
            return res.status(401).json({
                ok: false,
                msg: "Este correo ya esta registrado."
            });
        }

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

const loginUsuario = async (req, res) => {
    try {
        const { email, contrasena } = req.body;
        const usuario = await buscarUsuario(email);
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: "No hay usuario con este email."
            });

        };
        const passwordOk = await bcrypt.compare(contrasena, usuario.contrasena);
        if (!passwordOk) {
            return res.status(401).json({
                ok: false,
                msg: "La contraseña no es válida."
            })
        }

        const payload = {
            uid: usuario.id_usuario,
            nombre_usuario: usuario.nombre_usuario,
            role_usuario: usuario.role_usuario
        }

        const token = await JWTgenerador(payload);

        const user = {
            uid: usuario.id_usuario,
            nombre_usuario: usuario.nombre_usuario,
            email: email
        }
        return res.status(200).json({
            ok: true,
            msg: "Login de usuario.",
            user: user,
            token: token
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: "Error del servidor. Consulte su administrador."
        });
    };
};

const renovarToken = async (req, res) => {
    try {
        const { uid, nombre_usuario, role_usuario } = req.userToken;
        console.log(req.userToken)
        const payload = {
            uid,
            nombre_usuario,
            role_usuario
        }

        const token = await JWTgenerador(payload);
        const usuario = await buscarUsuarioPorId(uid);

        return res.status(200).json({
            ok: true,
            msg: 'El token está renovado.',
            user: {
                uid: usuario.id_usuario,
                nombre_usuario: usuario.nombre_usuario,
                role_usuario: usuario.role_usuario
            },
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

module.exports = {
    registarUsuario,
    loginUsuario,
    renovarToken
};