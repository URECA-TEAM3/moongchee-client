import React, { useEffect, useState } from 'react';
import { CiCircleMinus } from 'react-icons/ci';
import { CiCirclePlus } from 'react-icons/ci';
import { IoCloseOutline } from 'react-icons/io5';
import DogChew from './DogChew';
import { useUserStore } from '../store/userStore';
import API from '../api/axiosInstance';

const BottomSheet = ({ setBuyNowData, price, setPrice, setDisabledBtn, toggleBottomSheet, productItem, setIsVisible, setProductItem }) => {
  const { id } = useUserStore((state) => state);
  const [localPoint, setLocalPoint] = useState();
  const [isAnimating, setIsAnimating] = useState(false);
  const sessionData = JSON.parse(sessionStorage.getItem('userData')) || {};

  const handleQuantityChange = (id, delta) => {
    setProductItem((prevItem) => {
      const newQuantity = Math.max(1, (prevItem.quantity || 1) + delta);
      const ProductTotalPrice = prevItem.price * newQuantity;

      // 상품 전체 가격과 유저의 최종 금액 업데이트
      setPrice({
        ProductTotal: ProductTotalPrice,
        UserTotal: localPoint - ProductTotalPrice,
      });

      // buyNowData 업데이트
      setBuyNowData((prevData) => ({
        ...prevData,
        quantity: newQuantity, // 수량 업데이트
        total: ProductTotalPrice, // 전체 금액 업데이트
      }));

      // 버튼 활성화 상태 업데이트
      const newUserTotal = localPoint - ProductTotalPrice;
      setDisabledBtn(newUserTotal < 0); // 유저 총액이 0보다 작으면 버튼 비활성화

      return {
        ...prevItem,
        quantity: newQuantity,
      };
    });
  };

  useEffect(() => {
    setIsAnimating(true);
    const ProductTotalPrice = productItem.price * 1;
    const UserTotalPrice = localPoint - ProductTotalPrice;

    setPrice({
      ProductTotal: ProductTotalPrice,
      UserTotal: UserTotalPrice,
    });

    getPoints();
  }, []);

  const getPoints = async () => {
    try {
      const response = await API.get(`/members/point/${id}`);
      setLocalPoint(response.data.data.point);
    } catch (error) {
      console.error('포인트 요청 실패:', error);
    }
  };

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
        absolute bottom-[60px] bg-white w-full shadow-inner pb-4 rounded-t-3xl`}
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
                <div className="flex mb-1 text-sm mt-1">
                  총 상품 금액 :
                  <div className="mx-2">
                    <DogChew />
                  </div>
                  <span className="font-bold">{price.ProductTotal}개</span>
                </div>
              </div>
            </div>
          </div>
        </li>
        <div className="flex flex-col items-end justify-center pr-10 mt-4">
          <div className="flex">
            결제 후 잔여
            <div className="mx-1 flex">
              <DogChew />
            </div>
            <span className={`font-bold`}>
              : {localPoint} - {productItem.quantity * productItem.price} =
              <span className={`ml-1 ${localPoint - productItem.quantity * productItem.price > 0 ? 'text-primary' : 'text-red-500'}`}>
                {localPoint - productItem.quantity * productItem.price}개
              </span>
            </span>
          </div>
        </div>
      </div>
      <div className="h-[86px]"></div>
    </>
  );
};

export default BottomSheet;
