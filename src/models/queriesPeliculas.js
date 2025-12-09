// Crear query para peliculas
const queriesPeliculas = {

    pedirPeliculas: `
        SELECT * 
        FROM peliculas
    `,

    pedirPeliculaPorId: `
        SELECT * 
        FROM peliculas 
        WHERE id_pelicula = $1
    `,

    pedirPeliculaPorTitulo: `
        SELECT *
        FROM peliculas
        WHERE tit_pelicula ILIKE '%' || $1 || '%';
    `,// el ILIKE HACE QUE PUEDES BUSCAR EN MAYUSCULAS Y MINUSCULAS

    creandoPelicula: `
        INSERT INTO peliculas (tit_pelicula, img_pelicula, ano_pelicula, director, genero, duracion) 
        VALUES ($1, $2, $3, $4, $5, $6) 
        RETURNING id_pelicula
    `,
    editandoPelicula: `
        UPDATE peliculas SET tit_pelicula = $1, img_pelicula = $2, ano_pelicula = $3,
            director = $4, genero = $5, duracion = $6 
        WHERE id_pelicula = $7 
        RETURNING *
    `,

    verificarPelicula: `
        SELECT * FROM peliculas WHERE id_pelicula = $1
    `,


    eliminandoPelicula: `
        DELETE FROM peliculas WHERE id_pelicula = $1
    `
}

module.exports = queriesPeliculas;

