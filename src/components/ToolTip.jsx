import React, { useState } from 'react';

const Tooltip = ({ text, style, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block" onMouseEnter={() => setIsVisible(true)} onMouseLeave={() => setIsVisible(false)}>
      {children}

      {isVisible && (
        <div
          className="absolute bottom-full mb-2 w-max px-3 py-1 text-sm font-semibold text-white bg-gray-800 rounded shadow-lg
                     transform -translate-x-1/2 left-1/2 transition-opacity duration-200"
          style={{ opacity: isVisible ? 1 : 0, left: style.left, width: style.width }}
        >
          {text.map((line, index) => (
            <p key={index} className="my-1">
              {line}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
