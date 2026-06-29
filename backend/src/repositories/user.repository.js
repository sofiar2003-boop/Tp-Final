const User = require('../models/User');

class UserRepository {
    async findByEmail(email) {
        return await User.findOne({ email });
    }

    async create(userData) {
        return await User.create(userData);
    }

    async findByToken(token) {
        return await User.findOne({ verificationToken: token });
    }

    async save(userInstance) {
        return await userInstance.save();
    }

    // 🔍 NUEVO: Guardar los cambios del usuario (isVerified = true)
    async update(user) {
        return await user.save();
    }
}

module.exports = new UserRepository();