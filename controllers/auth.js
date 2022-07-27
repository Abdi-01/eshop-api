const { dbConf } = require('../config/db');
const { hashPassword } = require('../config/encript');

module.exports = {
    getData: (req, res) => {
        dbConf.query(`Select u.*, s.status from users u JOIN status s on u.status_id = s.idstatus;`,
            (err, results) => {
                if (err) {
                    console.log('Error query SQL :', err);
                    res.status(500).send(err);
                }

                console.log('Results SQL :', results);
                res.status(200).send(results);
            })
    },
    register: (req, res) => {
        console.log(req.body);
        let { username, email, age, city, password } = req.body;
        dbConf.query(`INSERT INTO USERS (username, email, age, city, password ) 
        values (${dbConf.escape(username)}, ${dbConf.escape(email)}, 
        ${dbConf.escape(age)}, ${dbConf.escape(city)}, 
        ${dbConf.escape(hashPassword(password))});`, (err, results) => {
            if (err) {
                console.log('Error query SQL :', err);
                res.status(500).send(err);
            }

            res.status(200).send({
                success: true,
                message: 'Register Success'
            })
        })
    },
    login: (req, res) => {

    },
    keepLogin: (req, res) => {

    }
}