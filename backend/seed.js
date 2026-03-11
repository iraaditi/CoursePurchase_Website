const mongoose = require('mongoose');
const Course = require('./models/Course');

require('dotenv').config();

const dummyCourses = [
    {
        title: "Advanced Data Structures & Algorithms",
description: "Master arrays, trees, graphs, and dynamic programming.",
price: 499,
imageUrl: "https://m.media-amazon.com/images/I/41juhmj6fML._SY445_SX342_FMwebp_.jpg"
    },
    {
        title: "Full-Stack Web Development (MERN)",
description: "Build robust apps using MongoDB, Express, React, Node.",
price: 999,
imageUrl: "https://i.pinimg.com/736x/af/ec/71/afec71040217224f194756321ffbfc00.jpg"
    },
    {
        title: "Advanced Diploma in Computer Applications(ADCA) ",
description: "Build robust apps using MongoDB, Express, React, Node.",
price: 1499,
imageUrl: "https://i.pinimg.com/736x/03/77/6d/03776dd92a060b1878d03f7101794328.jpg"
    }
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
        await Course.deleteMany();
        await Course.insertMany(dummyCourses);
        console.log('Successfully inserted courses');
        mongoose.connection.close();
    } catch(error){
        console.log(error);
    }
};

seedDatabase();