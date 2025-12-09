// Importar libreria
const multer = require('multer');

// Configurar almacenamiento
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        // crear el nombre con la fecha y el nombre original
        const name = Date.now() + '_' + file.originalname;
        cb(null, name);
    }, 
})

const upload = multer({ storage })

// Middleware para manejar errores de multer
const handleMulterErrors = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ 
                ok: false,
                msg: 'Archivo demasiado grande' 
            })
        }

        return res.status(400).json({
            ok: false,
            msg: err.message
        })

    } else if (err) {
        return res.status(400).json({
            ok: false,
            msg: err.message
        })
    };
    next();
};

module.exports = { 
    upload,
    handleMulterErrors
};