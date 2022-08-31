const mongoose = require('mongoose');

const user = "";
const pass = "";

mongoose.connect(`mongodb+srv://${user}:${pass}@cluster0.3luw0ba.mongodb.net/MTask?retryWrites=true&w=majority`, {
  useNewUrlParser:true,
  useUnifiedTopology:true,
}); // Forma de conectar ao mongo Semelhante ao PDO DO PHP
mongoose.Promise = global.Promise;

module.exports = mongoose;