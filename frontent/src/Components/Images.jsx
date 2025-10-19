import { useState } from "react";
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

const Images = ({ images, productName }) => {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="flex gap-4">
      {/* Thumbnail List */}
      <div className="flex flex-col gap-3">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`w-16 h-16 rounded border overflow-hidden ${
              selectedImage === index ? 'border-gray-400' : 'border-gray-200'
            }`}
          >
            <img
              src={img}
              alt={`${productName} ${index + 1}`}
              className="w-full h-full object-cover p-1"
            />
          </button>
        ))}
      </div>

      {/* Main Image with zoom on click */}
      <div className="flex-1 bg-white rounded border border-gray-200 p-8 flex items-center justify-center">
        <Zoom>
          <img
            src={images[selectedImage]}
            alt={productName}
            className="max-h-96 object-contain cursor-pointer"
          />
        </Zoom>
      </div>
    </div>
  );
};

export default Images;
