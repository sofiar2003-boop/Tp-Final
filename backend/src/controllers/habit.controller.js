const habitService = require('../services/habit.service');

const createHabit = async (req, res, next) => {
    try {
        const { name, frequency, categoryId } = req.body;
        const userId = req.user.id; 

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
        const userId = req.user.id; 
        const habits = await habitService.getHabitsByUser(userId);
        
        return res.status(200).json({ success: true, data: habits });
    } catch (error) {
        next(error);
    }
};

const deleteHabit = async (req, res, next) => {
    try {
        const { id } = req.params; 
        await habitService.deleteHabit(id);
        
        return res.status(200).json({ success: true, message: "Hábito eliminado con éxito" });
    } catch (error) {
        next(error);
    }
};

const updateHabit = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updated = await habitService.updateHabit(id, req.body);
        
        return res.status(200).json({ success: true, data: updated });
    } catch (error) {
        next(error);
    }
};

module.exports = { 
    createHabit,
    getHabits,
    deleteHabit,
    updateHabit 
};