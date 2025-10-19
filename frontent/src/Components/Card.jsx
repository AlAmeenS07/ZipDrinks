import React from 'react';
import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Card = ({ id, image, name, category, price, }) => {

    const navigate = useNavigate()

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 hover:shadow-xl duration-300 w-full max-w-xs"
            onClick={()=> navigate(`/products/${id}`)}>
            {/* Image Container */}
            <div className="relative bg-gray-50 h-56 flex items-center justify-center p-4">
                <img
                    src={image}
                    alt={name}
                    className="h-full w-auto object-contain"
                />
            </div>

            {/* Card Content */}
            <div className="p-4">
                {/* Product Name */}
                <h3 className="text-gray-800 font-semibold text-lg mb-2 truncate">
                    {name}
                </h3>

                <h5 className="text-gray-800 font-semibold text-sm mb-2 truncate">
                    {category}
                </h5>


                {/* Price and Cart Button */}
                <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-gray-900">
                        ₹{price.toFixed(2)}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Card