const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Course = require('../models/Course');
const Payment = require('../models/Payment');

const router = express.Router();

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post('/checkout', async(req,res)=> {
    try{
        const { courseId } = req.body;
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        const options = {
            amount: course.price * 100,
            currency: "INR",
            receipt: `receipt_order_${courseId}`
        };

        const order = await razorpayInstance.orders.create(options);
        res.status(200).json({ success: true, order });
    } catch(error){
        console.error("Error creating order:", error);
        res.status(500).json({success: false, message: "Something went wrong creating the order"});
    }
});

router.post('/verify', async(req,res) => {
    const {razorpay_order_id, razorpay_payment_id, razorpay_signature, course_id} = req.body;
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto.createHmac('sha256',process.env.RAZORPAY_KEY_SECRET).update(body.toString()).digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if(isAuthentic){
        await Payment.create({
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            course_id
        });
        res.status(200).json({ success: true, message: "Payment successful" });
    }else{
        res.status(400).json({ success: false, message: "Payment verification failed"});
    }
});

module.exports = router;
