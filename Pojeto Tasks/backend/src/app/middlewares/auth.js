const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth.json');


module.exports = (req,res,next)=>{ //ou sejá a logica a ser utilizada aqui será... caso o user esteja logado, chamamos o next caso contrario erro

    const authHeader = req.headers.authorization;
    
    if(!authHeader){
        return res.status(401).send({ error : "No token provided"});
    }

    //Formato previsto do token "Bearer" Seguido do hash md5;

    const parts = authHeader.split(" ");

    if(!parts === 2){
        return res.status(401).send({error: "Token error"});
    }

    const [ scheme, token] = parts;
    
    if(!/^Bearer$/i.test(scheme)){// regex para conferir se determinado componente começa com  bearer "!" =  negando "/"para falar que esta começando, o "^"para falar com oque começa a palavra em si "/" para fechar, "i" para falar que é caseSensitive
        return res.status(401).send({error: "Token malformatted"});
    }

    jwt.verify(token, authConfig.secret, (err, decoded)=>{
        if(err) return res.status(401).send({error: "Token invalid"});
        
        req.userId = decoded.id;

        return next();

    });


};