require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const Course = require('./models/Course');

const paymentRoutes = require('./routes/paymentRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

// Mount our external routes
app.use('/api/payment', paymentRoutes);

mongoose.connect(process.env.MONGO_URI).
then(()=> console.log('Successfully conneced to MongoDB'))
.catch((err)=> console.error('Mongodb connection error:', err));

app.get('/api/courses',async(req,res)=> {
    try{
        const courses = await Course.find();
        res.status(200).json({success: true, courses});
    }catch(error){
        res.status(500).json({success: false, message: "failed to fetch courses"});
    }
});

app.get('/api/getkey', (req, res) => {
    res.status(200).json({ key: process.env.RAZORPAY_KEY_ID });
});

app.get('/',(req,res) => {
    res.send('Server running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log(`Server is listening on port ${PORT}!`);
});