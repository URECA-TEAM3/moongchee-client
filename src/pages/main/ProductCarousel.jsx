import React, { useState, useEffect } from 'react';
import { ChevronRightIcon, ChevronLeftIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { app } from '../../../firebase';
import ItemBox from '../../components/shop/ItemBox';

const ProductCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [newProducts, setnewProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/products/new-products');
      const productsWithImages = await Promise.all(
        response.data.data.map(async (product) => {
          const imageUrl = await fetchImgFromFireStorage(product.image);
          return {
            ...product,
            image: imageUrl,
          };
        })
      );
      setnewProducts(productsWithImages);
    } catch (error) {
      console.error('새로운 상품 조회 실패:', error);
    }
  };

  const fetchImgFromFireStorage = async (img) => {
    const storage = getStorage(app);
    try {
      const url = await getDownloadURL(ref(storage, img));
      return url;
    } catch (error) {
      console.error('Error loading image:', error);
      throw new Error('이미지 로드 중 오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? newProducts.length - 1 : prevIndex - 1));
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex === newProducts.length - 1 ? 0 : prevIndex + 1));
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
            {newProducts.map((item) => (
              <div key={item.id} className="flex-shrink-0 w-full flex justify-center ">
                <div className="w-64 justify-center">
                  <ItemBox item={item} />
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
