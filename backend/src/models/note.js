const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    habit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Habit',
        required: [true, 'La nota debe estar asociada a un hábito']
    },
    title: {
        type: String,
        required: [true, 'El título de la nota es obligatorio'],
        trim: true
    },
    content: {
        type: String,
        required: [true, 'El contenido de la nota no puede estar vacío']
    },
    imageUrl: {
        type: String, 
        default: ''
    },
    mood: {
        type: String,
        enum: ['excelente', 'productivo', 'relajado', 'cansado', 'estresado'],
        required: [true, 'El estado de ánimo del día es obligatorio']
    }
}, { timestamps: true });

module.exports = mongoose.model('Note', NoteSchema);