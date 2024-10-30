import React, { useEffect, useState } from 'react';
import { CiCircleMinus } from 'react-icons/ci';
import { CiCirclePlus } from 'react-icons/ci';
import { IoCloseOutline } from 'react-icons/io5';
import DogChew from './DogChew';

const BottomSheet = ({ toggleBottomSheet, productItem, setIsVisible, setProductItem }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleQuantityChange = (id, delta) => {
    setProductItem((prevItem) => ({
      ...prevItem,
      quantity: Math.max(1, (prevItem.quantity || 1) + delta),
    }));
  };

  useEffect(() => {
    setIsAnimating(true);
  }, []);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => setIsVisible(false), 200);
  };

  return (
    <>
      {/* 배경 블러 처리 */}
      <div className="w-[600px] mx-auto fixed inset-0 bg-black bg-opacity-0 backdrop-blur-sm" onClick={toggleBottomSheet}></div>

      <div
        className={`
          ${isAnimating ? 'translate-y-0' : 'translate-y-full'} transform transition-transform duration-300
        absolute bottom-[60px] bg-white w-full shadow-inner pb-10 rounded-t-3xl`}
      >
        <div className="flex justify-end pt-3 pr-5">
          <button onClick={handleClose}>
            <IoCloseOutline size={25} />
          </button>
        </div>
        <li key={productItem.id} className="cart-item text-lg list-none">
          <div className="flex items-start">
            <div className="flex grow">
              <img src={productItem.image} alt={productItem.name} className="mx-7 cart-item-image w-[150px]" />
              <div className="flex flex-col pr-12">
                <span className="my-1">{productItem.name}</span>
                <span className="flex items-center mb-1">
                  <DogChew />
                  <div className="ml-2 font-bold">{productItem.price.toLocaleString()}개</div>
                </span>
                <div className="flex items-center">
                  <button onClick={() => handleQuantityChange(productItem.id, -1)}>
                    <CiCircleMinus size={25} color={'#2589E7'} />
                  </button>
                  <span className="mx-2">{productItem.quantity}</span>
                  <button onClick={() => handleQuantityChange(productItem.id, 1)}>
                    <CiCirclePlus size={25} color={'#2589E7'} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </li>
        <div className="flex justify-end pr-10">
          최종 금액 :
          <div className="mx-2">
            <DogChew />
          </div>
          <span className="font-bold">{productItem.price * productItem.quantity}개</span>
        </div>
      </div>
      <div className="h-[86px]"></div>
    </>
  );
};

export default BottomSheet;
