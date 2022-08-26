const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// mudança no require abaixo
require('./app/controllers/index')(app); // passando o app porque o app é como se fosse o objeto que ele é definido uma vez e vamos precisar utilizar essa mesmo app em todos outros arquivos por que se não teria varias app rodando no node


mongoose.connect('mongodb+srv://Gabriel:a2bdgh7b@cluster0.lsoqold.mongodb.net/TCC?retryWrites=true&w=majority', {
  useNewUrlParser:true,
  useUnifiedTopology:true,
});

app.listen(3000, ()=>{
    console.log("servidor rodando");
});