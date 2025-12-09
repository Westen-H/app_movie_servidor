// Importar el modelo para poder intercatuar con la colección de peliculas
const modeloPelicula = require('../models/movie.model');
const modeloFavorito = require('../models/favorito.model');
const { deleteFile } = require('../helpers/files.helper')

//((================== Controladores para el recurso peliculas ==================))\\

// GET /api/v1/peliculas
// Devolver todas las peliculas que coincidan con la petición
const obtenerPeliculas = async (req, res) => {
    try {
        // Llamar al modelo para traer todas las películas
        const peliculas = await modeloPelicula.traerPeliculas();

        // Devolver un json con la lista de películas
        return res.status(200).json({
            ok: true,
            msg: 'Películas obtenidas correctamente',
            data: peliculas
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'Ocurrió un error al intentar obtener las películas',
        });
    }
};

// GET /api/v1/peliculas/:id
// Devolver la peliculas que coincidan con el 'id' de la petición
const obtenerPeliculaPorId = async (req, res) => {
    try {
        // Obtener el ID desde los parámetros de la URL
        const { id } = req.params;

        // Llamar al modelo para buscar la película
        const pelicula = await modeloPelicula.traerPeliculaPorId(id);

        // Verificar si existe la película existe
        if (pelicula.length === 0) {
            return res.status(404).json({
                ok: false,
                msg: 'No se encontraro la pelicula'
            });
        }

        return res.status(200).json({
            ok: true,
            msg: 'Película obtenida correctamente',
            data: pelicula
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'Ocurrió un error interno al intentar obtener la pelicula',
        });
    }
};

// GET /api/v1/peliculas/busqueda?titulo=algo
// Devolver la peliculas que coincidan con el 'titulo' de la petición o parte de el
const obtenerPeliculaPorTitulo = async (req, res) => {

    const titulo = (req.query.title || "").trim();

    console.log("🟡 BUSCANDO EN BACKEND -->", titulo);

    try {
        const peliculas = await modeloPelicula.traerPeliculaPorTitulo(titulo);

        console.log("🔵 RESULTADO SQL:", peliculas);
        if (peliculas.length === 0) {
            return res.status(404).json({
                ok: false,
                msg: 'No se encontró una película con ese título',
            });
        }

        return res.status(200).json({
            ok: true,
            msg: 'Películas obtenidas correctamente',
            data: peliculas
        });

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Ocurrió un error interno en la búsqueda',
            error
        });
    }
};
// POST /api/v1/peliculas
// Crear una nueva pelicula y guardarla
const crearNuevaPelicula = async (req, res) => {
    const { tit_pelicula } = req.body
    // Guardar el nombre del archivo subido(si lo hay), para posible rollback
    const nombreImgSubida = req.file?.filename

    try {
        // si viene un archivo con imagen, usar su filname como img_pelicula
        if (nombreImgSubida) {
            req.body.img_pelicula = nombreImgSubida;
        }

        const existe = await modeloPelicula.traerPeliculaPorTitulo(tit_pelicula);
        //console.log(existe)
        if (existe.length > 0) {
            return res.status(404).json({
                ok: false,
                msg: 'Esta pelicula ya existe',
            });
        }

        const idNuevaPelicula = await modeloPelicula.crearPelicula(req.body);

        return res.status(201).json({
            ok: true,
            msg: 'Película creada correctamente',
            id: idNuevaPelicula
        });

    } catch (error) {
        console.error(error);
        // Rollback si se subio la imagen pero fallo la base de datos
        if (nombreImgSubida) {
            try {
                await deleteFile(nombreImgSubida)
            } catch (errBorrando) {
                console.error(
                    `Error al intentar hacer rollback de la imagen (${nombreImgSubida}):`,
                    errBorrando
                );
            }
        }

        return res.status(500).json({
            ok: false,
            msg: 'Ocurrió un error interno al intentar crear la película',
        });
    }
}


// PUT /api/v1/editarPelicula/:id
// Actualizar una pelicula que coincidan con el 'id' de la petición
const actualizarPelicula = async (req, res) => {
    try {
        // Obtener el ID desde los parámetros de la URL
        const { id } = req.params;
        // Llamar al modelo para buscar la película
        const pelicula = await modeloPelicula.traerPeliculaPorId(id);
        console.log(pelicula);
        // Verificar si existe la película existe
        if (pelicula.length === 0) {
            return res.status(404).json({
                ok: false,
                msg: 'No se encontraron resultados'
            });
        }

        // Si se ha subido una nueva imagen, se usa ese nuevo filename
        if (req.file && req.file.filename) {
            req.body.img_pelicula = req.file.filename;
        }
        // Si no se sube una imagen nueva, no se toca img_pelicula, la query se usará con los campos que se manden..

        // Actualizar la película en la base de datos
        const peliculaActualizada = await modeloPelicula.editarPelicula(id, req.body);
        return res.status(200).json({
            ok: true,
            msg: 'Película actualizada correctamente',
            data: peliculaActualizada
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'Ocurrió un error interno al intentar editar la película',

        });
    }
}

// DELETE /api/v1/eliminarPelicula/:id
// Elimonar la pelicula que coincidan con el 'id' de la petición
const borrarPelicula = async (req, res) => {
    try {
        const { id } = req.params
        const pelicula = await modeloPelicula.traerPeliculaPorId(id);
        // Verificar si existe la película existe
        console.log(pelicula);
        if (pelicula.length === 0) {
            return res.status(404).json({
                ok: false,
                msg: 'La pelicula con ese id no existe'
            });
        }

        // Guardar nombre de la imagen (por si tiene)
        const nombreImagen = pelicula[0].img_pelicula;

        //ahora verificaremos si tiene alguna relacion en favoritos
        const buscadoEnfav = await modeloFavorito.buscarTodosFavidPeli(id);
        console.log(buscadoEnfav);

        //si existe las eliminamos
        if (buscadoEnfav.length > 0) {
            await modeloFavorito.eliminarFavoritoPelis(id);
        }

        await modeloPelicula.eliminarPelicula(id);

        // Eliminar la pelicula de la base de datos
        if (nombreImagen) {
            const resultadoArchivo = await deleteFile(nombreImagen);

            if (!resultadoArchivo.ok) {
                console.error(
                    `No se pudo eliminar la imagen asociada (${nombreImagen}):`,
                    resultadoArchivo.error
                );
                // No romper la respues, dejarlo logeado
            }
        };

        // respuesta final
        return res.status(200).json({
            ok: true,
            msg: 'Película borrada satisfactoriamente'
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: 'Ocurrió un error interno al intentar eliminar la película',
        });
    }
}

module.exports = {
    obtenerPeliculas,
    obtenerPeliculaPorId,
    obtenerPeliculaPorTitulo,
    crearNuevaPelicula,
    actualizarPelicula,
    borrarPelicula
};
