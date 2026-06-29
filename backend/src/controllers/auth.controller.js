const authService = require('../services/auth.service');

const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        
        // Ejecutamos el servicio
        const result = await authService.register(name, email, password);
        
        return res.status(201).json({ 
            success: true, 
            message: result.message 
        });
    } catch (error) {
        // Si el servicio tiro un error, pasa al errorHandler
        next(error);
    }
};

const verifyEmail = async (req, res, next) => {
    try {
        const { token } = req.query;
        const result = await authService.verifyEmail(token);
        return res.status(200).json({ 
            success: true, 
            message: result.message 
        });
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const result = await authService.login(email, password);
        
        // Si el login es correcto, devolvemos el token
        return res.status(200).json({ 
            success: true, 
            ...result 
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { register, verifyEmail, login };