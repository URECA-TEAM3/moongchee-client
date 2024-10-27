import React, { useEffect, useState } from 'react';
import DogChew from '../../components/DogChew';
import { Link } from 'react-router-dom';
import CartItem from '../../components/shop/CartItem';
import { CiCircleMinus } from 'react-icons/ci';
import { CiCirclePlus } from 'react-icons/ci';
import { AiOutlineMinus } from 'react-icons/ai';
import { GoInfo } from 'react-icons/go';
import PayInfo from '../../components/shop/PayInfo';

function ShoppingCart(props) {
  const [totalPrice, setTotalPrice] = useState();
  const [afterPayment, setAfterPayment] = useState();
  const [payment, setPayment] = useState(true);
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: '[잇츄] 오리지널 S 43개입 (4종) 강아지 덴탈껌 대용량 간식 개껌',
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

  // 업데이트된 결제 금액을 계산 후 상태 업데이트
  useEffect(() => {
    const total = calculateTotal();
    setTotalPrice(total);
    setAfterPayment(555 - total);

    setPayment(555 - total >= 0);
  }, [cartItems]);

  return (
    <div className="bg-white">
      <div className="px-10 py-6 font-bold text-xl">장바구니</div>
      {/* 장바구니 담긴 상품 조회 */}
      <div className="px-10 mb-10">
        <ul>
          {cartItems.map((item) => (
            <li key={item.id} className="cart-item text-lg my-5">
              <div className="flex items-start">
                <input className="block mt-2 scale-125" type="checkbox" checked={item.checked} onChange={() => handleCheckboxChange(item.id)} />
                <div className="flex grow">
                  <img src={item.image} alt={item.name} className="mx-7 cart-item-image w-[150px]" />
                  <div className="flex flex-col">
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

      <div className="border border-t-divider">
        <PayInfo totalPrice={totalPrice} />

        <div className="flex justify-between items-start pt-3 px-10">
          <div className="flex">
            <span className="mr-2">나의 현재 </span> <DogChew />
          </div>
          {payment ? (
            <div className="w-24 flex flex-col items-end gap-1">
              <div>555개</div>
              <div className="flex justify-between w-full pl-2">
                <AiOutlineMinus />
                <div>{totalPrice}개</div>
              </div>
              <div className="border border-black w-full" />
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center text-[red] text-xs mr-2">
                잔액이 부족합니다.
                <GoInfo className="ml-1" />
              </div>
              <div>{afterPayment}개</div>
            </div>
          )}
        </div>

        {payment && (
          <div className="flex justify-between items-center pb-3 mt-[0.25rem] px-10">
            <div className="flex">
              <span className="mr-2">결제 후 </span> <DogChew />
            </div>
            <div>{afterPayment}개</div>
          </div>
        )}

        {payment ? (
          <Link to="/payment" className="grow">
            <div className="w-6/12 mx-auto bg-primary my-10 text-white p-3 mx-2 rounded-xl text-center">결제하기</div>
          </Link>
        ) : (
          <div className="flex flex-col items-center justify-center my-10">
            <Link to="#" className="text-xs underline underline-offset-2">
              지금 바로 충전하기
            </Link>
            <Link to="#" className="grow w-6/12 mt-2">
              <div className=" mx-auto bg-[#acacac] text-white p-3 mx-2 rounded-xl text-center">결제하기</div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default ShoppingCart;
