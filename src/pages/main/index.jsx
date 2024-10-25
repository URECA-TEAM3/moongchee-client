import React, { useState, useEffect } from 'react';
import ProductCarousel from './ProductCarousel';
import MainCarousel from './MainCarousel';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { app } from '../../../firebase';

const Index = () => {
  const [popularProducts, setPopularProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/products/popular-products');
      const productsWithImages = await Promise.all(
        response.data.data.map(async (product) => {
          const imageUrl = await fetchImgFromFireStorage(product.image);
          return {
            ...product,
            image: imageUrl,
          };
        })
      );
      setPopularProducts(productsWithImages);
    } catch (error) {
      console.error('상품 목록 조회 실패:', error);
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

  return (
    <div className="container inline-grid h-full">
      <MainCarousel />

      {/* 3 buttons */}
      <div className="p-5">
        <div className="flex justify-between items-center mx-8 mb-5">
          <button className="bg-white shadow-md hover:shadow-inner py-2 px-4 w-28 h-28 rounded-full">
            <img src="/src/assets/icons/best.png" className="h-14 inline" />
            <p>BEST</p>
          </button>
          <button className="bg-white shadow-md hover:shadow-inner py-2 px-4 w-28 h-28 rounded-full">
            <img src="/src/assets/icons/category.png" className="h-14 inline" />
            <p>카테고리</p>
          </button>
          <a href="/petsitter">
            <button className="bg-white shadow-md hover:shadow-inner py-2 px-4 w-28 h-28 rounded-full">
              <img src="/src/assets/icons/petsitting.png" className="h-14 inline" />
              <p>펫시팅</p>
            </button>
          </a>
        </div>

        {/* 오늘의 인기상품 */}
        <div className="bg-white rounded-lg w-full mt-5 p-5">
          <p>오늘의 인기상품</p>
          <div className="mx-auto max-w-2xl pt-5">
            <div className="grid grid-cols-2 gap-x-5 gap-y-5">
              {popularProducts.map((product) => (
                <div key={product.id}>
                  <a href={product.href}>
                    <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg">
                      <img src={product.image} className="h-full w-full object-cover object-center hover:opacity-75" />
                    </div>
                  </a>

                  <a href={product.href}>
                    <div className="flex justify-center items-center border border-divider w-full rounded-lg mt-2 p-1 text-sm hover:bg-divider/50">
                      <ShoppingCartIcon stroke="currentColor" className="size-5 mr-1" />
                      담기
                    </div>
                  </a>

                  <h3 className="mt-4 text-sm text-text line-clamp-2">
                    <a href={product.href}>{product.name}</a>
                  </h3>
                  <p className="flex items-center mt-1 text-lg font-medium text-gray-900">
                    <img src="src/assets/icons/gum.png" className="w-8 mr-1" />
                    {product.price} 개
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 새로 들어온 상품 */}
        <div className="bg-white rounded-lg w-full h-84 mt-5 py-5">
          <div className="flex items-center">
            <p className="ml-5 mr-1">새로 들어온 상품</p>
            <img src="src/assets/icons/new.png" />
          </div>

          <ProductCarousel />
        </div>

        {/* footer */}
        <div className="mt-5">
          <img src="/src/assets/images/letter-only.png" className="w-28 opacity-50" />
          <p>
            평일 09:00~18:00 | 점심시간 13:00~14:00 <br />
            <br />
            <strong>제휴 입점 및 기타 문의</strong>
            <br />
            입점 : md@moongchee.co.kr
            <br />
            광고 : ads@moongchee.co.kr
            <br />
            마케팅 : marketing@moongchee.co.kr
            <br />
            언론 문의 : pr@moongchee.co.kr
            <br />
            <br />
            전화번호
            <br />
            <strong>쇼핑몰 문의</strong> 1111-1111
            <br />
            <strong>펫시터 문의</strong> 2222-2222
            <br />
            <strong>기타 문의</strong> 070-3333-3333
            <br />
            <br />
            Copyright Moongchee, Inc. All rights Reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
