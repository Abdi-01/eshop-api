const { dbConf, dbQuery } = require('../config/db');
const { hashPassword, createToken } = require('../config/encript');
const { transport } = require('../config/nodemailer');

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
    register: async (req, res) => {
        try {
            let { username, email, password } = req.body;
            let sqlInsert = await dbQuery(`INSERT INTO USERS (username, email, password ) 
            values (${dbConf.escape(username)}, ${dbConf.escape(email)},  
            ${dbConf.escape(hashPassword(password))});`);

            console.log(sqlInsert);
            if (sqlInsert.insertId) {
                let sqlGet = await dbQuery(`Select iduser, email, status_id from users where iduser=${sqlInsert.insertId}`);

                // Generate token
                let token = createToken({ ...sqlGet[0] }, '1h');

                // Mengirimkan email
                await transport.sendMail({
                    from: 'ESHOP ADMIN CARE',
                    to: sqlGet[0].email,
                    subject: 'Verification email account',
                    html: `<div>
                    <h3>Click link below</h3>
                    <a href="${process.env.FE_URL}/verification/${token}">Verified Account</a>
                    </div>`
                })
                res.status(200).send({
                    success: true,
                    message: 'Register Success'
                })
            }

        } catch (error) {
            console.log('Error query SQL :', error);
            res.status(500).send(error);
        }
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
            WHERE c.user_id =${dbConf.escape(results[0].iduser)};`, (errCart, resultsCart) => {
                if (errCart) {
                    console.log('Error query SQL :', errCart);
                    res.status(500).send(errCart);
                }
                let token = createToken({ ...results[0] });

                res.status(200).send({
                    ...results[0],
                    cart: resultsCart,
                    token
                })

            })
        })
    },
    keepLogin: async (req, res) => {
        try {
            let resultsUser = await dbQuery(`Select u.iduser, u.username, u.email, u.age, u.city, u.role, u.status_id, s.status from users u 
            JOIN status s on u.status_id = s.idstatus 
            WHERE u.iduser=${dbConf.escape(req.dataToken.iduser)};`)

            if (resultsUser.length > 0) {
                let resultsCart = await dbQuery(`Select u.iduser, p.idproduct, p.name, p.images, p.brand, 
                p.category, p.price, c.qty, p.price*c.qty as totalPrice from users u
                JOIN carts c ON u.iduser=c.user_id
                JOIN products p ON p.idproduct = c.product_id 
                WHERE c.user_id =${dbConf.escape(resultsUser[0].iduser)};`)

                let token = createToken({ ...resultsUser[0] });
                res.status(200).send({
                    ...resultsUser[0],
                    cart: resultsCart,
                    token
                })
            }

        } catch (error) {
            console.log('Error query SQL :', error);
            res.status(500).send(error);
        }
    },
    verification: async (req, res) => {
        try {
            console.log(req.dataToken)
            if (req.dataToken.iduser) {
                //    1. update status user, yang awalnya unverified menjadi Verify
                await dbQuery(`UPDATE users set status_id=1 WHERE iduser=${dbConf.escape(req.dataToken.iduser)};`);
                // 2. proses login 
                let resultsUser = await dbQuery(`Select u.iduser, u.username, u.email, u.age, u.city, u.role, u.status_id, s.status from users u 
                JOIN status s on u.status_id = s.idstatus WHERE iduser=${dbConf.escape(req.dataToken.iduser)};`);
                if (resultsUser.length > 0) {
                    // 3. login berhasil, maka kita buat token baru
                    let token = createToken({ ...resultsUser[0] });
                    res.status(200).send(
                        {
                            success: true,
                            messages: "Verify Success ✅",
                            dataLogin: {
                                ...resultsUser[0],
                                token
                            },
                            error: ""
                        }
                    )
                }
            } else {
                res.status(401).send({
                    success: false,
                    messages: "Verify Failed ❌",
                    dataLogin: {},
                    error: ""
                })
            }
        } catch (error) {
            console.log(error)
            res.status(500).send({
                success: false,
                message: "Failed ❌",
                error
            });
        }
    }
}