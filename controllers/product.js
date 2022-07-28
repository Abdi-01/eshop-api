const { dbConf } = require("../config/db")


module.exports = {
    getData: (req, res) => {
        dbConf.query(`Select p.*, s.status from products p 
        JOIN status s on p.status_id=s.idstatus;`,(err, results)=>{
            if(err){
                console.log(err);
                res.status(500).send(err);
            }
            res.status(200).send(results)
        })
    }
}