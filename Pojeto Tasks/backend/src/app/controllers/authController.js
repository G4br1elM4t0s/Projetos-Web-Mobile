const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authconfig = require("../../config/auth.json");
const crypto = require("crypto");
const mailer = require("../../modules/mailer");


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

router.post('/forgot_password', async (req,res)=>{
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

    mailer.sendMail({
      to: email,
      from: 'gabrielmatos010203@gmail.com',
      template: 'auth/forgot_password',
      context: {token} //passando as variaveis, ou sejá nestá linha de código estou mandando a variavel token já criada aqui para o meu 'forgot_password'

    }, (err)=>{
        if(err){
          console.log(err)
          return res.status(400).send({error:'Cannot send forgot password, try again'});
        }

        return res.send();
    })

  } catch (err) {
    return res.status(400).send({error: "Erro on forgot password,try again"});
  }

});

router.post('/reset_password', async(req,res)=>{
  const{email, password, token} = req.body;

  try {
      const user = await User.findOne({email})
        .select('+passwordResetToken passwordResetExpires');

        if(!user){
          return res.status(400).send({error: 'User not found'});
        }

        if(token !== user.passwordResetToken){
          return res.status(400).send({error: 'Token invalid'});
        }

        const now = new Date();

        if(now > user.passwordResetExpires){
          return res.status(400).send({error: 'Token expired, generate new token'});
        }

        user.password = password;

        await user.save();

        res.send();
  } catch (err) {
    return res.status(400).send({error: 'Cannot reset password , try again'});
  }

});

module.exports = (app) => app.use("/auth", router); // Todas as rotas estarão prefixadas com o Auth
