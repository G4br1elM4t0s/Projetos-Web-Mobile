const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const http =  require('http');

const routes = require('./routes'); 
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "http://localhost:3000",
  }
});

io.on('connection',socket=>{
  console.log('connection user', socket.id);
})

mongoose.connect('mongodb+srv://Gabriel:a2bdgh7b@cluster0.lsoqold.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser:true,
  useUnifiedTopology:true,
});


//GET POST PUT DELETE
app.use(cors());
app.use(express.json());
app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads')));
app.use(routes);


server.listen(3333,(req, res) => {
    console.log('rodando');
   
})




