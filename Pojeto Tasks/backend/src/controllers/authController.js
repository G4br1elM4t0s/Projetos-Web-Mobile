const express = require('express');
const  User = require('../models/User');
const bcrypt = require('bcryptjs')

const router = express.Router();

router.post('/register', async (req,res)=>{
    const {email} = req.body;


    try{
        if(User.findOne({email})){
            return res.status(400).send({error:"User already exists"})
        }

        const user = await User.create(req.body);

        user.password = undefined

        res.json(user);
    }catch(err){
        return res.status(400).send({error: 'Registration failed'});
    }
});


router.post('/authenticate', async(req,res)=>{
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if(!user){
        return res.status(400).send({error:"User not found"});
    }

    if(!await bcrypt.compare(password,user.password)){
        return res.status(400).send({error:"Password incorrect"});
    }

    user.password = undefined

    res.send({user});

});


module.exports = app => app.use("/auth",router);// Todas as rotas estarão prefixadas com o Auth