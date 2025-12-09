DROP TABLE favoritos;
DROP TABLE usuarios;
DROP TABLE peliculas;

CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nombre_usuario VARCHAR(50) NOT NULL,
    role_usuario VARCHAR(20) DEFAULT('user') NOT NULL ,
    email VARCHAR(100) UNIQUE NOT NULL,
    contrasena VARCHAR(100) NOT NULL,
    CONSTRAINT ck_role_usuario CHECK (role_usuario IN ('user', 'administrador'))
);

CREATE TABLE peliculas (
    id_pelicula SERIAL PRIMARY KEY,
    tit_pelicula VARCHAR(50) UNIQUE NOT NULL,
    img_pelicula VARCHAR(255)NOT NULL,
    ano_pelicula INT NOT NULL,
    director VARCHAR(50) NOT NULL,
    genero VARCHAR(50) NOT NULL,
    duracion VARCHAR(10) NOT NULL
);


CREATE TABLE favoritos (
    id_favorito SERIAL PRIMARY KEY,
    id_pelicula INT NOT NULL,
    id_usuario INT NOT NULL,
    CONSTRAINT fk_peliculas FOREIGN KEY (id_pelicula) REFERENCES peliculas (id_pelicula),
    CONSTRAINT fk_usuarios FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario)
);

-- TABLA DE UPLOADS
CREATE TABLE uploads (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    originalname VARCHAR(255) NOT NULL,
    mimetype VARCHAR(100) NOT NULL,
    size BIGINT NOT NULL,
    nombre VARCHAR(100),        -- título o nombre asignado al archivo
    descripcion TEXT,           -- descripción opcional
    uploaded_at TIMESTAMP DEFAULT NOW()
);


INSERT INTO peliculas (tit_pelicula, img_pelicula, ano_pelicula, director, genero, duracion)
VALUES
('The Shawshank Redemption', 'shawshank.jpg', 1994, 'Frank Darabont', 'Drama', '142'),
('The Godfather', 'godfather.jpg', 1972, 'Francis Ford Coppola', 'Crimen', '175'),
('The Dark Knight', 'dark_knight.jpg', 2008, 'Christopher Nolan', 'Acción', '152'),
('Pulp Fiction', 'pulp_fiction.jpg', 1994, 'Quentin Tarantino', 'Crimen', '154'),
('Fight Club', 'fight_club.jpg', 1999, 'David Fincher', 'Drama', '139'),
('Forrest Gump', 'forrest_gump.jpg', 1994, 'Robert Zemeckis', 'Drama', '142'),
('Inception', 'inception.jpg', 2010, 'Christopher Nolan', 'Ciencia Ficción', '148'),
('The Matrix', 'matrix.jpg', 1999, 'Lana y Lilly Wachowski', 'Ciencia Ficción', '136'),
('Interstellar', 'interstellar.jpg', 2014, 'Christopher Nolan', 'Ciencia Ficción', '169'),
('Gladiator', 'gladiator.jpg', 2000, 'Ridley Scott', 'Acción', '155'),
('Titanic', 'titanic.jpg', 1997, 'James Cameron', 'Romance', '195'),
('The Avengers', 'avengers.jpg', 2012, 'Joss Whedon', 'Acción', '143'),
('Avatar', 'avatar.jpg', 2009, 'James Cameron', 'Ciencia Ficción', '162'),
('The Lion King', 'lion_king.jpg', 1994, 'Roger Allers', 'Animación', '88'),
('Toy Story', 'toy_story.jpg', 1995, 'John Lasseter', 'Animación', '81'),
('Saving Private Ryan', 'saving_private_ryan.jpg', 1998, 'Steven Spielberg', 'Guerra', '169'),
('The Green Mile', 'green_mile.jpg', 1999, 'Frank Darabont', 'Drama', '189'),
('Braveheart', 'braveheart.jpg', 1995, 'Mel Gibson', 'Histórica', '178'),
('The Social Network', 'social_network.jpg', 2010, 'David Fincher', 'Drama', '120'),
('Whiplash', 'whiplash.jpg', 2014, 'Damien Chazelle', 'Drama', '106');

INSERT INTO usuarios (nombre_usuario, role_usuario, email, contrasena)
VALUES
('admin1', 'administrador', 'admin@example.com', 'admin123'),
('usuario1', 'user', 'usuario1@example.com', 'user123'),
('usuario2', 'user', 'usuario2@example.com', 'user456');
