import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../Helper/AxiosInstance';

const Banner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [bannerImages , setBannerImages] = useState([])
  
  useEffect(()=>{
    async function getBannerImages(){
      try {

        const { data } = await axiosInstance.get('/api/banner')

        if(data.success){
          setBannerImages(data.banners.filter(b => b.isListed))
        }
        else{
          toast.error(data.message)
        }
        
      } catch (error) {
        toast.error(error?.response?.data?.message)
      }
    }
    getBannerImages()
  },[])

  const prevSlide = () => {
    const isFirst = currentIndex === 0;
    setCurrentIndex(isFirst ? bannerImages.length - 1 : currentIndex - 1);
  };

  const nextSlide = () => {
    const isLast = currentIndex === bannerImages.length - 1;
    setCurrentIndex(isLast ? 0 : currentIndex + 1);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      nextSlide();
    }, 5000);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  return (
    <div className="relative w-full max-w-7xl mx-auto mt-6 px-4">

      <div className="overflow-hidden rounded-lg h-64 md:h-96 relative">
        <img
          src={bannerImages[currentIndex]?.image}
          alt={`slide-${currentIndex}`}
          className="w-full h-full object-cover transition duration-700 ease-in-out"
        />
      </div>

      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-2 shadow-md transition"
      >
        <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-2 shadow-md transition"
      >
        <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {bannerImages?.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-3 h-3 rounded-full ${currentIndex === idx ? 'bg-teal-600' : 'bg-gray-300'} transition`}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;
