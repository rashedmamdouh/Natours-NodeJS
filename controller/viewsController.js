const Tour=require('../Models/tourModel');
const User=require('../Models/userModel');
const Booking=require('../Models/bookingModel');
const Favourite=require('../Models/favToursModel');
const Review=require('../Models/reviewModel');


exports.alerts = (req, res, next) => {
    const { alert } = req.query;
    if (alert === 'booking')
      res.locals.alert =
        "Your booking was successful! Please check your email for a confirmation. If your booking doesn't show up here immediatly, please come back later.";
    next();
  };

exports.getOverview=async (req,res)=>{
    try{
        let filterObj={};
        if(req.user){
            const userBookings=await Booking.find({user:req.user.id})
            const ids=[];
            userBookings.map(el=>{
                ids.push(el.tour.id)
            })
            filterObj={_id:{$nin:ids}}
        }
        // console.log(filterObj)
    const tours=await Tour.find(filterObj)
    return res.status(200).render('overview',{
        title:"All Tours",
        tours:tours
    })
}catch(err){
    return res.status(400).render('error',{
        msg:err.message
        })
}
}

exports.getTour=async(req,res)=>{
    try{
        //Populate the reviews (Guides Populated when find )
        const tour=await Tour.findOne({slug:req.params.slug}).populate({
            path:'reviewsList',
            select:'review rating user'
        })
        // console.log(tour.guides)
        return res.status(200).render('tour',{
            title:tour.name,
            tour:tour
        })
    }catch(err){
        return res.status(400).render('error',{
            msg:"There is no tour with that name"
            })
    }
    }

exports.getLoginForm=async(req,res)=>{
    try{
        res.status(200).render('login')
    }catch(err){
        return res.status(400).render('error',{
            msg:err.message
            })
    }
}

exports.getSignUpForm=async(req,res)=>{
    try{
        res.status(200).render('signup')
    }catch(err){
        return res.status(400).render('error',{
            msg:err.message
            })
    }
}

exports.getAccount=async(req,res)=>{
    try{
        res.status(200).render('account',{
            title:"Your Account",
        })
    }catch(err){
        return res.status(400).render('error',{
            msg:err.message
            })
    }
}

exports.submitUserData=async(req,res)=>{
    try{
        const updatedUser=User.findByIdAndUpdate(req.user.id,{
            name:req.body.name,
            email:req.body.email
        },
        {
            new: true, // Return the updated document
            runValidators: true // Validate the updated fields before saving
        }
    );
    res.status(200).render('account',{
        title:"Your Account",
        user:updatedUser
    })
    }catch(err){
        return res.status(400).render('error',{
            msg:err.message
            })
    }

}

exports.getMyTours=async(req,res,next)=>{
    try{
        const bookings=await Booking.find({user:req.user.id})
        const tourIds=bookings.map(el=>el.tour);
        const tours=await Tour.find({ _id: { $in: tourIds } });
        res.status(200).render('overview',{
            title:"My Tours",
            tours
            })
    }catch(err){
        return res.status(400).render('error',{
            msg:err.message
            })
    }
}

exports.getReviewForm=async(req,res)=>{
    try{
        res.status(200).render('createReview')
    }catch(err){
        return res.status(400).render('error',{
            msg:err.message
            })
    }
}


exports.getMyFavs=async(req,res,next)=>{
    try{
        const favs=await Favourite.find({
            user:req.user.id
        })
        tourIds=[];
        favs.forEach(el=>{
            tourIds.push(el.tour)
        })
        const tours=await Tour.find({ _id: { $in: tourIds } });
        res.status(200).render('overview',{
            title:"My WhishList",
            tours
            })
    }catch(err){
        return res.status(400).render('error',{
            msg:err.message
            })
    }
}


exports.getMyReviews=async(req,res,next)=>{
    try{
        const reviews=await Review.find({
            user:req.user.id
        })
        res.status(200).render('myReviews',{
            title:"My Reviews",
            reviews
            })
    }catch(err){
        return res.status(400).render('error',{
            msg:err.message
            })
    }
}

exports.getadminPanel=async(req,res,next)=>{
    try{
        res.status(200).render('admin/adminPanel',{
            title:"Admin Panel",
            })
    }catch(err){
        return res.status(400).render('error',{
            msg:err.message
            })
    }
}

exports.getUsersadminPanel=async(req,res,next)=>{
    try{
        const users=await User.find();
        res.status(200).render('admin/Users',{
            title:"Users",
            users
            })
    }catch(err){
        return res.status(400).render('error',{
            msg:err.message
            })
    }
}

exports.getToursadminPanel=async(req,res,next)=>{
    try{
        const tours=await Tour.find();
        const guides=await User.find({role:{$in:['guide','lead-guide']}});
        res.status(200).render('admin/Tours',{
            title:"Tours",
            tours,
            guides
            })
    }catch(err){
        return res.status(400).render('error',{
            msg:err.message
            })
    }
}

exports.getReviewsadminPanel=async(req,res,next)=>{
    try{
        const reviews=await Review.find().populate({
            path:'tour',
            select:'name'
        }).populate({
            path:'user',
            select:'name'
        })
        res.status(200).render('admin/Reviews',{
            title:"Reviews",
            reviews
            })
    }catch(err){
        return res.status(400).render('error',{
            msg:err.message
            })
    }
}

exports.getBookingadminPanel=async(req,res,next)=>{
    try{
        const bookings=await Booking.find().populate({
            path:'tour',
            select:'name'
        }).populate({
            path:'user',
            select:'name'
        })
        res.status(200).render('admin/Bookings',{
            title:"Bookings",
            bookings
            })
    }catch(err){
        return res.status(400).render('error',{
            msg:err.message
            })
    }
}