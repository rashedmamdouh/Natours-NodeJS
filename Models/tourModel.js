const mongoose=require("mongoose");
const slugify = require('slugify');

// Schema added to the model (Constraints && data)
const tourSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Tour Must Has a Name"],
        unique:true,
        trim:true,
        //validate:[validator.isAlpha, "Tour name must be characters only "],
        maxlength:[40, "A tour name must't exceed 40 characters"],
        minlength:[10, "A tour name must exceed 10 characters"]
    },
    ratingsAverage:{
        type:Number,
        default:4.5,
        max:5,
        min:0,
        set:val=>Math.round(val*10)/10,
        default:0
    },
    ratingsQuantity:{
        type:Number,
        default:0
    },
    slug: String,
    price:{
        type: Number,
        required:[true,"Tour should be Has a Price"]
    },
    priceDiscount:{
        type:Number,
        validate:{
       validator: function(val){
                    return val<= this.price
                    },
        message:"Discount Price should be below the Regular price "
                }
    },
    duration:{
        type: Number,
        required:[true,"Tour Must Has a duration"]
    },
    maxGroupSize:{
        type: Number,
        required:[true,"Tour Must Has a maxGroupSize"]
    },
    difficulty:{
        type: String,
        required:[true,"Tour Must Has a difficulty"],
        // enum:['easy','medium','difficult']
        enum:{
            values:['easy','medium','difficult'],
            message: 'Use either easy or medium or difficult'
            }
    },
    summary:{
        type:String,
        trim:true
    },
    description:{
        type:String,
        trim:true
    },
    imageCover:{
        type:String,
        default: 'default.jpg'
    },
    images:[String],
    createdAt:{
        type:Date,
        default:Date.now(),
        select:false
    },
    startDates:[Date],
    secretTour:{
            type:Boolean,
            default:false
    },
    //Embedded Modeling
    startLocation:{
        type:{
            type:String,
            default:'Point',
            enum:['Point']
        },
        coordinates:[Number],
        adress:String,
        description:String,
    },
    locations:[{
        type:{
            type:String,
            default:'Point',
            enum:['Point']
        },
        coordinates:[Number],
        adress:String,
        description:String,
        day:Number
    }],
    guides:[ //Users Obj Array
        {
        type:mongoose.Schema.ObjectId,
         ref:'User'
        }],
  
},
{
    toJSON :{virtuals:true},
    toObject:{virtuals:true}
});

//Mongoose MIDDLEWARES

//1) Document MIDDLEWARE
tourSchema.pre('save',function(next){
    //console.log("Creating a Document...") //Before the onCreate() and onSave() new document
    next();
});
tourSchema.post('save',function(doc,next){
    //console.log("Document Saved Succesfully : ",doc) //After the onCreate() and onSave() new document
    next();
});




//2) QUERY MIDDLEWARE (Filter)
tourSchema.pre(/^find/,function(next){  
    this.populate({
        path:'guides',  //Show the guides User objects Details (Refrence Modeling)
        select:'-__v -passwordChangetAt' //unselect
    });;
    next();
})

tourSchema.pre(/^find/,function(next){  // all types of find query(find, findOne, findByID,...)
    this.find({secretTour:{$ne:true}}) //Before excute the main query getAllTours مثلا , (this==>query) filter to return only the non secret documents
    this.start=Date.now()
    next();
})
tourSchema.post(/^find/,function(docs,next){ 
    //console.log(docs)
    console.log("Find Query Takes ",Date.now()-this.start," Milliseconds");
    next();
})

// // Aggregation MIDDLEWARE
// tourSchema.pre('aggregate',function(next){
//     //console.log(this.pipeline())             //(this==>aggregation)
//     this.pipeline().unshift({$match:{secretTour:{$ne:true}}}) //unshift===> add at the beggining of the array
//     next();
//         });




// Diplay only can't do operations using it (As Tour.find()) and not stored in the DB
tourSchema.virtual('durationWeeks').get(
    function(){
        return this.duration/7;
        }
)
//Create virtual variable To get all reviews of specific tour (Virtual to populate)
tourSchema.virtual('reviewsList',{ 
    ref:'Review',
    foreignField:'tour',
    localField:'_id'
});
 
tourSchema.pre('save', function(next) {
    this.slug = slugify(this.name, { lower: true });
    next();
  });

// tourSchema.index({price:1});
tourSchema.index({price:1,ratingAverage:-1});
tourSchema.index({ slug: 1 });
tourSchema.index({startLocation:'2dsphere'});

// Create model Class
const Tour=mongoose.model('Tour',tourSchema);
module.exports=Tour;