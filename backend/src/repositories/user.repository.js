const User = require('../models/user'); 

class UserRepository {
    async create(userData) {
        return await User.create(userData);
    }

    async findByEmail(email) {
        return await User.findOne({ email });
    }

    async findByVerificationToken(token) {
        return await User.findOne({ verificationToken: token });
    }
}

module.exports = new UserRepository();