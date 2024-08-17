
import axios from 'axios';
import { showAlert } from './alert';
const stripe = Stripe('pk_test_51PmxFB03M2HpK3naRt4pJl6TfMQbifflc963Q6J3u6cac4yoncwovfkogp9HoTX08NRurcHhTxm8CrlxOBjK3acg00Rnu2L9ya');

export const bookTour = async tourId => {
  try { 
    // 1) Get checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);

    // 2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    if (err.response) {
      const contentType = err.response.headers['content-type'];

      // If response is HTML, render the HTML error page
      if (contentType.includes('text/html')) {
        document.open();
        document.write(err.response.data);
        document.close();
      }else{
        showAlert('error', err);
      }
    }
    };

}

