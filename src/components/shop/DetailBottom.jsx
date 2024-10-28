import React from 'react';
import { Link } from 'react-router-dom';

const DetailBottom = ({ id }) => {
  return (
    <div className="fixed bottom-0 flex items-center justify-between w-[600px] bg-white">
      <Link to="/shoppingcart">
        <div className="p-3 flex flex-col justify-center items-center">
          <img className="w-8 mb-1" src="/src/assets/images/shoppingCart_gray.svg" alt="" />
          <span className="text-xs">장바구니</span>
        </div>
      </Link>
      <Link to="/shoppingcart" className="grow">
        <div className="text-primary p-3 mx-2 rounded-2xl text-center border border-primary">장바구니에 담기</div>
      </Link>
      <Link to="#" className="grow">
        <div className="bg-primary text-white p-3 mx-2 rounded-xl text-center">바로 구매하기</div>
      </Link>
    </div>
  );
};

export default DetailBottom;
