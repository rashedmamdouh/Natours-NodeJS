
const { request } = require('../app');
const Tour=require('../Models/tourModel');
const catchAsynch=require('../utils/catchAsynch');
const appError=require('../appError')
const errorController=require('../controller/errorController')
const handlerFactory=require('../controller/handlerFactory')
const multer=require('multer');
const sharp=require('sharp');


// Top-5-Cheap MiddleWare (Put in router to excuted befor getAllTours)
exports.top5Cheap=(req,res,next)=>{
    req.query.sort='price';
    req.query.limit='5';
    req.query.fields='name,price,ratingAverage,duration,difficulty,maxGroupSize';
    next();
}

//(127.0.0.1:3000/api/v1/tours?price[gte]=1200&sort=price,-ratingAverage&fields=name,duration,ratingAverage


// exports.getTour=async(req,res,next)=>{
// //const tour=await Tour.findOne({_id:req.params.id});
//     try {
//       // Execute the query and get the result
//       const tour = await Tour.findById(req.params.id).populate("reviewsList");

//       // Send the response if tour is found
//       res.status(200).json({
//         status: 'success',
//         data: {
//           tour,
//         },
//       });
//     } catch (err) {
//       next(new appError("Invalid ID", 404));
//     }
//   };
  

// exports.createTour=async(req,res,next)=>{
//     try{
//     const newTour=await Tour.create(req.body);
//     res.status(201).json({
//         status:'New Tour Created Successfully',
//         data:{
//             tour:newTour
//         }
//     })
// } catch (err) {
//     next(new appError(err.message, 404));
//   }
// };

// exports.updateTour=async(req,res,next)=>{
//         //await Tour.deleteOne(req.params.id,req.body);
//         //await Tour.deleteMany(req.params.id,req.body);
//     try{
//        const updateTour= await Tour.findByIdAndUpdate(req.params.id,req.body); //Update and return the Updated
//         res.status(200).json({ 
//             status:'success',
//             data:{
//                 message:"Updated Tour id = "
//                 +req.params.id
//             }
//         })
//     } catch (err) {
//         next(new appError(err.message,404));
//       }
// }

// exports.deleteTour=async(req,res,next)=>{
//     try{
//         const tour=await Tour.findByIdAndDelete(req.params.id);
//         if(!tour){
//             return next(new appError("User NotExist",404));
//         }
//         res.status(200).json({
//             status:'success',
//             data:{
//                 message:"Delete Tour id = "
//                 +req.params.id
//             }
//         })  
//     } catch (err) {
//         next(new appError(err.message,404));
//       }
// };


  //To  Store in Memory as Buffer for image Processing (Sharp Module)
  const multerStorage=multer.memoryStorage();
  //Filter the image input
  const multerFilter=(req,file,cb)=>{
    if(file.mimetype.startsWith('image')){
      cb(null,true)
    }else{
      cb(new appError("Not Image ! Please upload an Image",400),false)
    }
  }
  const upload=multer({
    storage:multerStorage,
    fileFilter:multerFilter
  });
  
  // upload.array('images',5)
  // upload.single('image')
  exports.uploadTourImages=upload.fields([
    {
      name:'imageCover',
      maxCount:1
    },
    {
      name:'images',
      maxCount:3
    }
  ])
  
  exports.resizeTourImages=async(req,res,next)=>{
    if(!req.files.imageCover | !req.files.images) return next()
//ImageCover
    req.body.imageCover=`tour-${req.params.id}-${Date.now()}-cover.jpeg`
    await sharp(req.files.imageCover[0].buffer)
      .resize(2000,1333)
      .toFormat('jpeg')
      .jpeg({quality:90})
      .toFile(`public/img/tours/${req.body.imageCover}`)
//Images
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async(file,i)=>{
        const filename=`tour-${req.params.id}-${Date.now()}-${i+1}.jpeg`
        await sharp(file.buffer)
        .resize(2000,1333)
        .toFormat('jpeg')
        .jpeg({quality:90})
        .toFile(`public/img/tours/${filename}`)
        req.body.images.push(filename);
      })
  );
    next();
  }



exports.getAllTours=handlerFactory.getAll(Tour);
exports.getTour=handlerFactory.getOne(Tour,{path:'reviewsList'});
exports.createTour=handlerFactory.createOne(Tour);
exports.updateTour=handlerFactory.updateOne(Tour);
exports.deleteTour=handlerFactory.deleteOne(Tour);


exports.getTourStatus=async(req,res,next)=>{
try{
            const stats=await Tour.aggregate([
            {
                $match:{ratingAverage:{$gte:4.5}} //conditon Filter
            },
            // {
            //         $group:{ 
            //             _id:null,
            //             numTours:{$sum:1},
            //             numRatings:{$sum:'$ratingQuantity'},
            //             avgRating:{$avg:'$ratingAverage'},
            //             avgPrice:{$avg:'$price'},
            //             minPrice:{$min:'$price'},
            //             maxPrice:{$max:'$price'},
            //         }
            // },
            {
                $group:{ 
                    _id:{$toUpper:'$difficulty'}, //Group by the Difficulty
                    numTours:{$sum:1},
                    numRatings:{$sum:'$ratingQuantity'},
                    avgRating:{$avg:'$ratingAverage'},
                    avgPrice:{$avg:'$price'},
                    minPrice:{$min:'$price'},
                    maxPrice:{$max:'$price'},
                }
            },
            {
            $sort:{avgRating:1} //1 ===> Ascending
            },
            {
                $match:{_id:{$ne:'EASY'}} 
            },
        ]);
        res.status(200).json({
            status:'success',
            data:{
                stats
            }
        })
    } catch (err) {
        next(new appError(err.message, 404));
      }
 
};

exports.getMonthlyPlan=async(req,res,next)=>{

    try{
        const year=req.params.year*1; //2021
        const plan=await Tour.aggregate([
           {
            $unwind:'$startDates' // Every tour with one start date (9*3=27 Tours)
            // if a document have field array , for each element in the array make a document
           },
           {
            $match:{ // Select only the tours with start date in 2021
                startDates:{
                $gte:new Date(`${year}-01-01`),
                $lte:new Date(`${year}-12-31`)
                        }
                  }
           },
           {
            $group:{  //Group tours with same Month together
                _id:{$month:"$startDates"},
                numTours:{$sum:1},
                toursNames:{$push:'$name'}
            }
           },
           {
            //Create new field in the document
            $addFields:{Month:"$_id"}
           },
           {
            //getrid of field
            $project:{_id:0} //1==> show, o==> not show
           },
           {
            $sort:{numTours:-1} // Decsending
           },
           {
            $limit:3
           }
          
        ]);
        res.status(200).json({
            status:'success',
            data:{
                plan
            }
        })
    } catch (err) {
        next(new appError(err.message, 404));
      }
};


//(tours-within/:distance/center/:latlng/unit/:unit)
//(tours-within/233/center/34.089262,-118.033053/unit/mi)

exports.getToursWithin=async (req,res,next)=>{
    try{
        const {distance,latlng,unit}=req.params
        const [lat,lng]=latlng.split(',');
        const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

        if (!lat || !lng) {
            next(
                new appError(
                    'Please provide latitutr and longitude in the format lat,lng.',
                    400
                )
                );
            }

            const tours = await Tour.find({
                startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  })
        res.status(200).json({
            status:'success',
            length:tours.length,
            data:{
                data:tours
            }
        })
    }catch(err){
        next(new appError(err.message,404))
    }
}

exports.getDistances = async (req, res, next) => {
    try{
    const { latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');
  
    const multiplier = unit === 'mi' ? 0.000621371 : 0.001;
  
    if (!lat || !lng) {
      next(
        new appError(
          'Please provide latitutr and longitude in the format lat,lng.',
          400
        )
      );
    }
  
    const distances = await Tour.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [lng * 1, lat * 1]
          },
          distanceField: 'distance',
          distanceMultiplier: multiplier
        }
      },
      {
        $project: {
          distance: 1,
          name: 1
        }
      }
    ]);
  
    res.status(200).json({
      status: 'success',
      data: {
        data: distances
      }
    })
}catch(err){
    next(new appError(err.message,404))
}
  };


