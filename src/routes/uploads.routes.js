// Importaciones: router de express, middleware (personal), controlador

const { Router } = require('express');
const { upload, handleMulterErrors } = require('../middlewares/multer.middleware');
const { validateFiles } = require('../middlewares/validar.uploads');
const { 
    uploadFile, 
    uploadFiles,   
    getFiles,
    deletfileControler 
} = require('../controllers/uploads.controllers'); 


// definir router para definir rutas separadas
const router = Router();

// definir ruta POST /upload
// Subir un solo archivo
router.post('/upload', upload.single('imagen'), handleMulterErrors, validateFiles, uploadFile);

// Subir múltiples archivos
router.post('/uploads', upload.array('imagenes', 10), validateFiles, uploadFiles);

// Listar archivos subidos
router.get('/uploads', getFiles);

// Eliminar un archivo por filename (param en la URL)
router.delete('/uploads/:filename', deletfileControler);

module.exports = router;