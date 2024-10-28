import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CiCircleMinus } from 'react-icons/ci';
import { CiCirclePlus } from 'react-icons/ci';
import DogChew from '../DogChew';
import { IoCloseOutline } from 'react-icons/io5';

const DetailBottom = ({ id }) => {
  const [buyNow, setBuyNow] = useState(false);

  const item = {
    id: 1,
    name: '[잇츄] 오리지널 S 43개입 (4종) 강아지 덴탈껌 대용량 간식 개껌',
    price: 100,
    quantity: 1,
    checked: false,
    image: 'https://static.fitpetcdn.com/prod/images/product/1000031556/S_43%EA%B0%9C%EC%9E%85_xmrari_PRODUCT_LIST.png', // 예시 이미지 URL
  };

  return (
    <>
      <div className="fixed bottom-0 flex items-center justify-between w-[600px] bg-white mt-3">
        <div className="absolute bottom-[83px] bg-white">
          <div className="flex justify-end pt-3 pr-5">
            <IoCloseOutline size={25} />
          </div>
          <li key={1} className="cart-item text-lg list-none">
            <div className="flex items-start">
              <div className="flex grow">
                <img src={item.image} alt={item.name} className="mx-7 cart-item-image w-[150px]" />
                <div className="flex flex-col pr-12">
                  <span className="my-1">{item.name}</span>
                  <span className="flex items-center mb-1">
                    <DogChew />
                    <div className="ml-2 font-bold">{item.price.toLocaleString()}개</div>
                  </span>
                  <div className="flex items-center">
                    <button onClick={() => handleQuantityChange(item.id, -1)}>
                      <CiCircleMinus size={25} color={'#2589E7'} />
                    </button>
                    <span className="mx-2">{item.quantity}</span>
                    <button onClick={() => handleQuantityChange(item.id, 1)}>
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
            <span className="font-bold">000개</span>
          </div>
        </div>

        <Link to="/shoppingcart">
          <div className="p-3 flex flex-col justify-center items-center">
            <img className="w-8 mb-1" src="/src/assets/images/shoppingCart_gray.svg" alt="" />
            <span className="text-xs">장바구니</span>
          </div>
        </Link>

        {buyNow ? (
          <div className="flex grow">
            <Link to="#" className="grow">
              <div className="bg-primary text-white p-3 mx-2 rounded-xl text-center">결제하기</div>
            </Link>
          </div>
        ) : (
          <div className="flex grow">
            <Link to="/shoppingcart" className="grow">
              <div className="text-primary p-3 mx-2 rounded-2xl text-center border border-primary">장바구니에 담기</div>
            </Link>
            <button onClick={() => setBuyNow(true)} className="grow">
              <div className="bg-primary text-white p-3 mx-2 rounded-xl text-center">바로 구매하기</div>
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default DetailBottom;
