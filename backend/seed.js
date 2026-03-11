const mongoose = require('mongoose');
const Course = require('./models/Course');

require('dotenv').config();

const dummyCourses = [
    {
        title: "Advanced Data Structures & Algorithms",
description: "Master arrays, trees, graphs, and dynamic programming.",
price: 499,
imageUrl: "https://instagram.fcok9-1.fna.fbcdn.net/v/t51.29350-15/466743491_1068927828068034_6636374918903584185_n.jpg?stp=dst-jpg_e35_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6InRocmVhZHMuQ0FST1VTRUxfSVRFTS5pbWFnZV91cmxnZW4uMTQ0MHgxNDQwLnNkci5mMjkzNTAuZGVmYXVsdF9pbWFnZS5jMiJ9&_nc_ht=instagram.fcok9-1.fna.fbcdn.net&_nc_cat=106&_nc_oc=Q6cZ2QFW7teyBXl1-ek4W2l9UugZe4TCrWxmW0ld9UNtZ6BYJ_mNCYpouDQElWQZip7BZUM&_nc_ohc=lBr-2vhPOM8Q7kNvwEeMk89&_nc_gid=LMOLH4CtqQIkSBHSEGOcbg&edm=AKr904kBAAAA&ccb=7-5&ig_cache_key=MzQ5OTM2OTMxMTA4NzY0OTE2Ng%3D%3D.3-ccb7-5&oh=00_AfzXYH77coZRGJ2yhCAacI4dk0ZmLon1_rNXChsxQsGNYQ&oe=69B75A82&_nc_sid=23467f"
    },
    {
        title: "Full-Stack Web Development (MERN)",
description: "Build robust apps using MongoDB, Express, React, Node.",
price: 999,
imageUrl: "https://i.pinimg.com/736x/af/ec/71/afec71040217224f194756321ffbfc00.jpg"
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