import React, { useState, useRef, useEffect } from 'react';
import Header from '../../components/Header';
import Navbar from '../../components/Navbar';
import ProductCarousel from './ProductCarousel';
import MainCarousel from './MainCarousel';

const Index = () => {
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

  return (
    <div className="flex flex-col h-screen text-text">
      <header className="">
        <Header />
      </header>

      <main className="flex-1 overflow-y-auto overflow-x-hidden">
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
            <button className="bg-white shadow-md hover:shadow-inner py-2 px-4 w-28 h-28 rounded-full">
              <img src="/src/assets/icons/petsitting.png" className="h-14 inline" />
              <p>펫시팅</p>
            </button>
          </div>

          {/* 오늘의 인기상품 */}
          <div className="bg-white rounded-lg w-full mt-5 p-5">
            <p>오늘의 인기상품</p>
            <div className="mx-auto max-w-2xl pt-5">
              <div className="grid grid-cols-2 gap-x-5 gap-y-5">
                {products.map((product) => (
                  <a key={product.id} href={product.href} className="group">
                    <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg">
                      <img src={product.image} className="h-full w-full object-cover object-center group-hover:opacity-75" />
                    </div>
                    <div className="flex justify-center items-center border border-divider w-full rounded-lg mt-2 p-1 text-sm hover:bg-divider/50">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="size-5 mr-1">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                        />
                      </svg>
                      담기
                    </div>
                    <h3 className="mt-4 text-sm text-text line-clamp-2">{product.name}</h3>
                    <p className="flex items-center mt-1 text-lg font-medium text-gray-900">
                      <img src="src/assets/icons/gum.png" className="w-8 mr-1" />
                      {product.price} 개
                    </p>
                  </a>
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
      </main>

      <footer className="">
        <Navbar />
      </footer>
    </div>
  );
};

export default Index;
