const Review=require('../Models/reviewModel');
const handlerFactory=require('../controller/handlerFactory')
const Booking=require('../Models/bookingModel');



// exports.getAllReviews=async(req,res,next)=>{
//     try{
//         //If Get All Reviews for specific tour
//         const filter ={}
//         if (req.body.tour) filter={tour:req.params.tourId}
//         const reviews=await Review.find(filter)
//         if(!reviews){
//             return next(new appError('No reviews found',404))
//         }
//         res.status(200).json({
//             status:"success",
//             reviews})
//     }catch(err){
//         next(new appError(err.message, 404)); 
//     }
// }


// exports.createReview=async(req,res,next)=>{
//     try{
//         //Nested Routes
//         if(!req.body.tour) req.body.tour=req.params.tourId;
//         if(!req.body.user) req.body.user=req.user.id;

//         const review=await Review.create(req.body);
//         if(!review){
//             return next(new appError("Review not created",404))
//         }
//         res.status(200).json({
//             status:"success",
//             review})
//     }catch(err){
//         next(new appError(err.message, 404)); 
//     }
// }



exports.setUserTourIds=async(req,res,next)=>{
    if(!req.body.tour) req.body.tour=req.params.tourId;
    if(!req.body.user) req.body.user=req.user.id;
    next();
}

//CRUD
exports.getAllReviews=handlerFactory.getAll(Review);
exports.createReview=handlerFactory.createOne(Review);
exports.getReview=handlerFactory.getOne(Review);
exports.updateReview=handlerFactory.updateOne(Review);
exports.deleteReview=handlerFactory.deleteOne(Review);


