const jwt = require('jsonwebtoken')
module.exports.authMiddleware=async(req, res, next)=>{
  
    const {accessToken} =req.cookies;
    const decodeToken=new jwt.verify(accessToken, process.env.SECRET)
    if(!accessToken){
        return res.status(409).json({error:'Please Login First'})
    }else{
        try {
            req.role= decodeToken.role
            req.id =decodeToken.id
            next()
        } catch (error) {
            return res.status(409).json({error:'Please Login '})  
        }
    }

}