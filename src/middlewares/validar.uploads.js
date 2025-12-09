const fs = require("fs");
const path = require("path");

// Constantes globales
const MAX_SIZE = 35 * 1024 * 1024; // 35 MB
// // Extensiones permitidas
const PERMITIDOS = ['image/png', 'image/jpeg'];

// Validar tipo de archivo o tamaño
const validateFiles = (req, res, next) => {
    // Verificar si hay archivos
    const files = req.file ? [req.file] : req.files || [];
    if (files.length === 0) {
        return next();
    }

    for (const file of files) {
        if (!PERMITIDOS.includes(file.mimetype)) {
            return res.status(400).json({
                ok: false,
                msg: 'Tipo de archivo no permitido'
            });
        }
    
        if (file.size > MAX_SIZE) {
            return res.status(400).json({
                ok: false,
                msg: `Archivo demasiado grande. Máximo permitido: ${MAX_SIZE / (1024 * 1024)} MB`
            });
        }
    }
    next()
};

module.exports = { validateFiles };