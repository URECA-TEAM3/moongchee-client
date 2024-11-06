import React, { useState, useEffect, useRef } from 'react';

const Dropdown = ({ label, options, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    onSelect(option);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="start flex justify-center items-center flex-col w-full">
      <div ref={dropdownRef} className="relative text-left inline-block w-full">
        <div className="w-full">
          <button
            onClick={toggleDropdown}
            type="button"
            className="inline-flex justify-center w-full rounded-lg border border-divider px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:border-gray-300 focus:outline-none"
          >
            {label}
          </button>
        </div>

        {isOpen && (
          <div className="origin-top-right absolute right-0 mt-2 w-full z-10 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5">
            <div className={`py-1 overflow-y-scroll ${options.length !== 0 ? 'h-[300px]' : ''}`}>
              {options.map((option, index) => (
                <a
                  key={index}
                  href="#"
                  className="flex justify-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => handleOptionClick(option)}
                >
                  {option}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dropdown;
