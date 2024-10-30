import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../api/axiosInstance';

const DetailBottom = ({ id, product }) => {
  const navigate = useNavigate();

  // 전역 함수로 ... 쓰고싶은디 ..
  const handleNavigate = async () => {
    try {
      await API.post('/api/cart', {
        product_id: id,
        user_id: 1,
        quantity: 1,
        checked: true,
      });

      navigate('/shoppingcart');
    } catch (error) {
      console.error('Error adding product to cart:', error);
      alert('There was an error adding the product to the cart.');
    }
  };

  return (
    <div className="fixed bottom-0 flex items-center justify-between w-[600px] bg-white">
      <button onClick={() => navigate('/shoppingcart')}>
        <div className="p-3 flex flex-col justify-center items-center">
          <img className="w-8 mb-1" src="/src/assets/images/shoppingCart_gray.svg" alt="" />
          <span className="text-xs">장바구니</span>
        </div>
      </button>
      <button className="grow" onClick={handleNavigate}>
        <div className="text-primary p-3 mx-2 rounded-2xl text-center border border-primary">장바구니에 담기</div>
      </button>
      <button to="#" className="grow">
        <div className="bg-primary text-white p-3 mx-2 rounded-xl text-center">바로 구매하기</div>
      </button>
    </div>
  );
};

export default DetailBottom;
