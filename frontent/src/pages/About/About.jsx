import React from 'react'
import { Package, Truck, Headphones } from 'lucide-react';
import Footer from '../../Components/Footer';

const About = () => {
    return (
        <div>
            <div className="min-h-screen bg-white">

                {/* Main Content */}
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                    {/* Our Story Section */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">Our Story</h1>
                        <p className="text-neutral-600 max-w-2xl mx-auto">
                            We will be everywhere so you when you are there we are also provide selling products for you.
                        </p>
                    </div>

                    {/* Hero Image */}
                    <div className="mb-16 lg:mb-24">
                        <img
                            src="https://images.unsplash.com/photo-1554866585-cd94860890b7?w=1200&h=500&fit=crop"
                            alt="Various beverage bottles"
                            className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-lg shadow-lg"
                        />
                    </div>

                </div>
            </div>
            <Footer />
        </div>
    )
}

export default About
