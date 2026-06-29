const noteRepository = require('../repositories/note.repository');

class NoteService {
    async createNote(userId, noteData) {
        const { habit, title, content, imageUrl, mood } = noteData;

        const newNote = await noteRepository.create({
            user: userId,
            habit,
            title,
            content,
            imageUrl,
            mood
        });

        return {
            message: 'Entrada de diario guardada con éxito 📝✨',
            note: newNote
        };
    }

    async getNotesByHabit(habitId, userId) {
        return await noteRepository.findByHabitId(habitId, userId);
    }

    async getAllUserNotes(userId) {
        return await noteRepository.findByUserId(userId);
    }
}

module.exports = new NoteService();