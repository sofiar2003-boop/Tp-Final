const mongoose = require('mongoose');

const HabitSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category', // 👈 ESTA ES LA RELACIÓN QUE PIDE LA UTN
        required: [true, 'La categoría es obligatoria']
    },
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        trim: true
    },
    description: { type: String, trim: true },
    frequency: {
        type: String,
        enum: ['diario', 'semanal'], // Ahora definimos si es diario o días específicos
        default: 'diario'
    },
    days: {
        type: [String], // Ej: ['LU', 'MI', 'VI']
        default: []
    },
    streak: {
        type: Number,
        default: 0 // Contador de días seguidos cumplidos
    },
    isCompletedToday: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Habit', HabitSchema);