const Razorpay = require('razorpay');

exports.handler = async function(event, context) {
    // Initialize Razorpay with keys from Netlify environment variables
    const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_SECRET,
    });

    const { amount, currency, description } = JSON.parse(event.body);

    // Razorpay order options
    const options = {
        amount: amount * 100, // amount in the smallest unit
        currency: currency,
        receipt: `receipt_${Date.now()}`,
        notes: {
            description,
        },
    };

    try {
        // Create Razorpay order
        const order = await razorpay.orders.create(options);
        return {
            statusCode: 200,
            body: JSON.stringify({ orderId: order.id }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
