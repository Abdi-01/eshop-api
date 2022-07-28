const { dbConf, dbQuery } = require("../config/db")


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
    }
}