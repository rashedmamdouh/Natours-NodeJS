const dotenv=require("dotenv");
dotenv.config({path:'./config.env'});
//console.log(process.env);
const app=require("./app.js")
const devdata=require('./dev-data/data/import-dev-data.js')

let port=process.env.PORT;
const server=app.listen(port,()=>{
    //console.log("Server is running on port 3000");
    //devdata.deleteData()
    //devdata.importData()
})

//Outside Express Error Handling
process.on("unhandledRejection",err=>{
    console.log(err.name,err.message);
    console.log("Perform remaining request then Shutting Down .....")
    server.close(()=>{
        process.exit(1);
    })
})
//change DB password

process.on("uncaughtException",err=>{
    console.log(err.name,err.message);
    console.log("Perform remaining request then Shutting Down .....")
    server.close(()=>{
        process.exit(1);
    })
})
// console.log(x)

process.on('SIGTERM', () => {
    console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
    server.close(() => {
      console.log('💥 Process terminated!');
    });
  });
  