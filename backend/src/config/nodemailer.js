const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = {
    sendMail: async (options) => {
        try {
            const verificationLink = `https://tp-final-c7ds.onrender.com/api/auth/verify?token=${options.token || ''}`;
            const response = await resend.emails.send({
                from: 'onboarding@resend.dev', 
                to: options.to,              
                subject: options.subject || 'Valida tu cuenta - Panel Universitario',
                html: options.html || `
                    <div style="font-family: sans-serif; padding: 20px; max-width: 600px; border: 1px solid #1e2f26; border-radius: 15px;">
                        <h2 style="color: #1a2920;">¡Comenzá tu viaje de hábitos!</h2>
                        <p>Gracias por unirte a nuestro espacio. Para activar tu cuenta de estudio de forma definitiva, hacé clic en el siguiente botón:</p>
                        <div style="margin: 30px 0; text-align: center;">
                            <a href="${verificationLink}" style="background-color: #1a2920; color: white; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 10px; display: inline-block;">
                                Confirmar Cuenta
                            </a>
                        </div>
                        <small style="color: #4f6457;">Si no solicitaste esta cuenta, podés ignorar este correo de forma segura.</small>
                    </div>
                `
            });

            console.log(` Correo real enviado con éxito vía Resend a: ${options.to}`);
            return response;

        } catch (error) {
            console.error(" Error de fondo al enviar el mail real con Resend:", error.message);
            throw new Error("No se pudo procesar el envío del correo de verificación.");
        }
    }
};