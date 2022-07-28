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
        let { username, email, password } = req.body;
        dbConf.query(`INSERT INTO USERS (username, email, password ) 
        values (${dbConf.escape(username)}, ${dbConf.escape(email)},  
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
        let { email, password } = req.body;
        dbConf.query(`Select u.iduser, u.username, u.email, u.age, u.city, u.role, u.status_id, s.status from users u JOIN status s on u.status_id = s.idstatus 
        WHERE u.email=${dbConf.escape(email)} 
        and u.password=${dbConf.escape(hashPassword(password))};`, (err, results) => {
            if (err) {
                console.log('Error query SQL :', err);
                res.status(500).send(err);
            }

            dbConf.query(`Select u.iduser, p.idproduct, p.name, p.images, p.brand, 
            p.category, p.price, c.qty, p.price*c.qty as totalPrice from users u
            JOIN carts c ON u.iduser=c.user_id
            JOIN products p ON p.idproduct = c.product_id 
            WHERE c.user_id =${dbConf.escape(results[0].iduser)};`,(errCart,resultsCart)=>{
                if (errCart) {
                    console.log('Error query SQL :', errCart);
                    res.status(500).send(errCart);
                }

                res.status(200).send({
                    ...results[0],
                    cart:resultsCart
                })

            })
        })
    },
    keepLogin: (req, res) => {

    }
}