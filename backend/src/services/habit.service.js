const habitRepository = require('../repositories/habit.repository');

class HabitService {
    async createHabit(userId, habitData) {
        const { name, description, frequency } = habitData;

        // Mandamos a guardar al repositorio inyectando el ID del usuario creador
        const newHabit = await habitRepository.create({
            user: userId,
            name,
            description,
            frequency
        });

        return {
            message: 'Hábito creado con éxito 📅',
            habit: newHabit
        };
    }
    async getUserHabits(userId) {
        const habits = await habitRepository.findByUserId(userId);
        return habits;
    }
    
    async createHabit(userId, habitData) {
        // Extraemos 'days' del body 👈
        const { name, description, frequency, category, days } = habitData;

        const newHabit = await habitRepository.create({
            user: userId,
            name,
            description,
            frequency,
            category,
            days: frequency === 'semanal' ? days : [] // Si es diario, el array queda vacío
        });

        return {
            message: 'Hábito creado con éxito 📅',
            habit: newHabit
        };
    }

    // 🔍 NUEVO: Lógica para eliminar un hábito
    async deleteHabit(habitId, userId) {
        const deletedHabit = await habitRepository.delete(habitId, userId);

        if (!deletedHabit) {
            throw new Error('Hábito no encontrado o no autorizado para eliminar');
        }

        return { message: 'Hábito eliminado correctamente 🗑️' };
    }
}

module.exports = new HabitService();