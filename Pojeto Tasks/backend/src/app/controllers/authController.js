const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authconfig = require("../../config/auth.json");
const crypto = require("crypto");


const router = express.Router();

function generateToken(params = {}) {
  return jwt.sign(params , authconfig.secret , {
    //primeiro parametro que tem que ser passado é o user.id ou seja uma propriedade unica no usuario,
    // segundo parametro que tem que ser passado é um token de uma aplication ou seja um a hash unico para minha app
    expiresIn: 86400, //terceiro parametro passado foi o tempo de expiração do token
  });
}

router.post("/register", async (req, res) => {
  const { email } = req.body;

  try {
    if (User.findOne({ email })) {
      return res.status(400).send({ error: "User already exists" });
    }

    const user = await User.create(req.body);

    user.password = undefined;

    return res.send({
        user,
        token: generateToken({id:user.id}),
    })

  } catch (err) {
    return res.status(400).send({ error: "Registration failed" });
  }
});

router.post("/authenticate", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(400).send({ error: "User not found" });
  }

  if (!(await bcrypt.compare(password, user.password))) {
    return res.status(400).send({ error: "Password incorrect" });
  }

  user.password = undefined;

  res.send({
    user,
    token:generateToken({ id : user.id }),
  })
});

router.post('forgot_password', async (req,res)=>{
  const {email} = req.body;

  try {
    const user = await User.findOne({email});

    if(!user){
      return res.status(400).send({ error: "User not found" });
    }

    const token = crypto.randomBytes(20).toString('hex');

    const now = new Date();
    now.setHours(now.getHours()+1);

    await User.findByIdAndUpdate(user.id,{
      '$set':{
        passwordResetToken:token,
        passwordResetExpires:now,
      }
    });

    

  } catch (err) {
    return res.status(400).send({error: "Erro on forgot password,try again"});
  }
})

module.exports = (app) => app.use("/auth", router); // Todas as rotas estarão prefixadas com o Auth
