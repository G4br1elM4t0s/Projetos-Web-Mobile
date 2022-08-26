const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mailer  = require('../../modules/mailer');

const authconfig = require('../../config/auth.json')

const User = require('../models/User');

const router = express.Router();

function generateToken(params = {}){
    return jwt.sign(params, authconfig.secret,{//gerador de token
        expiresIn: 86400,
    })
}

router.post('/register', async (req, res) => {
    const {name, email,password} = req.body; // desestruturando a requisição que vem do body para previnir futuros erros de manutenção
    
    const user2 = {
        name,
        email,
        password,
    }

    if(await User.findOne({email:email})){
        return res.status(400).send({error:"User already exists"});
    }

    try{
        const user = await User.create(user2);
        
        user.password = undefined;

        return res.send({
            user,
            token:generateToken({id:user.id})
        });

    }catch(err){
        return res.status(400).send({error : 'Registration failed'});
    }
    


});

router.post('/authenticate',async (req, res)=>{
    const {email, password} = req.body; // desestruturando a requisição que vem do body para previnir futuros erros de manutenção

    const user = await User.findOne({email:email}).select('+password');

    if(!user){
        return res.status(400).send({error:"User not found"});
    }

    if(!await bcrypt.compare(password, user.password)){
        return res.status(400).send({error:"Password incorrect"});
    }

    user.password = undefined;

 

    res.send({
        user, 
        token: generateToken({id : user.id})
    });
})

router.post('/forgot_password', async(req,res)=>{
    const {email} = req.body;

    try {
        const user = await User.findOne({email: email});
        
        if(!user){
            return res.status(400).send({error:"User not found"});
        }

        //apos isso preciso gerar um token para o usuario solicitante de mudar a senha, com um tempo de experição
        const token = crypto.randomBytes(20).toString('hex');

        const now = new Date();
        now.setHours(now.getHours() + 1);

        await User.findByIdAndUpdate(user.id, {
            '$set': { //o set serve para dizer quais campos iremos setar...
                 passwordResetToken: token,
                 passwordResetExpires:now,
            }
        });


        mailer.sendMail({
            to: email,
            from: 'gabrielmatos010203@gmail.com',
            template: 'auth/forgot_password',
            subject: 'Testando o nodemailer',
            context:{ token }, 

        },(err)=>{
            if(err){
                console.log(err);
                return res.status(400).send({error:"Cannot send forgot password email"});
            }

            return res.send();
        })
       


    } catch (err) {
        console.log(err);
        res.status(400).send({ error: 'Erro on forgot password, try again '});
    }
})


router.post('/reset_password', async(req, res)=>{
    const {email, password, token} = req.body;
    
    try{
        const user = await User.findOne({email})
        .select('+passwordResetToken passwordResetExpires');

        if(!user){
            return res.status(400).send({error:"User not found"});
        }

        if(token !== user.passwordResetToken){
            return res.status(400).send({error: "Token ivalid"});
        }

        const now = new Date();

        if(now > user.passwordResetExpires){
            return res.status(400).send({error: "Token expired, generate a new one"});
        }

        user.password = password;

        await user.save();

        res.send(); //para me retorna um Status 200 = Ok
    }catch(err){
        res.status(400).send({ error: 'Cannot reset password, try again '});
    }
    
    
})


module.exports = app => app.use('/auth',router); //sempre chamar o app para não ter multiservidores rodando junto com o atual e colocando tbm um prefix permanente "auth"

