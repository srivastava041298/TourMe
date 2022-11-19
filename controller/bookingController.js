const Tour=require('./../tourSchema');
const factory=require('./../controller/handlerFactory');
const Booking=require('./../bookingSchema');
const stripe=require('stripe')('sk_test_51M54WmSBqev7z2FGguPgS8lLchWI2FdYF6dtQWAdQr7swzeQyLOIScMmRcKb1PmIWQ9yIwQQviPMvu1P5NotdGSh00n76Ks9rS');
exports.getCheckoutSession=async(req,res,next)=>{
    try{
     const tour=await Tour.findById(req.params.tourId);
     const session=await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        success_url: `${req.protocol}://${req.get('host')}/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,
        cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
        customer_email: req.user.email,
        client_reference_id: req.params.tourId,
        line_items: [
            {
              quantity: 1,
              price_data: {
                currency: 'inr',
                unit_amount: tour.price*100,
                product_data: {
                  name: `${tour.name} Tour`,
                  description: tour.summary,
                  images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
                },
              },
            },
          ]
        });
     res.status(200).json({
        status:'success',
        session
     });
    }
    catch(err)
    {
      res.status(401).json({
        status:'fail',
        message:err.message
      })
    }
}
exports.createBookingCheckout=async(req,res,next)=>{
    try{
        const { tour, user, price } = req.query;

        if (!tour && !user && !price) return next();
        await Booking.create({ tour, user, price });
      
        res.redirect(req.originalUrl.split('?')[0]);
    } 
    catch(err)
      {
        res.status(401).json({
            status:'fail',
            message:err.message
          })
      }
}


