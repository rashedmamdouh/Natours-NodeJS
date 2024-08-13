module.exports=(err,req,res,next)=>{
    err.statusCode=err.statusCode || 500; //Internal Server Error (Global Error)
    err.status=err.status || 'error';

    
    // During development
    const sendErrDev=(err,req,res)=>{
        //API
        if(req.originalUrl.startsWith('/api')){
            return res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack    })
        }
        else{
            //Render Website
            return res.status(err.statusCode).render('error',{
                title: 'Something went wrong',
                msg: err.message
        })
        }
    }

    // During the production phase to the user 
    const sendErrProd=(err,req,res)=>{
       //API
       if(req.originalUrl.startsWith('/api')){
        return res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack    })
    }
        // Operational error 
        if (err.isOperational){
            return  res.status(err.statusCode).render('error',{
                status: err.status,
                message: err.message,
                isOperational:true})
        }
        else{
            //Render Website
            return res.status(err.statusCode).render('error',{
                title: 'Something went wrong',
                msg:"Please Try Again Later"
        })
       
    }
}
    


    if(process.env.NODE_ENV==='development'){
        sendErrDev(err,req,res);
    
    }else if(process.env.NODE_ENV==='production'){
        sendErrProd(err,req,res);
    }
 
}