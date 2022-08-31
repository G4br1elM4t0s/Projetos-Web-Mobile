const express =  require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}))// Quando a requisição for feita não haver bloqueio;

require('./controllers/authController')(app);// previnir varias criações de servidores...

app.listen(3000,(req,res)=>{
    console.log('rodando')
});