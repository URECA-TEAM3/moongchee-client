import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import DogChew from '../DogChew';
import API from '../../api/axiosInstance';

const ItemBox = ({ item }) => {
  const navigate = useNavigate();
  const { id } = useUserStore((state) => state);

  const handleNavigate = async () => {
    try {
      await API.post('/cart', {
        product_id: item.id,
        user_id: id,
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
    <div key={item.id}>
      <button onClick={() => navigate(`/shoppingmall/${item.id}`)} className="flex flex-col">
        <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg">
          <img src={item.image} className="h-full w-full object-cover object-center hover:opacity-75" />
        </div>
      </button>

      <button
        onClick={() => handleNavigate()}
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
  );
};

export default ItemBox;
