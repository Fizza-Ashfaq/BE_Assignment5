const jwt=require('jsonwebtoken');

const authentication = (req,res,next) => {
    const authHeader = req.headers.authentication;
    const token = authHeader && authHeader.split(' ')[1];
    try{
        const verified=jwt.verify(token,process.env.JWT_key,(err, data) => {
            if(err) throw err;
            else{
                req.user=data;
            }
            req.user=verified;
            next();
    
    });
      
    }
    catch(error){
        res.status(403).send('invalid token');
    }

}
module.exports=authentication;
