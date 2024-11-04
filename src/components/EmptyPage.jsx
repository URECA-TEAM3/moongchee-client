import React from 'react';

const EmptyPage = ({message, buttonText, onButtonClick}) => {
    return (
        <div className="mb-20 grow flex flex-col items-center justify-center text-xl font-bold">
            <img className="w-1/2 " src="/src/assets/images/black-curve.png" alt="" />
            <div className="py-8">{message}</div>
            <button onClick={onButtonClick} className="w-6/12 mx-auto bg-primary text-white p-3 mx-2  rounded-lg text-center">
                {buttonText}
            </button>
        </div>
    )
};

export default EmptyPage;