import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/courses');
                const data = await response.json();
                if (data.success) {
                    setCourses(data.courses);
                }
            } catch (error) {
                console.error("Error fetching courses:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    const handlePayment = async (course) => {
        try {

            const keyResponse = await fetch('http://localhost:5000/api/getkey');
            const { key } = await keyResponse.json();

            const orderResponse = await fetch('http://localhost:5000/api/payment/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ courseId: course._id })
            });
            const orderData = await orderResponse.json();

            if (!orderData.success) {
                alert('Failed to create order. Please try again.');
                return;
            }

            const options = {
                key: key, 
                amount: orderData.order.amount, 
                currency: "INR",
                name: "My Course Platform",
                description: `Purchase: ${course.title}`,
                order_id: orderData.order.id,
                handler: async function (response) {

                    const verifyResponse = await fetch('http://localhost:5000/api/payment/verify', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            course_id: course._id
                        })
                    });

                    const verifyData = await verifyResponse.json();
                    
                    if (verifyData.success) {
                        alert("Payment successful! You now have access to the course.");
                    } else {
                        alert("Payment verification failed.");
                    }
                },
                prefill: {
                    name: "John Doe",
                    email: "johndoe@example.com",
                    contact: "9999999999"
                },
                theme: {
                    color: "#3399cc"
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response){
                alert(`Payment failed: ${response.error.description}`);
            });
            rzp.open();

        } catch (error) {
            console.error("Payment error:", error);
            alert("Something went wrong during checkout.");
        }
    };

    if (loading) return <div>Loading courses...</div>;

    return (
        <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
            <h1>Available Courses</h1>
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                {courses.map((course) => (
                    <div key={course._id} style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px', width: '300px' }}>
                        <img 
                            src={course.imageUrl} 
                            alt={course.title} 
                            style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px' }} 
                        />
                        <h2>{course.title}</h2>
                        <p>{course.description}</p>
                        <h3>₹{course.price}</h3>
                        <button 
                            onClick={() => handlePayment(course)}
                            style={{ padding: '10px 20px', backgroundColor: '#3399cc', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                            Buy Now
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default App;