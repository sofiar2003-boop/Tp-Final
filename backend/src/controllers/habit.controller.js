// src/controllers/habit.controller.js
const habitService = require('../services/habit.service');

const createHabit = async (req, res, next) => {
    try {
        const { name, frequency, categoryId } = req.body;
        const userId = req.user.id; // Viene del token decodificado por el middleware

        const newHabit = await habitService.createHabit({
            name,
            frequency,
            category: categoryId,
            user: userId
        });

        return res.status(201).json({ success: true, data: newHabit });
    } catch (error) {
        next(error);
    }
};
const getHabits = async (req, res, next) => {
    try {
        const userId = req.user.id; // Extraído del token JWT por el middleware protect
        const habits = await habitService.getHabitsByUser(userId);
        
        return res.status(200).json({ success: true, data: habits });
    } catch (error) {
        next(error);
    }
};

module.exports = { 
    createHabit,
    getHabits 
};