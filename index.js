const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT;
const bearerToken = require('express-bearer-token');
const session = require('express-session');
const passport = require('passport');

app.use(session({
    resave:false,
    saveUninitialized:true,
    secret:'SECRET'
}));

// Config passport
require('./config/passport');

app.use(passport.initialize());
app.use(passport.session());


app.use(express.static('public'));
app.use(express.json());
app.use(cors());
app.use(bearerToken());

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
const { authRouter, productRouter } = require('./routers');
app.use('/auth', authRouter);
app.use('/products', productRouter);

app.listen(PORT, () => console.log(`Running ESHOP API at ${PORT}`));