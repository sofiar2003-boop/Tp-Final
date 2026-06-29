const errorHandler = (err, req, res, next) => {
    console.error("Error capturado por el Guardián Global:", err.stack);

    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(val => val.message);
        return res.status(400).json({ error: 'Error de validación', detalles: messages });
    }

    if (err.kind === 'ObjectId') {
        return res.status(404).json({ error: 'Recurso no encontrado. El ID es inválido.' });
    }

    // Error por duplicados en MongoDB
    if (err.code === 11000) {
        return res.status(400).json({ error: 'El elemento ya existe en la base de datos.' });
    }

    const statusCode = err.statusCode || 500;
    return res.status(statusCode).json({
        error: err.message || 'Error interno del servidor'
    });
};

module.exports = errorHandler;