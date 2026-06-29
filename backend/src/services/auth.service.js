// src/services/auth.service.js

const userRepository = require('../repositories/user.repository'); 
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const transporter = require('../config/nodemailer');
const jwt = require('jsonwebtoken');

class AuthService {
    
    // 🌟 1. MÉTODO PARA REGISTRAR UN USUARIO
    async register(name, email, password) {
        // Verificar si el correo ya existe
        const existingUser = await userRepository.findByEmail(email);
        if (existingUser) {
            const error = new Error("El email ya está registrado");
            error.statusCode = 400;
            throw error;
        }

        // Hashear contraseña y crear token de verificación
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const verificationToken = crypto.randomBytes(32).toString('hex');

        // Guardar el usuario en la base de datos a través del repositorio
        const newUser = await userRepository.create({
            name,
            email,
            password: hashedPassword,
            isVerified: false,
            verificationToken
        });

        // Configurar el link de activación por correo
        const urlDespliegue = process.env.BACKEND_URL || "http://localhost:8080";
        const linkActivacion = `${urlDespliegue}/api/auth/verify?token=${verificationToken}`;

        const mailOptions = {
            from: '"Gestor de Hábitos UTN" <no-reply@tuapp.com>',
            to: newUser.email,
            subject: "Confirmá tu cuenta - Registro de Usuario",
            html: `<h1>¡Bienvenido ${name}!</h1><p>Hacé clic en el siguiente enlace para activar tu cuenta:</p><a href="${linkActivacion}">Activar mi Cuenta</a>`
        };

        // Enviar el correo de fondo de forma segura sin congelar Express
        try {
            transporter.sendMail(mailOptions).catch(err => {
                console.error("❌ Error de fondo al enviar el mail:", err.message);
            });
        } catch (mailError) {
            console.error("⚠️ No se pudo inicializar el envío del correo:", mailError.message);
        }

        // Respuesta inmediata al controlador para destrabar el frontend
        return { 
            message: "Usuario registrado con éxito. Por favor, revisá tu correo para activar la cuenta." 
        };
    }

    // 🌟 2. MÉTODO PARA VERIFICAR EL EMAIL (Cuando hacen clic en el link)
    async verifyEmail(token) {
        const user = await userRepository.findByVerificationToken(token);
        if (!user) {
            const error = new Error("Token de verificación inválido o expirado.");
            error.statusCode = 400;
            throw error;
        }

        // Cambiamos el estado a verificado y limpiamos el token usado
        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();

        return { message: "Cuenta verificada con éxito. Ya podés iniciar sesión." };
    }

    // 🌟 3. MÉTODO PARA INICIAR SESIÓN (LOGIN)
    async login(email, password) {
        const user = await userRepository.findByEmail(email);
        
        // Si no existe el usuario o la contraseña no coincide
        if (!user || !(await bcrypt.compare(password, user.password))) {
            const error = new Error("Credenciales inválidas (email o contraseña incorrectos).");
            error.statusCode = 401;
            throw error;
        }

        // 🛑 COMPROBACIÓN EXIGIDA POR LA UTN: Bloquear el ingreso si no se verificó por mail
        if (!user.isVerified) {
            const error = new Error("Tu cuenta aún no ha sido activada. Por favor, revisá tu correo electrónico.");
            error.statusCode = 403;
            throw error;
        }

        // Si pasó los filtros, creamos el JWT Token firmado para seguridad
        const secret = process.env.JWT_SECRET || "clave_secreta_utn_provisoria";
        const token = jwt.sign({ id: user._id, email: user.email }, secret, { expiresIn: '24h' });

        return {
            message: "Ingreso exitoso",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        };
    }
}

// Exportamos la instancia única de nuestro servicio
module.exports = new AuthService();