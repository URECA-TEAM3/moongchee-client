import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BottomSheet from '../BottomSheet';
import API from '../../api/axiosInstance';
import { useUserStore } from '../../store/user';

const DetailBottom = ({ product }) => {
  const [isVisible, setIsVisible] = useState(false);
  const { id } = useUserStore((state) => state);

  const toggleBottomSheet = () => {
    setIsVisible(!isVisible);
  };

  const [productItem, setProductItem] = useState(product);
  const navigate = useNavigate();

  const handleNavigate = async (quantity) => {
    try {
      await API.post('/api/cart', {
        product_id: product.id,
        user_id: id,
        quantity: quantity,
        checked: true,
      });

      navigate('/shoppingcart');
    } catch (error) {
      console.error('Error adding product to cart:', error);
      alert('There was an error adding the product to the cart.');
    }
  };

  useEffect(() => {
    if (product && Object.keys(product).length > 0) {
      setProductItem(product);
      setProductItem((prevItem) => ({
        ...prevItem,
        quantity: 1,
      }));
    }
  }, [product]);

  return (
    <>
      <div className="fixed bottom-0 flex items-center justify-between w-[600px] bg-white ">
        {isVisible && (
          <BottomSheet toggleBottomSheet={toggleBottomSheet} setProductItem={setProductItem} productItem={productItem} setIsVisible={setIsVisible} />
        )}
      </div>
      <div className="fixed bottom-0 flex items-center justify-between w-[600px] bg-white z-20">
        <Link to="/shoppingcart">
          <div className="p-3 flex flex-col justify-center items-center">
            <img className="w-8 mb-1" src="/src/assets/images/shoppingCart_gray.svg" alt="" />
            <span className="text-xs">장바구니</span>
          </div>
        </Link>

        {isVisible ? (
          <div className="flex grow">
            <button className="grow" onClick={() => handleNavigate(productItem.quantity)}>
              <div className="bg-primary text-white p-3 mx-2 rounded-xl text-center">결제하기</div>
            </button>
          </div>
        ) : (
          <div className="flex grow">
            <button className="grow" onClick={() => handleNavigate(1)}>
              <div className="text-primary p-3 mx-2 rounded-2xl text-center border border-primary">장바구니에 담기</div>
            </button>
            <button onClick={toggleBottomSheet} className="grow">
              <div className="bg-primary text-white p-3 mx-2 rounded-xl text-center">바로 구매하기</div>
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default DetailBottom;
