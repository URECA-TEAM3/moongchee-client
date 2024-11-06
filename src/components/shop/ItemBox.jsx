import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import DogChew from '../DogChew';
import API from '../../api/axiosInstance';
import { useUserStore } from '../../store/userStore';
import Modal from '../Modal';
import { useIsImgLoaded } from '../../hooks/useIsImgLoaded';
import placeholderImg from '/src/assets/images/black-curve-opacity.jpg';
import { useProductStore } from '../../store/productsStore';

const ItemBox = ({ item }) => {
  const { elementRef, isLoaded } = useIsImgLoaded(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { id } = useUserStore((state) => state);

  const openModal = () => {
    setIsModalOpen(true);
    handleNavigate();
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleNavigate = async () => {
    console.log(id);
    try {
      await API.post('/cart', {
        product_id: item.id,
        user_id: id,
        quantity: 1,
        checked: true,
      });
    } catch (error) {
      console.error('Error adding product to cart:', error);
      alert('There was an error adding the product to the cart.');
    }
  };

  return (
    <>
      <div className="h-[354px]" ref={elementRef} key={item.id}>
        <button
          onClick={() => {
            navigate(`/shoppingmall/${item.id}`);
          }}
          className="flex flex-col"
        >
          <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg">
            {isLoaded ? (
              <img src={item.image} className="h-full w-full object-cover object-center transition-opacity duration-300 hover:opacity-75" />
            ) : (
              <img src={placeholderImg} />
            )}
          </div>
        </button>

        <button
          onClick={() => openModal()}
          className="flex justify-center items-center border border-divider w-full rounded-lg mt-2 p-1 text-sm hover:bg-divider/50"
        >
          <ShoppingCartIcon stroke="currentColor" className="size-5 mr-1" />
          담기
        </button>

        <h3 className="mt-4 text-sm text-text">
          <button onClick={() => navigate(`/shoppingmall/${item.id}`)} className="text-start flex flex-col h-[100%]">
            {item.name}
          </button>
        </h3>
        <div className="flex items-center mt-1 text-lg font-medium text-gray-900">
          <div className="mr-1">
            <DogChew />
          </div>
          {item.price} 개
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="my-10 flex justify-center">
          <span className="font-bold text-lg">상품이 장바구니에 담겼습니다.</span>
        </div>
        <div className="flex gap-4 mt-3">
          <button className="text-gray-500 bg-gray-300 px-4 py-2 rounded-lg w-full" onClick={() => closeModal()}>
            계속 쇼핑하기
          </button>
          <button onClick={() => navigate('/shoppingcart')} className="text-white bg-primary px-4 py-2 rounded-lg font-normal w-full">
            장바구니 이동
          </button>
        </div>
      </Modal>
    </>
  );
};

export default ItemBox;
