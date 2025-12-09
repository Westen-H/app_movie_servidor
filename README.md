# API REST de películas

## Descripción

Este proyecto es un backend para una aplicación de películas, desarrollado con Node.js y Express. Expone una API REST que permite gestionar usuarios, autenticación, películas y favoritos. El backend está desplegado en [Render](https://movie-app-server-gwvm.onrender.com/api/v1) y utiliza una base de datos PostgreSQL también alojada en Render.

## Tecnologías y dependencias

- **Node.js** y **Express** para el servidor y la API REST.
- **PostgreSQL** como base de datos relacional.
- **pg** para la conexión con la base de datos.
- **dotenv** para la gestión de variables de entorno.
- **bcryptjs** para el hash de contraseñas.
- **jsonwebtoken** para autenticación con JWT.
- **express-validator** para validaciones de entrada.
- **cors** para permitir peticiones desde el frontend.
- **multer** para guardar los archivos.

## Conexión a la base de datos

La conexión se realiza mediante la librería `pg` y la cadena de conexión se define en la variable de entorno `STRINGDB`. La base de datos está alojada en Render y contiene las tablas `usuarios`, `peliculas` y `favoritos`.

## Modelos principales

- **Autenticación**: Registro y login de usuarios.
- **Usuario**: Gestión de usuarios. Roles: `user` y `administrador`.
- **Película**: CRUD de películas, búsqueda por título e ID.
- **Favorito**: Permite a los usuarios guardar y eliminar películas favoritas.

## Validaciones

- Autenticación y autorización con Jason Web Token y roles.
- Validación de datos de entrada con `express-validator` (ej: email, contraseña fuerte, campos obligatorios).
- Validaciones específicas en los middlewares para cada ruta.

## Rutas principales

### Autenticación (`/api/v1/auth`)
- `POST /auth/signup`: registro de usuario.
- `POST /auth/login`: login de usuario.
- `GET /auth/renovar`: renovar token JWT.

### Usuarios (`/api/v1/usuario`)
- `POST /usuario/crear`: crear usuario (solo admin).
- `DELETE /usuario/eliminar`: eliminar usuario (solo admin).
- `PUT /usuario/editar/:id`: editar usuario (solo admin).
- `GET /usuario/obtener/:id`: obtener usuario por ID.

### Películas (`/api/v1/peliculas`)
- `GET /peliculas`: obtener todas las películas (usuario autenticado).
- `POST /peliculas/busqueda`: buscar películas por título (usuario autenticado).

#### Rutas de administrador (`/api/v1/admin/peliculas`)
- `GET /admin/peliculas`: obtener todas las películas.
- `GET /admin/peliculas/:id`: obtener película por ID.
- `POST /admin/peliculas`: crear nueva película.
- `PUT /admin/peliculas/:id`: actualizar película.
- `DELETE /admin/peliculas/:id`: eliminar película.

### Favoritos (`/api/v1/favorito`)
- `POST /favorito/crear`: agregar película a favoritos.
- `GET /favoritos/user/:id`: obtener favoritos de un usuario.
- `DELETE /favorito/eliminar/:id`: eliminar favorito.

### Uploads (imágenes)
- `POST /api/v1/upload`: subir un archivo individual (campo: `imagen`).
- `POST /api/v1/uploads`: subir múltiples archivos (campo: `imagenes`).
- `GET /api/v1/uploads`: ver la lista de todos los archivos subidos.
- `DELETE /api/v1/uploads/:filename`: eliminar un archivo por su nombre de la carpeta uploads/.

## Subida de archivos e imágenes (Multer)

Este proyecto utiliza Multer como middleware para gestionar la subida de archivos (imágenes de películas).

- Los archivos se guardan en la carpeta `uploads/` del proyecto (debe existir y tener permisos de escritura).
- El nombre del archivo se genera automáticamente con la fecha y el nombre original.
- Solo los administradores pueden subir o actualizar imágenes de películas.

- Los archivos subidos se pueden listar y eliminar mediante los endpoints `/uploads` y `/uploads/:filename`.


## Cómo lanzar el proyecto localmente

1. Clona el repositorio.
2. Instala las dependencias:
    ```bash
    npm install
    ```
3. Crea un archivo `.env` con la variable `STRINGDB` (cadena de conexión a PostgreSQL) y `SECRET_KEY` (clave para JWT).
4. Inicia el servidor:
    ```bash
    npm run start
    ```
5. El servidor estará disponible en el puerto definido en `.env` o por defecto en el `4001`.

## Despliegue

El backend y la base de datos están desplegados en Render.
