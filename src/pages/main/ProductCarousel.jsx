import React, { useState } from 'react';
import { ChevronRightIcon, ChevronLeftIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';

const products = [
  {
    id: 1,
    name: '[잇츄] 오리지널 S 43개입 (4종) 강아지 덴탈껌 대용량 간식 개껌',
    href: '#',
    price: '45,600',
    image: 'https://static.fitpetcdn.com/prod/images/product/1000031556/S_43%EA%B0%9C%EC%9E%85_xmrari_PRODUCT_LIST.png',
  },
  {
    id: 2,
    name: '[잇츄] 오리지널 M 버라이어티팩 (48개입) 강아지 덴탈껌 대용량 간식 개껌',
    href: '#',
    price: '58,900',
    image:
      'https://static.fitpetcdn.com/prod/images/product/1000035685/%EC%98%A4%EB%A6%AC%EC%A7%80%EB%84%90_%EB%B2%84%EB%9D%BC%EC%9D%B4%EC%96%B4%ED%8B%B0%ED%8C%A9_M_ddohlm_PRODUCT_LIST.png',
  },
  {
    id: 3,
    name: '[3개 세트] 인섹트업 미니바이트 스킨',
    href: '#',
    price: '14,900',
    image: 'https://static.fitpetcdn.com/prod/images/product/1000036174/4967_2_fqdxjn_PRODUCT_LIST.png',
  },
  {
    id: 4,
    name: '[플라고] 벌집덴탈껌 스킨앤코트',
    href: '#',
    price: '9,900',
    image: 'https://static.fitpetcdn.com/prod/images/product/1000033990/%EC%8A%A4%ED%82%A8%EC%95%A4%EC%BD%94%ED%8A%B8_imolwv.jpg',
  },
];

const ProductCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? products.length - 1 : prevIndex - 1));
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex === products.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div className="relative w-full max-w-lg mx-auto mt-3">
      <div className="relative flex justify-between items-center">
        <button
          onClick={handlePrevClick}
          className="absolute left-0 z-10 p-2 w-12 h-12 bg-divider/50 hover:bg-paleblue rounded-full"
          style={{ top: '50%', transform: 'translateY(-50%)' }}
        >
          <ChevronLeftIcon className="h-6 w-6 ml-1" stroke="gray" />
        </button>

        <div className="overflow-hidden w-full h-full">
          <div
            className="flex transition-transform duration-500"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            {products.map((product) => (
              <div key={product.id} className="flex-shrink-0 w-full flex justify-center">
                <div className="w-64 justify-center">
                  <a href={product.href}>
                    <img src={product.image} alt={product.name} className="w-64 object-cover rounded-lg" />
                  </a>

                  <a
                    href={product.href}
                    className="flex justify-center items-center border border-divider w-full rounded-lg mt-2 p-1 text-sm hover:bg-divider/50"
                  >
                    <ShoppingCartIcon stroke="currentColor" className="size-5 mr-1" />
                    담기
                  </a>
                  <div className="mt-2">
                    <a href={product.href}>{product.name}</a>
                    <h3 className="flex items-center mt-1 text-lg font-medium text-gray-900">
                      <img src="src/assets/icons/gum.png" className="w-8 mr-1" /> {product.price} 개
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleNextClick}
          className="absolute right-0 z-10 p-2 w-12 h-12 bg-divider/50 hover:bg-paleblue rounded-full"
          style={{ top: '50%', transform: 'translateY(-50%)' }}
        >
          <ChevronRightIcon className="h-6 w-6 ml-1" stroke="gray" />
        </button>
      </div>
    </div>
  );
};

export default ProductCarousel;
