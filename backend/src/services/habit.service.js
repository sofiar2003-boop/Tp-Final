const Habit = require('../models/Habit'); 
const mongoose = require('mongoose');

class HabitService {
    async createHabit(habitData) {
        const { name, frequency, category, user, diasSemana } = habitData;

        if (!name) {
            const error = new Error("El nombre del hábito es obligatorio");
            error.statusCode = 400;
            throw error;
        }

        const categoriaFinal = category || new mongoose.Types.ObjectId();

        return await Habit.create({
            name,
            frequency: frequency || 'semanal',
            diasSemana: diasSemana || [1, 2, 3, 4, 5],
            category: categoriaFinal,
            user
        });
    }

    async getHabitsByUser(userId) {
        return await Habit.find({ user: userId });
    }

    async deleteHabit(habitId) {
    return await Habit.findByIdAndDelete(habitId);
    }

    async updateHabit(habitId, updateData) {
    return await Habit.findByIdAndUpdate(habitId, updateData, { new: true });
    }
    
}

module.exports = new HabitService();