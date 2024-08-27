
const jwt=require('jsonwebtoken')


//jwt.sign({id:newUser._id},process.env.JWTsecretKey,{expiresIn:process.env.JWT_EXPIRES_IN})
const loginToken=id=>{
    return jwt.sign({id},process.env.JWTsecretKey,{expiresIn:process.env.JWT_EXPIRES_IN})
}

//Create JWT token (as Session carry the information of the user) to send to the user 
exports.createSendToken=(user,statusCode,req,res)=>{
    const token=loginToken(user._id)
    const cookieOptions ={
        expires:new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES_IN *24*60*60*1000),
        httpOnly:true,
        secure:req.secure || req.headers['x-forwarded-proto']==='https'
             }
    user.password=undefined //Hide the user from shown in the return
    res.cookie('jwt',token,cookieOptions)
            }