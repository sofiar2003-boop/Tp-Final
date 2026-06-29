const nodemailer = require('nodemailer');

let transporter;


const initNodemailer = async () => {
    try {
        
        const testAccount = await nodemailer.createTestAccount();

        transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, 
            auth: {
                user: testAccount.user, 
                pass: testAccount.pass, 
            },
        });

        console.log("📨 Servidor de correos de prueba (Ethereal) configurado con éxito.");
        
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


initNodemailer();

module.exports = {
    sendMail: async (options) => {
        if (!transporter) {
            // Espera un milisegundo por si tarda un poquito
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        return transporter.sendMail(options);
    }
};