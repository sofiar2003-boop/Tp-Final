// src/services/habit.service.js
// Reemplazá o creá con este código limpio:

// Nota: Cuando tengas tu habit.repository, lo vas a importar acá.
// Por ahora, para probar rápido si impacta en la base de datos, podemos usar el Modelo directo.
const Habit = require('../models/Habit'); 

class HabitService {
    async createHabit(habitData) {
        const { name, frequency, category, user } = habitData;

        if (!name) {
            const error = new Error("El nombre del hábito es obligatorio");
            error.statusCode = 400;
            throw error;
        }

        // Creamos el hábito en MongoDB vinculándolo al ID del usuario
        const newHabit = await Habit.create({
            name,
            frequency: frequency || 'diaria',
            category, // ID de la categoría relacionada
            user      // ID del usuario dueño (vía JWT)
        });

        return newHabit;
    }
    async getHabitsByUser(userId) {
    // 🌟 Filtramos en MongoDB para traer SOLO los hábitos que le pertenecen a este usuario
    // Además, usamos populate por si querés traer los datos de la categoría relacionados
    return await Habit.find({ user: userId }).populate('category', 'name');
}
}

module.exports = new HabitService();