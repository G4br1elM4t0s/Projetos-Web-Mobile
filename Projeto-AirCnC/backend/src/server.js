const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const http =  require('http');

const routes = require('./routes'); 
const socketio = require('socket.io');
const { default: cluster } = require("cluster");

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: '*',

  }
});

const password = "" // digite a senha do seu mongoDB
const user = ""// digite seu usuario aqui

mongoose.connect(`mongodb+srv://${user}:${password}@cluster0.lsoqold.mongodb.net/?retryWrites=true&w=majority`, {
  useNewUrlParser:true,
  useUnifiedTopology:true,
});

const connectedUsers = {};

io.on('connection',socket=>{
  const { user_id } = socket.handshake.query;

  connectedUsers[user_id] = socket.id;
});

app.use((req,res, next)=>{
  req.io = io;
  req.connectedUsers = connectedUsers;

  return next();
})


//GET POST PUT DELETE
app.use(cors());
app.use(express.json());
app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads')));
app.use(routes);


server.listen(3333,(req, res) => {
    console.log('rodando');
   
})




