import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';

const ItemBox = ({ item }) => {
  const navigate = useNavigate();

  return (
    <div key={item.id}>
      <button onClick={() => navigate(`/shoppingmall/${item.id}`)} className="flex flex-col">
        <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg">
          <img src={item.image} className="h-full w-full object-cover object-center hover:opacity-75" />
        </div>
      </button>

      <button className="flex justify-center items-center border border-divider w-full rounded-lg mt-2 p-1 text-sm hover:bg-divider/50">
        <ShoppingCartIcon stroke="currentColor" className="size-5 mr-1" />
        담기
      </button>

      <h3 className="mt-4 text-sm text-text">
        <button onClick={() => navigate(`/shoppingmall/${item.id}`)} className="text-start flex flex-col h-[100%]">
          {item.name}
        </button>
      </h3>
      <p className="flex items-center mt-1 text-lg font-medium text-gray-900">
        <img src="src/assets/icons/gum.png" className="w-8 mr-1" />
        {item.price} 개
      </p>
    </div>
  );
};

export default ItemBox;
