const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "sandbox.smtp.mailtrap.io",
    port: process.env.EMAIL_PORT || 2525,
    auth: {
        user: process.env.EMAIL_USER, // Tu usuario de Mailtrap en el .env
        pass: process.env.EMAIL_PASS  // Tu contraseña de Mailtrap en el .env
    }
});

// Verificar la conexión con el servidor de correos
transporter.verify((error, success) => {
    if (error) {
        console.error("Error en la configuración de Nodemailer:", error);
    } else {
        console.log("Servidor de correos listo para enviar mensajes");
    }
});

module.exports = transporter;