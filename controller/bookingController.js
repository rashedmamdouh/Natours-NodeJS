const Tour=require('../Models/tourModel');
const Booking=require('../Models/bookingModel');
const stripe=require('stripe')(process.env.STRIPE_SECRET_KEY);
const handlerFactory=require('../controller/handlerFactory')

exports.getCheckoutSession=async(req,res,next)=>{
    //1) Get the currently booked tour 
    const tour=await Tour.findById(req.params.tourId)
    //2) Create stripe checkout session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
      
        line_items: [
            {
            price_data: {
                currency: 'usd',
                unit_amount: tour.price * 100,
                product_data: {
                    name: `${tour.name} Tour`,
                    description: tour.summary,
                    images: [`https://www.natours.dev/img/tours/${tour.imageCover}`]
                },
            }, 
            quantity: 1,
            }
            ],
        mode: 'payment',
        success_url: `${req.protocol}://${req.get('host')}/my-tours/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,
       // success_url: `${req.protocol}://${req.get('host')}/my-tours`,
        cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
        customer_email: req.user.email,
        client_reference_id: req.params.tourId,
      });
      //3) Create a session as response
      res.status(200).json({
        status:'success',
        session:session
        });

}

exports.createBookingCheckout =async (req, res, next) => {
    try{
  // This is only TEMPORARY, because it's UNSECURE: everyone can make bookings without paying
  const { tour, user, price } = req.query;

  if (!tour | !user | !price) return next();
  await Booking.create({ tour, user, price });

  res.redirect(req.originalUrl.split('?')[0]); //redirect to overview page
}catch(err){
    console.log(err);
}
}


exports.getBooking = handlerFactory.getOne(Booking);
exports.getAllBooking = handlerFactory.getAll(Booking);
exports.createBooking =handlerFactory.createOne(Booking);
exports.updateBooking = handlerFactory.updateOne(Booking);
exports.deleteBooking=handlerFactory.deleteOne(Booking);
