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
router.get('/ReviewForm/:tourId', authController.protect,authController.isAllowedToReview, viewsController.getReviewForm);
router.get('/reviewUpdateForm/:tourId', authController.protect, viewsController.getReviewForm);

router.post('/submit-user-data', authController.protect, viewsController.submitUserData);

router.get(
    '/my-tours',
    bookingController.createBookingCheckout,
    authController.protect,
    viewsController.getMyTours
  );

router.get(
    '/my-fav',
    authController.protect,
    viewsController.getMyFavs
  );

  router.get(
    '/my-reviews',
    authController.protect,
    viewsController.getMyReviews
  );
  
router.get('/adminPanel',authController.protect,authController.restrictTo('admin'),viewsController.getadminPanel);
router.get('/adminPanel/users',authController.protect,authController.restrictTo('admin'),viewsController.getUsersadminPanel);
router.get('/adminPanel/tours',authController.protect,authController.restrictTo('admin'),viewsController.getToursadminPanel);
router.get('/adminPanel/reviews',authController.protect,authController.restrictTo('admin'),viewsController.getReviewsadminPanel);
router.get('/adminPanel/bookings',authController.protect,authController.restrictTo('admin'),viewsController.getBookingadminPanel);



module.exports=router;
