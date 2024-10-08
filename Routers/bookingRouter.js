const express = require('express');
const bookingController = require('./../controller/bookingController');
const authController = require('./../controller/authController');

const router = express.Router();

router.use(authController.protect);

router.get('/checkout-session/:tourId',authController.BookedBefore, bookingController.getCheckoutSession);
router.route('/')
    .get(bookingController.getAllBooking)
    .post(bookingController.createBooking);

router.use(authController.restrictTo('admin','guide'));

router.route('/:id')
    .get(bookingController.getBooking)
    .patch(bookingController.updateBooking)
    .delete(bookingController.deleteBooking)

module.exports=router