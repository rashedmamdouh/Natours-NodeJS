const express = require("express");
const reviewController = require("../controller/reviewController");
const authController=require("../controller/authController")

const router = express.Router({mergeParams:true});

router.use(authController.protect)

//POST(tours/657579/reviews)
router.route("/")
.get(reviewController.getAllReviews)
.post(authController.restrictTo('user'),reviewController.setUserTourIds,reviewController.createReview);

router.route("/:id")
.get(reviewController.getReview)
.delete(authController.restrictTo('user','admin'),reviewController.deleteReview)
.patch(authController.restrictTo('user','admin'),reviewController.updateReview)
module.exports = router;