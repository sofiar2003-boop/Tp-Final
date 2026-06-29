// src/controllers/authController.js
const authService = require('../services/auth.service');

const register = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const result = await authService.register(email, password);
        return res.status(201).json({ success: true, ...result });
    } catch (error) {
        next(error); // Pasa el error al middleware centralizado
    }
};

const verifyEmail = async (req, res, next) => {
    try {
        const { token } = req.query; // Toma el ?token=XYZ de la URL
        const result = await authService.verifyEmail(token);
        
        // RECOMENDACIÓN TP: Podés responder con un JSON o redirigir directamente al Login del Frontend:
        // res.redirect('http://localhost:5173/login?verified=true');
        return res.status(200).json({ success: true, ...result });
    } catch (error) {
        next(error);
    }
};

module.exports = { register, verifyEmail };