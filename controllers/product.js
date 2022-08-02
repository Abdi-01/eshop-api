const { dbConf, dbQuery } = require("../config/db");
const fs = require('fs');
module.exports = {
    getData: async (req, res) => {
        try {
            let resultsGet = await dbQuery(`Select p.*, s.status from products p 
            JOIN status s on p.status_id=s.idstatus;`)

            res.status(200).send(resultsGet)
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    },
    deleteData: async (req, res) => {
        try {
            if(req.dataToken.role=='Admin'){
                await dbQuery(`DELETE from products where idproduct=${req.params.id}`);
                
                res.status(200).send({
                    success: true,
                    message: 'Delete product'
                })
            }else{
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

    }
}