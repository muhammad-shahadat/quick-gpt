import stripe from "../configs/stripe.js";
import Payment from "../models/Payment.js";
import User from "../models/User.js";




export const handleStripeWebhook = async (req, res) => {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET_KEY;
    const sig = req.headers['stripe-signature'];
    let event;

    
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.error(`⚠️ Webhook signature verification failed: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    
    try {
        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object;
                
                
                const payment = await Payment.findOne({ stripeSessionId: session.id });

                if (session.metadata.userId && payment && payment.status !== 'paid') {
                    
                    payment.status = 'paid';
                    payment.transactionId = session.payment_intent;
                    payment.paidAt = new Date();
                    await payment.save();

                    
                    await User.findByIdAndUpdate(payment.user, {
                        $inc: { credits: payment.credits }
                    });

                    console.log(`✅ Success! Added ${payment.credits} credits to User ${payment.user}`);
                }
                break;
            }

            case 'payment_intent.payment_failed':
                console.log('❌ Payment failed for:', event.data.object.id);
                break;
            
            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        res.json({ received: true });

    } catch (dbError) {
        
        console.error(`❌ Database/Server Error: ${dbError.message}`);
        return res.status(500).json({ error: "Internal Server Error during webhook processing" });
    }

};