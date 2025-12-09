const jwt = require("jsonwebtoken");

const verificarJWT = (req, res, next) => {

    // 1) Leer token desde Authorization
    let token = req.headers["authorization"]?.split(" ")[1];

    // 2) Si no viene → intentar leer cookie
    if (!token) {
        token = req.cookies?.miToken;
    }

    console.log("TOKEN RECIBIDO (header/cookie):", token);

    // 3) Si no existe → bloquear
    if (!token) {
        return res.status(403).json({
            ok: false,
            msg: "No hay token en la petición."
        });
    }

    try {
        // 4) Verificar token
        const payload = jwt.verify(token, process.env.SECRET_KEY);

        req.userToken = {
            uid: payload.uid,
            nombre_usuario: payload.nombre_usuario,
            role_usuario: payload.role_usuario
        };

        next();

    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: "Token no válido."
        });
    }
};

module.exports = { verificarJWT };
