// Create Users Router Middleware
const express=require("express")




//Require our Controllers
const userController=require("../controller/userController")
const authController=require("../controller/authController")
const handlerFactory=require("../controller/handlerFactory")

// Create Router
const Router=express.Router()

Router.route('/signup').post(authController.signUp)
Router.route('/login').post(authController.login)
Router.route('/logout').get(authController.logout)

Router.use(authController.protect)
Router.route('/forgetpassword').post(authController.ForgetPassword)
Router.route('/resetpassword/:token').patch(authController.ResetPassword)
Router.route('/updatemypassword').patch(authController.UpdatePassword)
Router.route('/updateme').patch(userController.uploadUserFile,userController.resizeUserPhoto, userController.UpdateMe)
Router.route('/deleteme').delete(userController.DeleteMe)

Router.use(authController.restrictTo('admin'))
Router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

  
  Router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(authController.protect,authController.restrictTo('admin'),userController.deleteUser);

  Router
  .route('/me')
  .get(authController.protect,userController.getMe,handlerFactory.getOne)

module.exports=Router;


