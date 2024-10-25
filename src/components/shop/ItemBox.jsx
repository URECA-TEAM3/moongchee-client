import React from 'react';
import { useNavigate } from 'react-router-dom';

const ItemBox = ({ item }) => {
  const navigate = useNavigate();

  return (
    <div className="border-[1px] rounded-2xl p-3">
      <button onClick={() => navigate(`/shopMain/${item.id}`)} className="flex flex-col">
        <div>
          <img src={item.image} alt="Item Main Image" className="rounded-2xl" />
        </div>

        <div className="w-full mx-auto">
          <div className="text-center p-1 my-3 border-[1px] rounded-2xl flex justify-center">
            <img className="w-4 mr-2" src="/src/assets/images/shoppingCart.svg" alt="장바구니" />
            <span>담기</span>
          </div>
          <div className="pl-2">
            <div className="text-start font-bold break-keep">{item.name}</div>
            <div className="flex mt-1">
              <img className="w-6 mr-2" src="/src/assets/images/dogChew.svg" alt="" />
              <span>{item.price.toLocaleString()}원</span>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
};

export default ItemBox;
