const mongoose = require('mongoose');
const Category = require('../models/Category'); // Importamos el modelo de categoría

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Conectado: ${conn.connection.host} 🍃`);

        // 🌱 SEED AUTOMÁTICO DE CATEGORÍAS
        const count = await Category.countDocuments();
        if (count === 0) {
            await Category.create([
                { name: 'Salud y Deporte', color: '#10b981' }, // Verde
                { name: 'Estudio y UTN', color: '#3b82f6' },   // Azul
                { name: 'Productividad', color: '#8b5cf6' }    // Violeta
            ]);
            console.log('🌱 Categorías por defecto creadas con éxito en Docker.');
        }

    } catch (error) {
        console.error(`Error de conexión a MongoDB: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;