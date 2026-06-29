const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre de la categoría es obligatorio'],
        trim: true
    },
    color: {
        type: String, // Para usar en el frontend (ej: "#4CAF50")
        default: '#3b82f6'
    }
}, { timestamps: true });

module.exports = mongoose.model('Category', CategorySchema);