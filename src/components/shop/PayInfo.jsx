import React from 'react';
import DogChew from '../DogChew';

const PayInfo = ({ totalPrice, disabled = false }) => {
  return (
    <>
      <h1 className="font-bold text-lg px-10">최종 결제 금액</h1>
      <div className="flex justify-between items-center py-3 px-10">
        <div>총 상품 금액</div>
        <div className="flex items-center">
          <div className="mr-2">
            <DogChew />
          </div>

          <div>{totalPrice}개</div>
        </div>
      </div>
      {!disabled && (
        <div className="flex justify-between items-center py-3 px-10">
          <div>배송비</div>
          <div>무료</div>
        </div>
      )}
      <div className="flex justify-between items-center py-4 bg-paleblue px-10">
        <div className="flex">
          <span className="mr-2">최종 차감 될 </span> <DogChew />
        </div>
        <div className="font-bold">{totalPrice}개</div>
      </div>
    </>
  );
};

export default PayInfo;
