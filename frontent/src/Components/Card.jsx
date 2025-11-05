import React from 'react';
import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Card = ({ id, image, name, category, price, salePrice, appliedOffer , quantity }) => {

    const navigate = useNavigate()

    return (
        <div className="relative bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-102 hover:shadow-xl duration-300 w-full max-w-xs"
            onClick={() => navigate(`/products/${id}`)}>

            {appliedOffer && (
                <span className="absolute top-2 right-2 z-50 bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded-lg shadow-sm">
                    {appliedOffer}
                </span>
            )}

            <div className="relative bg-gray-50 h-56 flex items-center justify-center p-4">
                <img
                    src={image}
                    alt={name}
                    className="h-full w-auto object-contain"
                />
            </div>

            <div className="p-4">

                <h3 className="text-gray-800 font-semibold text-lg mb-2 truncate">
                    {name}
                </h3>

                <h5 className="text-gray-800 font-semibold text-sm mb-2 truncate">
                    {category}
                </h5>

                <div className="flex items-center justify-start">
                    <span className="text-xl font-bold text-gray-900">
                        ₹{salePrice.toFixed(2)}
                    </span>
                    <span className="text-md line-through text-gray-700 ms-4 mt-1">
                        ₹{price.toFixed(2)}
                    </span>
                    { quantity <= 0 ? (
                        <span className='text-red-500 mt-1 ms-2'>Stock out</span>
                    ) : ""}
                </div>
            </div>
        </div>
    );
};

export default Card