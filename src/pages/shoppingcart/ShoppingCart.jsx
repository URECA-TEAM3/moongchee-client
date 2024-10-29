import React, { useState } from 'react';
import DogChew from '../../components/DogChew';
import { Link } from 'react-router-dom';
import CartItem from '../../components/shop/CartItem';
import { CiCircleMinus } from 'react-icons/ci';
import { CiCirclePlus } from 'react-icons/ci';

function ShoppingCart(props) {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Product A',
      price: 100,
      quantity: 1,
      checked: false,
      image: 'https://static.fitpetcdn.com/prod/images/product/1000031556/S_43%EA%B0%9C%EC%9E%85_xmrari_PRODUCT_LIST.png', // 예시 이미지 URL
    },
    {
      id: 2,
      name: 'Product B',
      price: 200,
      quantity: 1,
      checked: false,
      image: 'https://static.fitpetcdn.com/prod/images/product/1000031556/S_43%EA%B0%9C%EC%9E%85_xmrari_PRODUCT_LIST.png', // 예시 이미지 URL
    },
    {
      id: 3,
      name: 'Product C',
      price: 150,
      quantity: 1,
      checked: false,
      image: 'https://static.fitpetcdn.com/prod/images/product/1000031556/S_43%EA%B0%9C%EC%9E%85_xmrari_PRODUCT_LIST.png', // 예시 이미지 URL
    },
  ]);

  // 최종 결제 금액 계산
  const calculateTotal = () => {
    return cartItems
      .filter((item) => item.checked) // 체크된 아이템만 필터링
      .reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // 체크박스 핸들러
  const handleCheckboxChange = (id) => {
    setCartItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)));
  };

  // 수량 변경 핸들러
  const handleQuantityChange = (id, delta) => {
    setCartItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item)));
  };

  return (
    <div className="bg-white">
      <div className="px-10 py-6 font-bold text-xl">장바구니</div>
      {/* 장바구니 담긴 상품 조회 */}
      <div className="px-10 mb-10">
        <ul>
          {cartItems.map((item) => (
            <li key={item.id} className="cart-item text-lg my-5">
              <div className="flex items-start">
                <input className="block mt-2" type="checkbox" checked={item.checked} onChange={() => handleCheckboxChange(item.id)} />
                <div className="flex grow ml-5">
                  <img src={item.image} alt={item.name} className="cart-item-image w-[130px]" />
                  <div className="flex flex-col ml-5">
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
          ))}
        </ul>
      </div>

      <div className="border border-t-divider px-10">
        <h1 className="font-bold text-lg mt-10">최종 결제 금액</h1>
        <div className="flex justify-between items-center py-3">
          <div>총 상품 금액</div>
          <div className="flex items-center">
            <div className="mr-2">
              <DogChew />
            </div>
            <div>{calculateTotal().toLocaleString()}개</div>
          </div>
        </div>
        <div className="flex justify-between items-center py-3">
          <div>배송비</div>
          <div>무료</div>
        </div>

        <div className="flex justify-between items-center py-3">
          <div className="flex">
            <span className="mr-2">최종 차감 될 </span> <DogChew />
          </div>
          <div>000개</div>
        </div>
        <div className="flex justify-between items-center py-3">
          <div className="flex">
            <span className="mr-2">나의 현재 </span> <DogChew />
          </div>
          <div>000개</div>
        </div>
        <div className="flex justify-between items-center py-3">
          <div className="flex">
            <span className="mr-2">결제 후 </span> <DogChew />
          </div>
          <div>000개</div>
        </div>

        <Link to="#" className="grow">
          <div className="w-6/12 mx-auto bg-primary my-6 text-white p-3 mx-2 rounded-xl text-center">결제하기</div>
        </Link>
      </div>
    </div>
  );
}

export default ShoppingCart;
