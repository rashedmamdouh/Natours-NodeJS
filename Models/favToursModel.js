const mongoose=require('mongoose');
const favoriteTourSchema=new mongoose.Schema({
    tour:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Tour',
        required: [true, "Favourite must belong to a tour"],
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: [true, "Favourite must belong to a user"],
    },
    createdAt: {
        type: Date,
        default: Date.now
      }
    });
    

    favoriteTourSchema.index({user:1,tour:1},{unique:true});

    const FavoriteTour = mongoose.model('FavoriteTour', favoriteTourSchema);
    
    module.exports = FavoriteTour;
    