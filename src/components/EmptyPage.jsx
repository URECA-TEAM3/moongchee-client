import React from 'react';

const EmptyPage = ({ message, buttonText, onButtonClick }) => {
  return (
    <div className="flex flex-col items-center">
      <img className="w-56" src="/assets/images/moongchee.png" alt="" />
      <div className="pb-8 font-bold">{message}</div>
      <button onClick={onButtonClick} className="h-12 bg-primary text-white p-3 px-5 rounded-lg text-center">
        {buttonText}
      </button>
    </div>
  );
};

export default EmptyPage;
