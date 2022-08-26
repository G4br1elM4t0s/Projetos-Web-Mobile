const jwt = require('jsonwebtoken');
const authconfig = require('../../config/auth.json');

module.exports = (req,res,next)=>{

    const authHeader = req.headers.authorization;

    // verificações simples que deixam nosso backend saudavel sem requisitar muito processamento
    
    if(!authHeader){
        return res.status(401).send({error: 'No token provided'});
    }

    const parts = authHeader.split(' ');

    if(!parts.length === 2){
        return res.status(401).send({error: 'Token error'})
    }

    const [ scheme, token ] = parts;

    //formato esperado começa sempre com a palavra Bearer
    if(!/^Bearer$/i.test(scheme)){ //Rejecst
        return res.status(401).send({error: 'Token malformatted'});
    }

    //Após ter passado por verificções mais leves vamos para uma verificação mais pesada

    jwt.verify(token, authconfig.secret, (err, decoded)=>{
        if(err) return res.status(401).send({error: "Token invalido"}); //caso tenha passado pela a verificação de token, e morrido aqui foi porque a verificação de toke aqui verifica se confirma o token do usuario

        req.userId = decoded.id; // porque os paramentros que estamos enviando são um id por isso temos o decoded.id
        
        return next();
    })


}