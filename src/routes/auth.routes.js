const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { registarUsuario, loginUsuario, renovarToken } = require('../controllers/auth.controller');
const { validarInput } = require('../middlewares/validarInput');
const { verificarJWT } = require('../middlewares/validarJWT');

//Registar un usuario:
router.post('/auth/signup', [
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
    validarInput], registarUsuario);

//Login de usuario:
router.post('/auth/login', [
    check("email")
        .trim()
        .normalizeEmail()
        .isEmail().withMessage("Escriba un correo electrónico válido.").bail()
        .isLength({ min: 5, max: 50 }).withMessage("Escriba un email válido válido"),
    check("contrasena", "La contraseña debe tener entre 6 y 10 caracteres, contener por lo menos una minúscula, una mayúscula, un número y un símbolo.")
        .isStrongPassword({ minLength: 6 }).bail(),
    validarInput
], loginUsuario);

//Validar y renovar token:
router.get('/auth/renovar', verificarJWT, renovarToken);

module.exports = router;