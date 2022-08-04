const { dbConf, dbQuery } = require("../config/db");
const fs = require('fs');
module.exports = {
    getData: async (req, res) => {
        try {
            console.log(req.query);

            // console.log(`Select p.*, s.status from products p JOIN status s on p.status_id=s.idstatus;`)
            // console.log(`Select p.*, s.status from products p JOIN status s on p.status_id=s.idstatus 
            // where idproduct = ${dbConf.escape(req.query.idproduct)} AND status_id = ${dbConf.escape(req.query.status_id)};`)
            let filter = [];
            for (const key in req.query) {
                if (key == 'lte') {
                    filter.push(`price < ${dbConf.escape(req.query[key])}`)
                } else if (key == 'gte') {
                    filter.push(`price > ${dbConf.escape(req.query[key])}`)
                } else {
                    filter.push(`${key} = ${dbConf.escape(req.query[key])}`)
                }
            }
            console.table(filter);
            let sqlGet = `Select p.*, s.status from products p JOIN status s on p.status_id=s.idstatus 
            ${filter.length == 0 ? '' : `where ${filter.join(' AND ')}`} ;`;
            
            let resultsGet = await dbQuery(sqlGet);

            res.status(200).send(resultsGet)
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    },
    deleteData: async (req, res) => {
        try {
            if (req.dataToken.role == 'Admin') {
                await dbQuery(`DELETE from products where idproduct=${req.params.id}`);

                res.status(200).send({
                    success: true,
                    message: 'Delete product'
                })
            } else {
                res.status(401).send({
                    success: false,
                    message: 'You are not admin ❌'
                })
            }
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    },
    add: async (req, res) => {
        try {
            // console.log(req.body);
            // console.log(req.files);
            let data = JSON.parse(req.body.data);

            // Memproses data ke mysql
            let dataInput = [];
            for (const prop in data) {
                dataInput.push(dbConf.escape(data[prop]));
            }
            console.log("before", dataInput);
            dataInput.splice(4, 0, dbConf.escape(`/imgProduct/${req.files[0].filename}`))
            console.log("after", dataInput);
            let addData = await dbQuery(`INSERT INTO products (name, brand, category, description, images, stock, price) 
                values (${dataInput.join(',')});`);

            res.status(200).send({
                success: true,
                message: 'Add product Success'
            })

        } catch (error) {
            console.log(error);
            // Menghapus gambar pada directory
            fs.unlinkSync(`./public/imgProduct/${req.files[0].filename}`);
            res.status(500).send(error)
        }
    },
    update: async (req, res) => {
        try {
            if (req.dataToken.role == 'Admin') {
                let newData = [];
                Object.keys(req.body).forEach(val => {
                    newData.push(`${val}=${dbConf.escape(req.body[val])}`);
                })
                await dbQuery(`UPDATE products set ${newData.join(', ')} where idproduct=${req.params.id}`);

                res.status(200).send({
                    success: true,
                    message: 'UPDATE product'
                })
            } else {
                res.status(401).send({
                    success: false,
                    message: 'You are not admin ❌'
                })
            }
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    }
}