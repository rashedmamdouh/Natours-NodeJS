
const appError=require('../appError')
const APIFeatures=require('../utils/apiFeatures');
const catchAsynch=require('../utils/catchAsynch');

exports.deleteOne=Model=>
    async(req,res,next)=>{
    try{
        const doc=await Model.findByIdAndDelete(req.params.id);
        if(!doc){
            return next(new appError("User NotExist",404));
        }
        return res.status(204).json({
            status:'success',
            message:'Delete Done'
        })  
    } catch (err) {
        next(new appError(err.message,404));
      }
};

exports.createOne=Model=>
    async(req,res,next)=>{
        try{
       // console.log(req.body.user,req.body.tour)
        const doc=await Model.create(req.body);
        res.status(201).json({
            status:'success',
            message:"New Creation occured Successfully",
            data:doc
        })
    } catch (err) {
        next(new appError(err.message, 404));
      }
    };
    
exports.updateOne=Model=>
    async(req,res,next)=>{
    try{
       const doc= await Model.findByIdAndUpdate(req.params.id,req.body); //Update and return the Updated
        res.status(200).json({ 
            status:'success',
            message:
              "New Update occured Successfully"
        })
    } catch (err) {
        next(new appError(err.message,404));
      }
};

exports.getOne=(Model,popOptions)=>
    async(req,res,next)=>{
            try {
                let query= Model.findById(req.params.id);
                if(popOptions) query= query.populate(popOptions);
                const doc = await query;

                if(!doc) {
                    return next(new appError("User NotExist",404));
                    }
                res.status(200).json({
                    status: 'success',
                    message:doc
                });
            } catch (err) {
              next(new appError(err.message, 404));
            }
          };
          


exports.getAll=Model=>
    catchAsynch(async(req,res,next)=>{ 
        //FOR SPECIFIC TOUR Reviews 
        let filter ={}
        if (req.params.tourId) filter = { tour: req.params.tourId };
        //console.log(filter)
        const features=new APIFeatures(Model.find(filter),req.query)
        .filter()
        .sort()
        .limiting()
        .pagination()

        const doc=await features.query;
        res.status(200).json({
            status:'success',
            data:{
                //resource:data
                length:doc.length,
               data: doc
               
            }
        })
});