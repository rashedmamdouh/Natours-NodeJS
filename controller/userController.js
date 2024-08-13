
const User = require('../Models/userModel');
const appError = require('../appError');
const handlerFactory=require('../controller/handlerFactory')
const multer=require('multer');
const sharp=require('sharp');



exports.getAllUsers = async (req, res, next) => {
    const users = await User.find();
  
    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users
      }
    });
  };
  



  // const multerStorage=multer.diskStorage({
//   //Destination and Filename
//   destination:(req,file,cb)=>{
//     cb(null,'public/img/users');
//   },
//   filename:(req,file,cb)=>{
//     //user-id-timestep
//     const ext=file.mimetype.split('/')[1];
//     cb(null,`user-${req.user.id}-${Date.now()}.${ext}`);
//   }
// })

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
//Upload the image to memory
const upload=multer({
  storage:multerStorage,
  fileFilter:multerFilter
});
exports.uploadUserFile=upload.single('photo')

//Image Preprocessing then Desk Storage
exports.resizeUserPhoto=async(req,res,next)=>{
  if(!req.file) return next();
  req.file.filename=`user-${req.user.id}-${Date.now()}.jpeg`

  await sharp(req.file.buffer)  //Await to stop the excusion till this end
    .resize(500,500).toFormat('jpeg')
    .jpeg({quality:90})
    .toFile(`public/img/users/${ req.file.filename}`)
  next()
}



  const filterObj=(obj,...allowedFields)=>{
    const newObj={};
    Object.keys(obj).forEach(el=>{
      if(allowedFields.includes(el)) newObj[el]=obj[el]
    })
    return newObj;
  }

  exports.UpdateMe=async (req,res,next)=>{
    try{
      // console.log(req.file)

        //Update the User
        const filteredBody=filterObj(req.body,'name','email');
        if(req.file) filteredBody.photo=req.file.filename
        
        const updatedUser=await User.findByIdAndUpdate(req.user.id,filteredBody,{
          new:true,
          runValidators:true
        })

        res.status(200).json({
          status: 'success',
          data: {
            updatedUser
          }
        });

    }catch(err){
        return next(new appError(err.message, 500));
    }
}

exports.DeleteMe=async (req,res,next)=>{
  try{

    //check the user
    const user = await User.findById(req.user._id).select('+password');

     // check its current password 
                
     if(!(await user.correctPassword(req.body.currentPassword,user.password))){
     return next(new appError("Incorrect password", 400))
                  }
      // Soft delete the user by setting active to false
      // await User.findByIdAndUpdate(req.user.id, {
      //   active: false
      // });

       //Hard Delete the User
       await User.findByIdAndDelete(req.user.id,{
        active:false
      });


      res.status(200).json({
        status: 'success',
      });

  }catch(err){
      return next(new appError(err.message, 500));
  }
}


exports.getMe=async(req,res,next)=>{
  req.params.id=req.user.id;
  next();
}

  
exports.getUser = handlerFactory.getOne(User);
exports.createUser =handlerFactory.createOne(User);
exports.updateUser = handlerFactory.updateOne(User);
exports.deleteUser=handlerFactory.deleteOne(User);
