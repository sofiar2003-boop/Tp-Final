const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

// 1. IMPORTACIÓN DE RUTAS (Una sola declaración de cada una)
const authRoutes = require('./routes/auth.routes');
const habitRoutes = require('./routes/habit.routes');
const errorHandler = require('./middleware/error.middleware');
const categoryRoutes = require('./routes/category.routes');
const noteRoutes = require('./routes/note.routes');

const app = express();

// Conectar a la Base de Datos (Docker)
connectDB();

// Middlewares obligatorios
app.use(cors());
app.use(express.json());

// 2. USO DE LAS RUTAS
app.use('/api/auth', authRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/notes', noteRoutes);

app.use(errorHandler);

// Levantar servidor
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});