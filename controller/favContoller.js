const Tour=require('../Models/tourModel');
const User=require('../Models/userModel');
// const Booking=require('../Models/bookingModel');
const Favourite=require('../Models/favToursModel');

exports.addToFav=async(req,res)=>{
    try{
        const data=await Favourite.create({
            user:req.user,
            tour:req.params.tourId
        })
        res.status(201).json({status:"success",message:'Tour added to favourite',data})
    }catch(err){
        return res.status(400).render('error',{
            msg:err.message
            })
        }
}

exports.removeFromFav=async(req,res)=>{
    try{
        const data=await Favourite.deleteOne({
            user:req.user,
            tour:req.params.tourId
        })
        
        res.status(201).json({status:"success",message:'Tour deleted from favourite',data})
    }catch(err){
        return res.status(400).render('error',{
            msg:err.message
            })
        }
}


exports.checkFavoriteStatus = async (req, res) => {
    try {
       // console.log(req.params.tourId,req.user.id)
        const tourId = req.params.tourId;
        const userId = req.user.id; 

        const favorite = await Favourite.findOne({ tour: tourId, user: userId });
        res.status(200).json({
            status: 'success',
            isFavorited: !!favorite  //Convert To Bool
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message
        });
    }
};
