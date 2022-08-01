const { dbConf, dbQuery } = require("../config/db");

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
            await dbQuery(`DELETE from products where idproduct=${req.params.id}`);

            res.status(200).send({
                success: true,
                message: 'Delete product'
            })
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    },
    add: async (req, res) => {     
        try {
            console.log(req.body);
            console.log(req.files);

            // Memproses data ke mysql
            // let dataInput = [];
            // for (const prop in req.body) {
            //     dataInput.push(dbConf.escape(req.body[prop]))
            // }
            // let addData = await dbQuery(`INSERT INTO products (name, brand, category, description, images, stock, price) 
            //     values (${dataInput.join(',')});`);

            // res.status(200).send({
            //     success: true,
            //     message: 'Add product Success'
            // })

        } catch (error) {
            console.log(error);
            res.status(500).send(error)
        }
    },
    update: async (req, res) => {

    }
}