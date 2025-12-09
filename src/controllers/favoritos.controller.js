const Favorito = require('../models/favorito.model');

const crearFavorito = async (req, res) =>{
    const {id_pelicula, id_usuario} = req.body
    
    try {
        const encontrado = await Favorito.buscarExistencia(id_pelicula, id_usuario);
        
        if(encontrado.length <= 0){
            const newFavorito = await Favorito.crearFavorito(id_pelicula, id_usuario)
            return res.status(201).json({
                ok:true,
                msg: `El favorito fue creado correctamente`,
                data: newFavorito
            })
        }
        return res.status(409).json({
                ok:false,
                msg: `Ya esta agregado en favoritos`,
        })
        
    } catch (error) {
        return res.status(500).json({
            ok:false,
            msg: `No se pudo crear `,
            error: error.message
        })
    }
};

const buscarTodosFavUsuario = async (req, res) =>{
    const id_usuario = req.params.id
    try {
        const favoritos = await Favorito.todosFavoritosDeUser(id_usuario);
        //console.log(favoritos);
        if(favoritos.length == 0){
            return res.status(201).json({
                ok:true,
                msg: `Este usuario no tiene favoritos`
            })
        }
        return res.status(201).json({
            ok:true,
            msg: `Estos son todos los favoritos`,
            data: favoritos
        })
    } catch (error) {
        return res.status(500).json({
            ok:false,
            msg: `No se pudo encontrar nada `,
            error: error.message
        })
    }
};

const eliminarFavorito = async (req, res) =>{
    const { id_favorito, id_pelicula, id_usuario } = req.body

    try {
        const encontrado = await Favorito.buscarExistencia(id_pelicula, id_usuario);        
        if(encontrado.length > 0){
            const result = await Favorito.eliminarFavorito(id_favorito)
            return res.status(201).json({
                ok:true,
                msg: `Favorito eliminado correctamente`,
                resp: result

            })
        }
        return res.status(409).json({
                ok:false,
                msg: `El favorito no existe`,
        })
    } catch (error) {
        return res.status(500).json({
            ok:false,
            msg: `No se puedo eliminar `,
            error: error.message
        })
    }
};

const toggleFavorito = async (req, res) => {
    try {
        // Validar token del middleware
        if (!req.userToken || !req.userToken.uid) {
            return res.status(401).json({
                ok: false,
                msg: "Token no válido o usuario no autorizado"
            });
        }

        const id_usuario = req.userToken.uid;
        const { id_pelicula } = req.body;

        // Validación
        if (!id_pelicula) {
            return res.status(400).json({
                ok: false,
                msg: "Falta id_pelicula en la petición."
            });
        }

        // Buscar existencias
        const encontrado = await Favorito.buscarExistencia(id_pelicula, id_usuario);

        // Si no existe → crearlo
        if (encontrado.length === 0) {
            const nuevo = await Favorito.crearFavorito(id_pelicula, id_usuario);

            return res.status(201).json({
                ok: true,
                accion: "creado",
                msg: "Favorito añadido",
                data: nuevo
            });
        }

        // Si existe → eliminarlo
        const favorito = encontrado[0];
        await Favorito.eliminarFavorito(favorito.id_favorito);

        return res.status(200).json({
            ok: true,
            accion: "eliminado",
            msg: "Favorito eliminado"
        });

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: "Error en toggle favorito",
            error: error.message
        });
    }
};



module.exports = {
    crearFavorito,
    buscarTodosFavUsuario,
    eliminarFavorito,
    toggleFavorito
}