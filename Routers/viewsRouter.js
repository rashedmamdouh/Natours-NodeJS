const express=require("express");
const router=express.Router()
const viewsController=require('../controller/viewsController');
const authController=require('../controller/authController');
const bookingController=require('../controller/bookingController');

router.get('/', authController.isLoggedIn, viewsController.getOverview);
router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/signup', viewsController.getSignUpForm);
router.get('/me', authController.protect, viewsController.getAccount);
router.get('/createReview/:tourId', authController.protect,authController.isAllowedToReview, viewsController.getReviewForm);

router.post('/submit-user-data', authController.protect, viewsController.submitUserData);

router.get(
    '/my-tours',
    bookingController.createBookingCheckout,
    authController.protect,
    viewsController.getMyTours
  );
module.exports=router;
