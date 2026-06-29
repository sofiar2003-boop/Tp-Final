const Habit = require('../models/Habit');

class HabitRepository {
    // Guarda un nuevo hábito asociado a un usuario específico
    async create(habitData) {
        const habit = new Habit(habitData);
        return await habit.save();
    }

    async findByUserId(userId) {
        return await Habit.find({ user: userId }).populate('category', 'name color');
    }
    
    async findByIdAndUser(habitId, userId) {
        return await Habit.findOne({ _id: habitId, user: userId });
    }

    async update(habit) {
        return await habit.save();
    }

    //elimina un habito especifico de la base de datos
    async delete(habitId, userId) {
        return await Habit.findOneAndDelete({ _id: habitId, user: userId });
    }
}

module.exports = new HabitRepository();