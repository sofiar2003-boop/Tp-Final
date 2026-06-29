require('dotenv').config();
const nodemailer = require('nodemailer');

const sendVerificationEmail = async (email, token) => {
    // 1. Configuramos el transportador con 'user' y 'pass'
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS // 👈 CORREGIDO ACÁ (de 'password' a 'pass')
        },
    });

    // 2. Definimos el link que va a clickear el usuario
    const verificationUrl = `http://localhost:8080/api/auth/verify/${token}`;

    // 3. Estructuramos el contenido del correo
    const mailOptions = {
        from: '"Tracker de Hábitos 🚀" <no-reply@trackerhabitos.com>',
        to: email,
        subject: 'Verifica tu cuenta - Tracker de Hábitos',
        html: `
            <h1>¡Hola! Gracias por registrarte</h1>
            <p>Por favor, haz clic en el siguiente enlace para verificar tu cuenta de correo electrónico:</p>
            <a href="${verificationUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verificar Cuenta</a>
            <br/><br/>
            <p>Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
            <p>${verificationUrl}</p>
        `,
    };

    // 4. Enviamos el mail real
    await transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail };