const Category = require('../models/Category');

class CategoryController {
    async getAll(req, res, next) {
        try {
            const categories = await Category.find();
            return res.status(200).json(categories);
        } catch (error) {
            next(error); // Mandamos el error al manejador centralizado
        }
    }
}

module.exports = new CategoryController();