const { application } = require("express");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const routes = require("./routes");

const app = express();

mongoose.connect('mongodb+srv://Gabriel:a2bdgh7b@cluster0.lsoqold.mongodb.net/?retryWrites=true&w=majority');

//GET POST PUT DELETE
app.use(cors());
app.use(express.json());
app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads')));
app.use(routes);


app.listen(3333, (req, res) => {
  console.log("servidor funcionando!");
});
