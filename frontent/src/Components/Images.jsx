
import { useState, useRef } from "react";

const Images = ({ images, productName }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const imgRef = useRef(null);

  const zoomLevel = 2.5;

  const handleMove = (e) => {
    const rect = imgRef.current.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setPosition({ x, y });
  };

  return (
    <div className="flex gap-4">

      <div className="flex flex-col gap-3">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`w-16 h-16 rounded border overflow-hidden ${selectedImage === index ? "border-gray-400" : "border-gray-200"
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

      {/* Main image + Popup Zoom */}
      <div className="relative">

        {/* Main Image */}
        <div
          className="relative border border-gray-300 rounded overflow-hidden bg-white
          w-full h-[350px] 
          md:w-[350px] md:h-[350px]
          lg:w-[400px] lg:h-[400px]"
          onMouseEnter={() => setZoom(true)}
          onMouseLeave={() => setZoom(false)}
          onMouseMove={handleMove}
        >

          <img
            ref={imgRef}
            src={images[selectedImage]}
            alt={productName}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Popup Zoom */}
        {zoom && (
          <div
            className="absolute z-50 border border-gray-300 rounded shadow-lg bg-white"
            style={{
              width: "200px",
              height: "200px",
              top: position.y + 20,    // popup below cursor
              left: position.x + 20,   // popup right of cursor
              overflow: "hidden",
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                width: 400 * zoomLevel,
                height: 400 * zoomLevel,
                backgroundImage: `url(${images[selectedImage]})`,
                backgroundSize: `${400 * zoomLevel}px ${400 * zoomLevel}px`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: `-${position.x * zoomLevel - 100}px -${position.y * zoomLevel - 100
                  }px`,
              }}
            ></div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Images;
