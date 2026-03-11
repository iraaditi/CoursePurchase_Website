import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/courses`);
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

            const keyResponse = await fetch(`${API_BASE_URL}/api/getkey`);
            const { key } = await keyResponse.json();

            const orderResponse = await fetch(`${API_BASE_URL}/api/payment/checkout`, {
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
                name: "LCC Computer Center",
                description: `Purchase: ${course.title}`,
                order_id: orderData.order.id,
                handler: async function (response) {

                    const verifyResponse = await fetch(`${API_BASE_URL}/api/payment/verify`, {
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
                    name: "Test User",
                    email: "testuser@example.com",
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

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 font-sans pb-12">
            <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600">
                        LCC Computer Center
                    </h1>
                    <div className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors cursor-pointer">
                        My Courses
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 mt-12">
                <div className="mb-10 text-center md:text-left">
                    <h2 className="text-4xl font-bold text-slate-900 tracking-tight mb-3">Explore Premium Courses</h2>
                    <p className="text-lg text-slate-600 max-w-2xl">Level up your skills with our industry-leading curriculums and expert instructors.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {courses.map((course) => (
                        <div 
                            key={course._id} 
                            className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 transition-all duration-300 transform hover:-translate-y-1"
                        >
                            <div className="relative h-48 overflow-hidden">
                                <img 
                                    src={course.imageUrl} 
                                    alt={course.title} 
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                                />
                            </div>
                            
                            <div className="p-6 flex flex-col flex-grow">
                                <h3 className="text-xl font-bold text-slate-900 mb-2 leading-snug line-clamp-2">{course.title}</h3>
                                <p className="text-slate-500 text-sm mb-6 flex-grow line-clamp-3">{course.description}</p>
                                
                                <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Price</span>
                                        <span className="text-2xl font-extrabold text-slate-900">₹{course.price}</span>
                                    </div>
                                    <button 
                                        onClick={() => handlePayment(course)}
                                        className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
                                    >
                                        Enroll Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default App;