const mongoose=require("mongoose");
const validator=require("validator");
const bcrypt=require('bcryptjs');
const crypto=require('crypto');
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Tell us your name']
        },
    email:{
        type:String,
        required:[true,'Tell us your email'],
        unique:[true,'Email already in use'],
        lowercase:true,
        validate:[validator.isEmail,'Provide a valid Email']
    },
    role:{
        type:String,
        enum:['user','guide','lead-guide','admin'],
        default:'user'
       
    },
    photo:{
        type:String,
         default: 'default.jpg'
    },
    password:{
        type:String,
        required:[true,'Please provide the password'],
        minlength:8,
        select:false
    },
    confirmPassword:{
        type:String,
        required:[true,'Please confirm the password'],
        validate:{ //Will not work if use  User.update or User.findByIdAndUpdate, ...
            validator:function(el){
                return el===this.password
            }
        }
    },
    passwordChangetAt:Date,
    encryptedResetToken:String,
    encryptedResetTokenExp:Date,

    twoFactorCode: String,
});


userSchema.pre('save',async function(next){
   //Before save in DB
   //If the modification not in the password field don't change the encryption
    if (!this.isModified('password')) return next();
   //Else
    this.password=await bcrypt.hashSync(this.password,12);
    this.confirmPassword=undefined // reset the confirmPassword 
    next();
    
});

userSchema.pre('save',async function(next){
     if (!this.isModified('password')||this.isNew) return next();
     this.passwordChangetAt=Date.now()-1000; //to be always < signin token generated
     next();
     
 });

//Create Function use for the the document (instance)
//Copmare the entered password with the decrypted user password in DB
userSchema.methods.correctPassword = async function(candidatePassword, userPassword){
return await bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if (this.passwordChangedAt) {
      const changedTimestamp = parseInt(
        this.passwordChangedAt.getTime() / 1000,
        10
      );
  
      return JWTTimestamp < changedTimestamp;
    }
}

userSchema.methods.createResetTokenPassword=function(){
    // store the encrypted token in the db and the normal resetTokentoken send to user to compare
    const resetToken=crypto.randomBytes(32).toString('hex');//create
    this.encryptedResetToken=crypto.createHash('sha256').update(resetToken).digest('hex');//encrypt
    this.encryptedResetTokenExp=Date.now()+10*60*1000;
    return resetToken;
};

  
// Create model Class
const User=mongoose.model('User',userSchema);
module.exports=User;
