const express = require("express");
const reviewController = require("../controller/reviewController");
const authController=require("../controller/authController")

const router = express.Router({mergeParams:true});

router.use(authController.protect)


router.route("/")
.get(reviewController.getAllReviews)

router.route("/createReview/:tourId")
.post(authController.restrictTo('user'),reviewController.setUserTourIds,authController.isAllowedToReview,reviewController.createReview)

router.route("/:id")
.get(reviewController.getReview)
.delete(authController.restrictTo('user','admin'),reviewController.deleteReview)
.post(authController.restrictTo('user','admin'),reviewController.updateReview)
module.exports = router;