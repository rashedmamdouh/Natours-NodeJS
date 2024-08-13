/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';
const stripe = Stripe('pk_test_51PmxFB03M2HpK3naRt4pJl6TfMQbifflc963Q6J3u6cac4yoncwovfkogp9HoTX08NRurcHhTxm8CrlxOBjK3acg00Rnu2L9ya');

export const bookTour = async tourId => {
    //console.log("tourid: ",tourId)
  try { 
    // 1) Get checkout session from API
    const session = await axios(
      `/api/v1/bookings/checkout-session/${tourId}`
    );
    //console.log(session);

    // 2) Create checkout form + chanre credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    //console.log(err);
    showAlert('error', err);
  }
};
