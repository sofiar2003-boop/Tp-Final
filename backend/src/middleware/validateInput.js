
const validateRegister = (req, res, next) => {
    const { name, email, password } = req.body;

    if (!name || !name.trim()) {
        return res.status(400).json({ success: false, error: "El campo nombre es obligatorio." });
    }

    if (!email || !password) {
        return res.status(400).json({ success: false, error: "Faltan campos obligatorios." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ success: false, error: "El formato del correo no es válido." });
    }

    if (password.length < 6) {
        return res.status(400).json({ success: false, error: "La contraseña debe tener al menos 6 caracteres." });
    }

    next();
};

module.exports = { validateRegister };