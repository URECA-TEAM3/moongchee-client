import React from 'react';

const DetailBottom = () => {
  return (
    <div className="fixed bottom-0 flex items-center justify-between w-[600px] bg-white">
      <div className="p-3 flex flex-col justify-center items-center">
        <img className="w-8 mb-1" src="/src/assets/images/shoppingCart_gray.svg" alt="" />
        <span className="text-xs">장바구니</span>
      </div>
      <div className="text-primary grow p-3 mx-2 rounded-2xl text-center border border-primary">장바구니에 담기</div>
      <div className="bg-primary text-white grow p-3 mx-2 rounded-xl text-center">바로 구매하기</div>
    </div>
  );
};

export default DetailBottom;
