import React from 'react';
import { FaArrowAltCircleUp } from 'react-icons/fa';

const ScrollToTop = ({ scrollContainerRef }) => {
  return (
    <div className="absolute bottom-5 right-5 z-20 bg-white flex flex-col justify-center items-center">
      <button
        onClick={() => {
          if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
      >
        <FaArrowAltCircleUp size={40} />
        <span className="text-xs mt-1">처음으로</span>
      </button>
    </div>
  );
};

export default ScrollToTop;
