const User=require('../Models/userModel');
const appError=require('../appError')
const jwt=require('jsonwebtoken')
const {promisify}=require('util')
const Email=require('../utils/email')
const crypto=require('crypto');
const Review=require('../Models/reviewModel');
const Booking=require('../Models/bookingModel');
const Tour=require('../Models/tourModel');



//jwt.sign({id:newUser._id},process.env.JWTsecretKey,{expiresIn:process.env.JWT_EXPIRES_IN})
const loginToken=id=>{
    return jwt.sign({id},process.env.JWTsecretKey,{expiresIn:process.env.JWT_EXPIRES_IN})
}

//Create JWT token (as Session carry the information of the user) to send to the user 
const createSendToken=(user,statusCode,req,res)=>{
    const token=loginToken(user._id)
    const cookieOptions ={
        expires:new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES_IN *24*60*60*1000),
        httpOnly:true,
        secure:req.secure || req.headers['x-forwarded-proto']==='https'
             }
    user.password=undefined //Hide the user from shown in the return
    res.cookie('jwt',token,cookieOptions)
    res.status(statusCode).json({
        status:'success',
        token,
    data:{
        user
    }
})
}

exports.logout=(req,res)=>{
    res.cookie('jwt','loggedout',{
        expires:new Date(Date.now()+10*1000),
        httpOnly:true,
});
res.status(200).json({
    status:'success'
})
}

exports.signUp=async(req,res,next)=>{
    try{
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword
          });
        const url = `${req.protocol}://${req.get('host')}/me`;
        //console.log(url);
        await new Email(newUser, url).sendWelcome();
        
        
        createSendToken(newUser,201,req,res)
}   catch (err) {
            next(new appError(err.message, 500));
          }
        
    }

exports.login=async(req,res,next)=>{
    try{
        //1) Check if the User enter Values
        const {email,password}=req.body;
        if(!email||!password){
            return next(new appError("UserName and Password are must", 404))
        }
        
        //2)Check the User Existence
        const user=await User.findOne({email}).select('+password');
        //console.log(await user.correctPassword(password,user.password))
        if(!user || !(await user.correctPassword(password,user.password))){
            return next(new appError("Incorrect Email or Password !", 404));
        }
        
        createSendToken(user,200,req,res)

}   catch (err) {
            return next(new appError(err.message, 500));
          }
        
    }
    //Check session Signin Token Availability
    //For authentication requests
    exports.protect=async(req,res,next)=>{
        try{
            let token;
            if (
              req.headers.authorization &&
              req.headers.authorization.startsWith('Bearer')
            ) {
              token = req.headers.authorization.split(' ')[1];
            } else if (req.cookies.jwt) {
              token = req.cookies.jwt;
            }
          
            if (!token) {
              return next(
                new appError('You are not logged in! Please log in to get access.', 401)
              );
            }
          
            // 2) Verification token
            const decoded = await promisify(jwt.verify)(token, process.env.JWTsecretKey);
          
            // 3) Check if user still exists
            const currentUser = await User.findById(decoded.id);
            if (!currentUser) {
              return next(
                new appError(
                  'The user belonging to this token does no longer exist.',
                  401
                )
              );
            }
          
            // 4) Check if user changed password after the token was issued
            if (currentUser.changedPasswordAfter(decoded.iat)) {
              return next(
                new AppError('User recently changed password! Please log in again.', 401)
              );
            }
          
            // GRANT ACCESS TO PROTECTED ROUTE
            req.user = currentUser;
            res.locals.user = currentUser;
            next();

    }   catch (err) {
                return next(new appError(err.message, 500));
              }
            
        }

        //For All Requests give identity
    exports.isLoggedIn = async (req, res, next) => {
        if (req.cookies.jwt) {
            try {
            // 1) verify token
            const decoded = await promisify(jwt.verify)(
                req.cookies.jwt,
                process.env.JWTsecretKey
            );
        
            // 2) Check if user still exists
            const currentUser = await User.findById(decoded.id);
            if (!currentUser) {
                return next();
            }
            // 3) Check if user changed password after the token was issued
            if (currentUser.changedPasswordAfter(decoded.iat)) {
                return next();
            }
            
            // THERE IS A LOGGED IN USER
            res.locals.user = currentUser; //Add to the locals to be accesed directly in pug files
            req.user = currentUser;
            return next();
            } catch (err) {
                return next();
            }
        }
        next();
        };


exports.restrictTo=(...roles)=>{
        return (req,res,next)=>{
            if(!roles.includes(req.user.role)){
                return next(new appError("You do not have permission to perform this action", 403));
            }
            next();
        }
        
    }

    exports.ForgetPassword=async(req,res,next)=>{
        const user=await User.findOne({email:req.body.email});
        try{
            // Check the user existence
            if(!user){
                return next(new appError("User Not Exist", 404));
            }
            
            //Create passwordResetToken (normal not encrypted token)
            const resetToken=user.createResetTokenPassword(); 

            await user.save({validateBeforeSave:false});

            //Call the resetPassword 
            resetURL=`${req.protocol}://${req.get('host')}/api/v1/users/resetpassword/${resetToken}`;
            await new Email(user,resetURL).sendPasswordReset();

            
            res.status(200).json({
            status:"success",
            message:"Token sent to your Email"
            })
    }   catch (err) {
                user.encryptedResetToken=undefined
                user.encryptedResetTokenExp=undefined
                await user.save({validateBeforeSave:false});
                return next(new appError(err.message, 500));
              }
            
        }

    

    exports.ResetPassword=async(req,res,next)=>{
        try{
            //1) Ckech the user by the token
            encryptedResetToken=crypto.createHash('sha256').update(req.params.token).digest('hex') // encrypt the normal token
            const user=await User.findOne({encryptedResetToken:encryptedResetToken,
                encryptedResetTokenExp:{$gt:Date.now()}})//in the future
            if(!user){
                return next(new appError("Token has been Ended", 400))
            }
            user.password=req.body.password
            user.confirmPassword=req.body.confirmPassword
            user.encryptedResetToken=undefined
            user.encryptedResetTokenExp=undefined
            await user.save();

            createSendToken(user,200,req,res)

    }   catch (err) {
                return next(new appError(err.message, 500));
                }
            
        }


    exports.UpdatePassword=async (req,res,next)=>{
        try{
            //check the user
            const user = await User.findById(req.user._id).select('+password');
            if(!user){
                return next(new appError("User not found", 404))
                }
            // check its current password 
            
            if(!(await user.correctPassword(req.body.currentPassword,user.password))){
                return next(new appError("Incorrect password", 400))
            }
            // Update the password
            user.password=req.body.newpassword
            user.confirmPassword=req.body.confirmPassword
            await user.save()

            createSendToken(user,200,req,res)
            
        }catch(err){
            return next(new appError(err.message, 500));
        }
    }
    

    exports.isAllowedToReview = async (req, res, next) => {
        try {
            const userBookings = await Booking.find({ user: req.user.id });
            const userReviews = await Review.find({ user: req.user.id });
            const tour = await Tour.findById(req.params.tourId);
            let success=false;
            // Use for...of to allow early exit
            for (const book of userBookings) {
                //check if the user purchase in this tour
                if (book.tour.id===req.params.tourId) {
                   success=true;
                }
            }
            if(!success)return next(new appError("Please Book this Tour First", 404));

            //check if the user made a review for the same tour
            for (const review of userReviews) {
                if ((review.tour.id)===(req.params.tourId)) {
                    sucess=false;
                    return next(new appError("Sorry! You Reviewed This Tour Before", 404));
                }
            }
            if(tour.startDates[0]<Date.now())return next();

            next(new appError(err.message, 500));
        } catch (err) {
            next(new appError(err.message, 500));
        }
    };

    exports.BookedBefore=async(req,res,next)=>{
        const { tourId } = req.params;
        const userBookings = await Booking.find({ user: req.user.id });
        const alreadyBooked = userBookings.some(el => el.tour.id === tourId);
        if (alreadyBooked) {
            return res.status(403).render('error', {
                msg: 'You have already booked this tour!'
            });
        }
        next();
    }