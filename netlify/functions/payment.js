const Razorpay = require('razorpay');

exports.handler = async function(event, context) {
    const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_API_KEY,
        key_secret: process.env.RAZORPAY_SECRET_KEY,
    });

    const { amount, currency, description } = JSON.parse(event.body);

    const options = {
        amount: amount * 100, // amount in the smallest unit
        currency: currency,
        receipt: `receipt_${Date.now()}`,
        notes: {
            description,
        },
    };

    try {
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
