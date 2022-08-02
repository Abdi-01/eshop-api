const Crypto = require('crypto');
const jwt = require('jsonwebtoken');

module.exports = {
    hashPassword: (pass) => {
        return Crypto.createHmac("sha256", "ESHOP123").update(pass).digest("hex");
    },
    createToken: (payload) => {
        return jwt.sign(payload, 'shopping', {
            expiresIn: '1h'
        });
    }
}