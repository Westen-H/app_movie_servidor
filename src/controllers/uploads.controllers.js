// Importaciones
const fs = require('fs');
const path = require('path');
const connect = require('../configs/dbConnect')
const queriesUploads = require('../models/queries.uploads')
const { deleteFile } = require('../helpers/files.helper');


// Definir la función que manejara multer, del lado del servidor

// Subir archivo (uploadFile)
const uploadFile = async (req,  res) => {
    try {
        // Verificar si no existe el archivo
        if (!req.file) {
            return res.status(400).json({
                ok: false,
                msg: 'Archivo no encontrado'
            });
        }

        // Recoger datos adicionales del formulario
        const { filename, originalname, mimetype, size } = req.file;
        const { nombre, descripcion } = req.body; // datos extra del formulario

        // Obtener el cliente conectado
        const cliente = await connect();

        // ejecutar la query
        const result = await cliente.query(
             queriesUploads.crearUpload, [ filename, originalname, mimetype, size, nombre || null, descripcion || null]
        );

        // Devolver la respuesta 
        res.status(200).json({
            ok: true,
            msg: 'Archivo subido correctamente y guardado en la base de datos',
            file: req.file, // Información del archivo que multer guardará
            uploadId: result.rows[0].id // "id" del primer registro obtenido de la base de datos
        });

    } catch (error) {
        console.error(error)
        res.status(500).json({
            ok: false,
            msg: 'Ocurrió un error al subir el archivo'
        });
    } finally {
        if (cliente) cliente.release(); // siempre liberar
    }
};

// Subir múltiples archivos (uploadFiles)
const uploadFiles = async (req, res) => {
    try {
        let cliente;

        // Validar que se envíen archivos
        if (!req.files || req.files.length === 0) {
            // si no hay arvivo status(400)
            return res.status(400).json({
                ok: false,
                msg: 'No se encontraron archivos'
            });
        }

        cliente = await connect();

        const resultados = []
            // Recorrer los archivos y guardarlos en la "base de datos"
            for (const file of req.files) {
            // Recoger datos adicionales del formulario
            const { filename, originalname, mimetype, size } = file;
            const { nombre, descripcion } = req.body; // datos extra del formulario


            // Insertar en la "base de datos"
            const resultado = await cliente.query(
                queriesUploads.crearUpload, [ filename, originalname, mimetype, size, nombre || null, descripcion || null]
            ); 
            // agregar
            resultados.push({
                uploadId: resultado.rows[0].id,  // ID del primer registro de la base de datos
                file // objeto con la información del archivo subido (filename, mimetype, size, etc.)
            }) ;         
        };

        // Si el archivo existe 
        res.status(200).json({
            ok: true,
            msg: 'Archivos subidos correctamente y guardados en la base de datos',
            files: resultados
        });

    } catch (error) {
        // Si ocurre un error inesperado, mostrar en consola
        console.error(error)
        res.status(500).json({
            ok: false,
            msg: 'Ocurrio un error al subir los archivos'
        });
    } finally {
        if (cliente) cliente.release(); // siempre liberar
    }
};

// Listar archivos subidos (getFiles)
const getFiles = async (req, res) => {
    try {
        // Carpeta donde se guardan los archivos ya subidos
        const carpeta = path.join(__dirname, '../uploads');
        const files = await fs.promises.readdir(carpeta);
        
        // Comprobar si hay archivos
        if (files.length === 0) {
            return res.status(200).json({
                ok: true,
                msg: 'No hay archivos subidos',
                files: []
            });
        }

        // Devolver estado ok
        res.status(200).json({
            ok: true,
            files,
            total: files.length
        });

    } catch (error) {
        console.error('Error leyendo la carpeta:', error);
        res.status(500).json({
            ok: false,
            msg: 'Error al leer la carpeta'
        });
    }
};


// Eliminar un archivo (deletefile) (usa fs.promises.unlink internamente) por lo que es "async"
const deletfileControler = async (req, res) => {    
    try {
        // Recoger el nombre
        const { filename } = req.params;
        const result = await deleteFile(filename)

        // comprobar si no hay resultado
        if (!result.ok) {
            return res.status(500).json({
                ok: false,
                msg: 'No se pudo eliminar el archivo',
                error: result.error?.message
            });
        }
        return res.status(200).json({
        ok: true,
        msg: 'Archivo eliminado correctamente'
    });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            ok: false,
            msg: 'Ocurrió un error inesperado'
        });
    }
};

module.exports = {
    uploadFile,
    uploadFiles,
    getFiles,
    deletfileControler
}