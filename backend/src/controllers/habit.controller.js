const habitService = require('../services/habit.service');

class HabitController {
    async create(req, res) {
        try {
            // req.user viene del middleware auth.middleware.js decodificado
            const userId = req.user.id; 
            
            if (!req.body.name) {
                return res.status(400).json({ error: 'El nombre del hábito es obligatorio' });
            }

            // Invocamos al servicio pasándole el usuario y el cuerpo de la petición
            const result = await habitService.createHabit(userId, req.body);
            
            return res.status(201).json(result);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    async getAll(req, res) {
        try {
            const userId = req.user.id; // Extraído del token JWT por el middleware
            
            const habits = await habitService.getUserHabits(userId);
            
            return res.status(200).json(habits);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    // 🔍 NUEVO: Maneja la petición PUT /api/habits/:id/complete
    async complete(req, res) {
        try {
            const habitId = req.params.id; // Extrae el ID del hábito de la URL
            const userId = req.user.id;    // Extraído del token por el middleware

            const result = await habitService.completeHabit(habitId, userId);
            
            return res.status(200).json(result);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    // 🔍 NUEVO: Maneja la petición DELETE /api/habits/:id
    async delete(req, res) {
        try {
            const habitId = req.params.id;
            const userId = req.user.id;

            const result = await habitService.deleteHabit(habitId, userId);
            
            return res.status(200).json(result);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}

module.exports = new HabitController();