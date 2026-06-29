// src/repositories/user.repository.js
const User = require('../models/User'); // Tu modelo de Mongoose

class UserRepository {
    async create(userData) {
        return await User.create(userData);
    }

    async findByEmail(email) {
        return await User.findOne({ email });
    }

    // 🌟 AGREGÁ ESTA FUNCIÓN ACÁ ADENTRO:
    async findByVerificationToken(token) {
        // Mongoose busca en la base de datos el usuario que coincida con el token
        return await User.findOne({ verificationToken: token });
    }
}

module.exports = new UserRepository();