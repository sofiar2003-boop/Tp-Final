// src/config/nodemailer.js
const nodemailer = require('nodemailer');

let transporter;

// Función asíncrona para inicializar el transporte de correos
const initNodemailer = async () => {
    try {
        // Generamos una cuenta de pruebas gratuita en Ethereal automáticamente
        const testAccount = await nodemailer.createTestAccount();

        transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true para puerto 465, false para otros puertos
            auth: {
                user: testAccount.user, // Usuario generado automáticamente
                pass: testAccount.pass, // Contraseña generada automáticamente
            },
        });

        console.log("📨 Servidor de correos de prueba (Ethereal) configurado con éxito.");
        
        // 🌟 REGLA DE ORO: Esta función nos permite ver dónde caen los correos
        // Modificamos el sendMail para que nos muestre la URL en la consola
        const originalSendMail = transporter.sendMail.bind(transporter);
        transporter.sendMail = async (options) => {
            const info = await originalSendMail(options);
            console.log(`\n📬 [CORREO ENVIADO] URL para ver el mail simulado: ${nodemailer.getTestMessageUrl(info)} \n`);
            return info;
        };

    } catch (error) {
        console.error("Error al configurar el servidor de correos:", error);
    }
};

// Ejecutamos la función para crear el transporte apenas arranca el archivo
initNodemailer();

// Exportamos un objeto que contiene el transporter (se actualizará cuando la promesa termine)
module.exports = {
    sendMail: async (options) => {
        if (!transporter) {
            // Espera un milisegundo por si la inicialización asíncrona tarda un poquito
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        return transporter.sendMail(options);
    }
};