//require functions
const express=require('express');
const morgan=require("morgan");
const exp = require("constants");
const mongoose=require("mongoose");
const appError=require('./appError')
const errorController=require('./controller/errorController')
const rateLimit=require('express-rate-limit');
const helmet=require('helmet');
const mongoSanitize=require('express-mongo-sanitize');
const xssClean=require('xss-clean');
const hpp=require('hpp');
const path=require('path');
const viewRouter=require('./Routers/viewsRouter');
const bookingRouter=require('./Routers/bookingRouter');
const cookieParser=require('cookie-parser')
const compression=require('compression')
const cors=require('cors')


//Using app.use()
//add Express middleware to modify incoming data from request (Middleware between request and respond ) 
const app=express();


app.enable('trust proxy')
//PUG VIEWS SETUP
app.set('view engine','pug');
app.set(path.join(__dirname,'views'));



//Local Connection (No Atlas)
// mongoose.connect(process.env.LOCAL_DB)
// .then(()=>{console.log("Mongoose Connection Successfull")});

const DB=process.env.DATABASE.replace("<PASSWORD>",process.env.DATABASE_PASSWORD);
mongoose.connect(DB)
.then(()=>{console.log("Mongoose Connection Successfull")})


//Environment Variables
//console.log("Environment :" ,process.env.NODE_ENV)

// if(process.env.NODE_ENV==='development'){
//     app.use(morgan("dev"))
// }


/*
// Add to the middleware between R/R
app.use((req,res,next)=>{
    console.log("Hello From The Middleware Between The Request And The Respond.")
    next();
})
app.use((req,res,next)=>{
    req.requestTime=new Date().toString();
    next();
})*/



//Allowing acess API from other websites
app.use(cors());//For Simple Requests(GET, POST)
// Access-Control-Allow-Origin (Allow specific websites only)
// app.use(cors({
//   origin: 'https://www.natours.com'
// }))
app.options('*', cors()); //For Non Simple Requests
// app.options('/api/v1/tours/:id', cors());


//set security HTTP headers
app.use( helmet({ contentSecurityPolicy: false }) );
//Parse the data from the body to req.body
app.use(express.json({
    limit:'10kb'
}));
app.use(express.urlencoded({extended:true,limit:'10kb'}))
// Parse the data from Cookies
app.use(cookieParser());

//Data sanitization against NoSQL query injection
app.use(mongoSanitize())
//Data sanitization against XSS
app.use(xssClean())
//Prevent parameter pollution
app.use(hpp());
const limiter=rateLimit({
    max:100,
    windowMs:60*60*1000, //max 100 request from the same IP in one hour
    message: "Too much request from this IP try again in one hour !"
})
app.use('/api',limiter)
//Serving Static files
app.use(express.static(path.join(__dirname,'public')))

app.use(compression())
// Test middleware
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    //console.log(req.cookies);
    next();
  });


//
//  
//Controller Function ===> Add it to the Router MiddleWare ===> Add the middleware router in app.use()
//Require our Routers
tourRouter=require('./Routers/TourRouter')
userRouter=require('./Routers/UserRouter')
reviewRouter=require('./Routers/reviewRouter')


//Attach our Routers to Specific Routes in the Middleware
app.use('/',viewRouter)
app.use('/api/v1/tours',tourRouter)
app.use('/api/v1/users',userRouter)
app.use('/api/v1/reviews',reviewRouter)
app.use('/api/v1/bookings', bookingRouter);


//Router Handler
app.all('*',(req,res,next)=>{
    // res.status(404).json({
    //     status:'fail',
    //     message:`This Route (${req.originalUrl}) Does Not Exist`
    //     })

    //Creating Global Error for this situation
        // const err=new Error(`This Route (${req.originalUrl}) Does Not Exist`); //err.message
        // err.status='fail';
        // err.statusCode=404;  //Not Found
        // next(err);
        next(new appError(`This Route (${req.originalUrl}) Does Not Exist`),'404');

});


//Global Error Handler (controller) ===> callback function take the error occured (in all express app pathes) and return the respond
app.use(errorController)



module.exports=app;


