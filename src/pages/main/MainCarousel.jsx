import React, { useEffect, useState, useRef } from 'react';
import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';

const slides = [
  {
    link: '/main',
    url: '/assets/images/header1.png',
  },
  {
    link: '/main',
    url: '/assets/images/header2.png',
  },
  {
    link: '/main',
    url: '/assets/images/header3.png',
  },
];

const ProductCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef();

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? slides.length - 1 : prevIndex - 1));
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1));
  };

  useEffect(() => {
    timerRef.current = setInterval(handleNextClick, 3000);
    return () => clearInterval(timerRef.current);
  });

  return (
    <div style={{ backgroundImage: `url(${slides[currentIndex].url})` }} className="w-full h-64 bg-no-repeat ease-in-out duration-500">
      <div className="flex justify-between top left w-full h-full">
        <button
          onClick={handlePrevClick}
          className="hover:bg-blue-900/20 text-white w-10 h-full text-center opacity-75 hover:opacity-100 z-10 p-0 m-0 duration-400"
        >
          <ChevronLeftIcon className="h-8 w-20 -ml-5" stroke="currentColor" />
        </button>
        <button
          onClick={handleNextClick}
          className="hover:bg-blue-900/20 text-white w-10 h-full text-center opacity-75 hover:opacity-100 z-10 p-0 m-0 duration-400"
        >
          <ChevronRightIcon className="h-8 w-20 -ml-5" stroke="currentColor" />
        </button>
      </div>
    </div>
  );
};

export default ProductCarousel;
