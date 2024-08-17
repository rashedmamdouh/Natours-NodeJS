const mongoose =require('mongoose');

const bookingSchema=new mongoose.Schema({

user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:[true,'Booking User is Must']
},
tour:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Tour',
    required:[true,'Booking Tour is Must']
},
price:{
    type:Number,
    required:[true,'Price is Must']
},
createdAt:{
    type:Date,
    default:Date.now()
},
paid:{
    type:Boolean,
    default:true
}
});

bookingSchema.pre(/^find/,function(next){
    this.populate({
        path: "user",
        select: "name email",
    }).populate({
            path:'tour',
            select:'name'
    })
    next();
})

//One Book for the user to specific tour
bookingSchema.index({user:1,tour:1},{unique:true});





const Booking=mongoose.model('Booking',bookingSchema);
module.exports = Booking;