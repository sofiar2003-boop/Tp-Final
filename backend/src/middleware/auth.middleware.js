const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const secret = process.env.JWT_SECRET || "clave_secreta_utn_provisoria";
            const decoded = jwt.verify(token, secret);

            // Inyectamos los datos del usuario dentro del objeto 'req' para que el controlador los use
            req.user = decoded;

            // Le damos luz verde para continuar al siguiente paso
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