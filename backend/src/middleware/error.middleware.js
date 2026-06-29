const errorHandler = (err, req, res, next) => {
    console.error("❌ Error capturado por el Guardián Global:", err.stack);

    // Si el error es de validación de Mongoose (ej: faltó un campo obligatorio)
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(val => val.message);
        return res.status(400).json({ error: 'Error de validación', detalles: messages });
    }

    // Si Mongoose no encuentra un ID con formato correcto
    if (err.kind === 'ObjectId') {
        return res.status(404).json({ error: 'Recurso no encontrado. El ID es inválido.' });
    }

    // Error por duplicados en MongoDB (ej: mismo mail)
    if (err.code === 11000) {
        return res.status(400).json({ error: 'El elemento ya existe en la base de datos.' });
    }

    // Error genérico por defecto
    const statusCode = err.statusCode || 500;
    return res.status(statusCode).json({
        error: err.message || 'Error interno del servidor'
    });
};

module.exports = errorHandler;