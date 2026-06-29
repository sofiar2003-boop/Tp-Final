const Note = require('../models/Note');

class NoteRepository {
    async create(noteData) {
        return await Note.create(noteData);
    }

    async findByHabitId(habitId, userId) {
        return await Note.find({ habit: habitId, user: userId }).sort({ createdAt: -1 });
    }

    async findByUserId(userId) {
        return await Note.find({ user: userId }).populate('habit', 'name').sort({ createdAt: -1 });
    }
}

module.exports = new NoteRepository();