const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true, // No permite mails duplicados
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    isVerified: {
        type: Boolean,
        default: false // Arranca en false hasta que verifique el mail
    },
    verificationToken: {
        type: String, // Guardaremos el token temporal para el link del mail
        default: null
    }
}, {
    timestamps: true 
});

module.exports = mongoose.model('User', UserSchema);