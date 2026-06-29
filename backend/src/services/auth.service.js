const userRepository = require('../repositories/user.repository');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const transporter = require('../config/nodemailer');

class AuthService {
    async register(email, password) {
        // 1. Validar si ya existe
        const existingUser = await userRepository.findByEmail(email);
        if (existingUser) {
            const error = new Error("El email ya está registrado");
            error.statusCode = 400;
            throw error;
        }

        // 2. Hashear contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Generar token de activación único y aleatorio
        const verificationToken = crypto.randomBytes(32).toString('hex');

        // 4. Guardar usuario no verificado
        const newUser = await userRepository.create({
            email,
            password: hashedPassword,
            isVerified: false,
            verificationToken
        });

        // 5. Enviar el correo electrónico con Nodemailer
        const urlDespliegue = process.env.BACKEND_URL || "http://localhost:8080";
        const linkActivacion = `${urlDespliegue}/api/auth/verify?token=${verificationToken}`;

        const mailOptions = {
            from: '"Gestor de Hábitos UTN" <no-reply@tuapp.com>',
            to: newUser.email,
            subject: "Confirmá tu cuenta - Registro de Usuario",
            html: `
                <h1>¡Bienvenido a la Aplicación de Hábitos!</h1>
                <p>Para poder iniciar sesión, debés verificar tu cuenta haciendo clic en el siguiente enlace:</p>
                <a href="${linkActivacion}" style="background-color: #2F4F4F; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Activar mi Cuenta</a>
                <br/><br/>
                <p>Si no podés hacer clic, copiá y pegá esta URL en tu navegador:</p>
                <p>${linkActivacion}</p>
            `
        };

        await transporter.sendMail(mailOptions);
        return { message: "Usuario registrado. Por favor, revisá tu correo para verificar la cuenta." };
    }

    async verifyEmail(token) {
        if (!token) {
            const error = new Error("Token ausente");
            error.statusCode = 400;
            throw error;
        }

        // Buscar el usuario por el token
        const user = await userRepository.findByToken(token);
        if (!user) {
            const error = new Error("Token inválido o expirado");
            error.statusCode = 400;
            throw error;
        }

        // Cambiar estado a verificado
        user.isVerified = true;
        user.verificationToken = null; // Limpiamos el token usado
        await userRepository.save(user);

        return { message: "Cuenta verificada con éxito. Ya podés iniciar sesión." };
    }
}

module.exports = new AuthService();