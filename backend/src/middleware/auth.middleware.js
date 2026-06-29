const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    let token;

    // Los tokens viajan en los Headers de la petición bajo el nombre 'Authorization'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Separamos la palabra 'Bearer' del token real
            token = req.headers.authorization.split(' ')[1];

            // Verificamos y decodificamos el token usando la firma del .env
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Inyectamos los datos del usuario dentro del objeto 'req' para que el controlador los use
            req.user = decoded;

            // Le damos luz verde para continuar al siguiente paso (el controlador)
            return next();
        } catch (error) {
            return res.status(401).json({ error: 'Token inválido o expirado' });
        }
    }

    if (!token) {
        return res.status(401).json({ error: 'No autorizado, falta el token de acceso' });
    }
};

module.exports = { protect };