import { showAlert } from './alert';
const Stripe = require('stripe');

const stripe= Stripe('pk_test_51M54WmSBqev7z2FGmlUs4Sa70XYL87FoslxtK5Tx3ozkW6UVhOsVmII6xlH7P1hdHHt0c9B0CCaKLGjWr2XY0aZa00CGQxWwla');
export const bookTour = async tourId => {
    try {
      // 1) Get checkout session from API
      const session = await axios(
        `http://localhost:3000/api/v1/booking/checkout-session/${tourId}`
      );
      // console.log(session);
  
      // 2) Create checkout form + chanre credit card
    //   await stripe.redirectToCheckout({
    //     sessionId: session.data.session.id
    //   });
    window.location.replace(session.data.session.url);
    } 
    catch (err) {
      // console.log(err);
      showAlert('error', err);
    }
  };