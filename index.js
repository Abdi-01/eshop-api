const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT;


app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.status(200).send('<h1>ESHOP API</h1>');
})

// DB Check Connection
const { dbConf } = require('./config/db');
dbConf.getConnection((error,connection)=>{
    if(error){
        console.log("Error MySQL Connection", error.sqlMessage);
    }

    console.log(`Connect MySQL ✅ : ${connection.threadId}`);
})
// CONFIG ROUTERS
const { authRouter } = require('./routers');
app.use('/auth', authRouter);

app.listen(PORT, () => console.log(`Running ESHOP API at ${PORT}`));