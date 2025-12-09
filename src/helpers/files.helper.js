// importaciones
const fs = require("fs");
const path = require("path");

// Eliminar un archivo (deletefile)
const deleteFile = async (filename) => {    
    try {
        // Construir ruta completa del archivo a eliminar con path.json
        const filePath = path.join(__dirname, '../uploads', filename);

        // Elimina el archivo de manera asíncrona usando fs.promises.unlink
        await fs.promises.unlink(filePath);

        // Mostrar confirmación
        console.log(`${filename} eliminado correctamente`);

        // Indicar que se ha eliminado
        return { ok: true };

    } catch (error) {
        console.error(`Error al eliminar ${filename}:`, error);
        return { ok: false, error };
    }
};

module.exports = { deleteFile };