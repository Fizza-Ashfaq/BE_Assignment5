const jwt=require('jsonwebtoken');

const authentication = (req,res) => {
    const headers = req.headers.authentication;
    const token = headers.split(' ')[1];
    try{
        const verified=jwt.verify(token,process.env.JWT_key);
        req.user=verified;
    }
    catch(error){
        res.status(403).send('invalid token');
    }

}
module.exports=authentication;
