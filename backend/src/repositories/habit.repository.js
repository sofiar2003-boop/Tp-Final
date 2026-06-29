const Habit = require('../models/Habit');

class HabitRepository {
    // Guarda un nuevo hábito asociado a un usuario específico
    async create(habitData) {
        const habit = new Habit(habitData);
        return await habit.save();
    }

    async findByUserId(userId) {
        // El .populate('category') busca el ID en la colección de categorías y te inyecta el objeto entero
        return await Habit.find({ user: userId }).populate('category', 'name color');
    }
    
    // 🔍 NUEVO: Busca un hábito específico por su ID y el ID del usuario
    async findByIdAndUser(habitId, userId) {
        return await Habit.findOne({ _id: habitId, user: userId });
    }

    // 🔍 NUEVO: Guarda los cambios del hábito actualizados (streak, isCompletedToday)
    async update(habit) {
        return await habit.save();
    }

    // 🔍 NUEVO: Elimina un hábito específico de la base de datos
    async delete(habitId, userId) {
        return await Habit.findOneAndDelete({ _id: habitId, user: userId });
    }
}

module.exports = new HabitRepository();