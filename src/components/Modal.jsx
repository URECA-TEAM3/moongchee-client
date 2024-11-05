import React from 'react';

const Modal = ({ isOpen, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
      <div className="bg-white rounded-lg shadow-lg text-center w-80 h-auto p-5">
        <h2 className="text-text">{title}</h2>
        <h3 className="text">{children}</h3>
      </div>
    </div>
  );
};

export default Modal;
