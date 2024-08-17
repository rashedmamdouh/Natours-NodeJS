const express = require("express");
const tourController = require("../controller/tourController");
const authController=require("../controller/authController")
const reviewRouter=require("../Routers/reviewRouter")
const favController=require('../controller/favContoller');


const router = express.Router();

//nested routes (tours/657579/reviews)
router.use('/:tourId/reviews',reviewRouter)

router.route("/monthly-plan/:year")
    .get(authController.protect,authController.restrictTo('admin','lead-guide'),tourController.getMonthlyPlan);

router.route("/tours-stats")
    .get(tourController.getTourStatus);

router.route("/top-5-cheap")
    .get(tourController.top5Cheap, tourController.getAllTours);

router.route("/")
    .get(tourController.getAllTours)
    .post(authController.protect,authController.restrictTo('admin','lead-guide'),tourController.createTour);

router.route("/:id")
    .get(tourController.getTour)
    .patch(authController.protect,authController.restrictTo('admin','lead-guide'),
    tourController.uploadTourImages, tourController.resizeTourImages, tourController.updateTour)
    .delete(authController.protect,authController.restrictTo('admin','lead-guide'),tourController.deleteTour);


//(/tours-within/233/center/-40,45/unit/mi)
router.route("/tours-within/:distance/center/:latlng/unit/:unit")
    .get(tourController.getToursWithin)

router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);


router.post('/addtofav/:tourId', authController.protect, favController.addToFav); 
router.post('/removefromfav/:tourId', authController.protect, favController.removeFromFav); 
router.get('/:tourId/favorite-status',authController.isLoggedIn, favController.checkFavoriteStatus);

module.exports = router;
