const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { validarInput } = require('../middlewares/validarInput');
const { authUsuario, authAdmin } = require('../middlewares/rolAuth');
const { verificarJWT } = require('../middlewares/validarJWT');
const { eliminarUsuario, editarUsuario, obtenerUsuario, todosUser, crearusuario } = require('../controllers/users.controller'); 

router.post('/usuario/crear',[
    check('nombre_usuario')
        .notEmpty().withMessage("Escriba el nombre").bail()
        .trim()
        .isString().withMessage("Escriba un nómbre válido")
        .isLength({ min: 3, max: 50 }).withMessage("Escriba un nómbre válido"),
    check("email")
        .trim()
        .normalizeEmail()
        .isEmail().withMessage("Escriba un correo electrónico válido.").bail()
        .isLength({ min: 5, max: 50 }).withMessage("Escriba un email válido válido"),
    check("contrasena", "La contraseña debe tener entre 6 y 10 caracteres, contener por lo menos una minúscula, una mayúscula, un número y un símbolo.")
        .isStrongPassword({ minLength: 6 }).bail(),
    validarInput
    ,verificarJWT
    ,authAdmin
],crearusuario);

router.delete('/usuario/eliminar',[
    check('id_usuario')
        .notEmpty().withMessage('Se necesita el Id de usuario')
        .bail()
        .trim()
        .isInt().withMessage('El id de usuario tiene que ser un numero entero')
        .bail()
    ,check('email')
        .notEmpty().withMessage('Se necesita el Id de usuario')
        .bail()
        .trim()
        .isEmail().withMessage('El email tien que tener este formato email@emial.email')
        .bail()
    , verificarJWT
    ,authAdmin
], eliminarUsuario);

router.put('/usuario/editar/:id',[
    check('nombre_usuario')
        .notEmpty().withMessage("Escriba el nombre").bail()
        .trim()
        .isString().withMessage("Escriba un nómbre válido")
        .isLength({ min: 3, max: 50 }).withMessage("Escriba un nómbre válido"),
    check("email")
        .trim()
        .normalizeEmail()
        .isEmail().withMessage("Escriba un correo electrónico válido.").bail()
        .isLength({ min: 5, max: 50 }).withMessage("Escriba un email válido válido"),
    check("contrasena", "La contraseña debe tener entre 6 y 10 caracteres, contener por lo menos una minúscula, una mayúscula, un número y un símbolo.")
        .isStrongPassword({ minLength: 6 }).bail(),
    validarInput
    ,verificarJWT
    ,authAdmin
], editarUsuario);


router.get('/usuario/obtener/:id',[
    check('id')
        .notEmpty().withMessage('Se necesita el Id de usuario')
        .bail()
        .trim()
        .isInt().withMessage('El id de usuario tiene que ser un numero entero')
        .bail()
    ,verificarJWT
], obtenerUsuario);
router.get('/usuario/todos/:id',[
    check('id')
        .notEmpty().withMessage('Se necesita el Id de usuario')
        .bail()
        .trim()
        .isInt().withMessage('El id de usuario tiene que ser un numero entero')
        .bail()
    ,verificarJWT
    ,authAdmin
], todosUser);



module.exports = router; 
