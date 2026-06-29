const Note = require('../models/Note');

class NoteRepository {
    async create(noteData) {
        return await Note.create(noteData);
    }

    async findByHabitId(habitId, userId) {
        // Busca las notas de un hábito específico ordenadas por la más reciente
        return await Note.find({ habit: habitId, user: userId }).sort({ createdAt: -1 });
    }

    async findByUserId(userId) {
        // Trae todas las notas del usuario (útil para el mapa de píxeles general)
        return await Note.find({ user: userId }).populate('habit', 'name').sort({ createdAt: -1 });
    }
}

module.exports = new NoteRepository();