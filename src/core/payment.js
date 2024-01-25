const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const Order = require('../models/Order');
const catchAsync = require('./catchAsync');
const { validatePaymentVerification } = require('razorpay/dist/utils/razorpay-utils')

const { KEY_ID, KEY_SECRET } = process.env

router.post('/order', catchAsync(async (req, res) => {
    const instance = new Razorpay({
        key_id: KEY_ID,  //need to sign up to get key id and key secret
        key_secret: KEY_SECRET,
    });
    const { amount } = req.body;
    console.log(amount);

    const options = {
        amount: amount * 100,  // amount in the smallest currency unit
        currency: "INR"
    };
    instance.orders.create(options, async function (err, order) {
        if (err) console.log(err);
        // console.log(order)
        await Order.create({
            _id: order.id,
            user: req.user,
            price: order.amount
        })

        res.status(201).json({
            success: true,
            order
        })
    });
}));

router.post('/payment-verify', async (req, res) => {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    const isValid = validatePaymentVerification({
        "order_id": razorpay_order_id,
        "payment_id": razorpay_payment_id
    }, razorpay_signature, KEY_SECRET);

    if (!isValid) {
        return res.json({
            msg: "verification Failed"
        })
    }

    const order = await Order.findById(razorpay_order_id)
    // console.log(order);
    order.paymentStatus = true;
    order.save();
    req.flash('success', 'Your order has been placed successfully!')
    res.redirect('/listing');
})

module.exports = router;