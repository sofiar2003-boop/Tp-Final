const noteService = require('../services/note.service');

class NoteController {
    async create(req, res, next) {
        try {
            const userId = req.user.id;
            const result = await noteService.createNote(userId, req.body);
            return res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }

    async getByHabit(req, res, next) {
        try {
            const userId = req.user.id;
            const { habitId } = req.params;
            const notes = await noteService.getNotesByHabit(habitId, userId);
            return res.status(200).json(notes);
        } catch (error) {
            next(error);
        }
    }

    async getAll(req, res, next) {
        try {
            const userId = req.user.id;
            const notes = await noteService.getAllUserNotes(userId);
            return res.status(200).json(notes);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new NoteController();