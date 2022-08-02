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
    },
    readToken: (req, res, next) => {
        console.log('data token',req.token);
        jwt.verify(req.token,'shopping',(err,decode)=>{
            if(err){
                res.status(401).send({
                    message :'Authenticate error ❌'
                })
            }

            console.log('Translate token', decode);

            req.dataToken = decode;

            next();

        })
    }
}