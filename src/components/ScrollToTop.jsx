import React from 'react';
import { FaArrowAltCircleUp } from 'react-icons/fa';

const ScrollToTop = ({ scrollContainerRef }) => {
  return (
    <div className="bg-white rounded-2xl absolute bottom-5 right-12 z-20 flex flex-col justify-center items-center">
      <button
        onClick={() => {
          if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
      >
        <FaArrowAltCircleUp size={40} />
        <span className="text-xs">TOP</span>
      </button>
    </div>
  );
};

export default ScrollToTop;
