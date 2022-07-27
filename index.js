const express = require('express');
const app = express();
const PORT = 3232;

app.use(express.json());

app.get('/',(req,res)=>{
    res.status(200).send('<h1>ESHOP API</h1>');
})

app.listen(PORT,()=>console.log(`Running ESHOP API at ${PORT}`));