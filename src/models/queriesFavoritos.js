const queriesFav = {
    createFav: `
    INSERT INTO favoritos(id_pelicula, id_usuario)
    VALUES($1,$2)
    RETURNING *
    `,
    eliminarFav: `
    DELETE FROM favoritos WHERE id_favorito = $1;
    `,
    todoLosFavUser:`
    SELECT 
    u.id_usuario,
    u.nombre_usuario,
    json_agg(
        json_build_object(
            'id_pelicula', p.id_pelicula,
            'tit_pelicula', p.tit_pelicula,
            'img_pelicula', p.img_pelicula,
            'ano_pelicula', p.ano_pelicula,
            'director', p.director,
            'genero', p.genero,
            'duracion', p.duracion
            )
        ) AS peliculas
    FROM favoritos AS f
    INNER JOIN peliculas AS p ON f.id_pelicula = p.id_pelicula
    INNER JOIN usuarios AS u ON f.id_usuario = u.id_usuario
    WHERE f.id_usuario = $1
    GROUP BY u.id_usuario, u.nombre_usuario;
    `,
    buscarExiste: `
    SELECT * 
    FROM favoritos 
    WHERE id_pelicula = $1 AND id_usuario = $2
    `,
    buscarExisteFavPeli: `
    SELECT * 
    FROM favoritos 
    WHERE id_pelicula = $1
    `,
    eliminarFavPelis: `
    DELETE FROM favoritos WHERE id_pelicula = $1
    `,
    buscarExisteFavUser: `
    SELECT * 
    FROM favoritos 
    WHERE id_usuario = $1
    `,
    eliminarFavUsers: `
    DELETE FROM favoritos WHERE id_usuario = $1
    `
}

module.exports = queriesFav;