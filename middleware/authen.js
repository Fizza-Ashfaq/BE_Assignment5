const jwt=require('jsonwebtoken');

const authentication = (req,res,next) => {
    const authHeader = req.headers.authentication;
    const token = authHeader && authHeader.split(' ')[1];
    if(token==null){
        return res.status(401).send('unauthorized access');
    }
    try{
        jwt.verify(token,process.env.JWT_key,(err, data) => {
            if(err) throw err;
            else{
                req.user=data;
                next();
            }
    
    });
      
    }
    catch(error){
        res.status(403).send('invalid token');
    }
}

function authorization(...allowedRoles)
{
    return(req,res,next)=>{
    console.log('authorization',allowedRoles);
    if(!req.user||!allowedRoles.includes(req.user.role)) 
    {
        return res.status(403).send({message:"forbidden"});
    }
    next();
    }
}
module.exports=
{
    authentication,
    authorization
}
