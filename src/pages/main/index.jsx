import React, { useState, useRef, useEffect } from 'react';
import Header from '../../components/Header';
import Navbar from '../../components/Navbar';

const Index = () => {
  const slides = [
    {
      link: '/main',
      url: '/src/assets/images/header1.png',
    },
    {
      link: '/main',
      url: '/src/assets/images/header2.png',
    },
  ];
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    const isFirstSlide = currentIndex == 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex == slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const timerRef = useRef();
  useEffect(() => {
    timerRef.current = setInterval(nextSlide, 3000);
    return () => clearInterval(timerRef.current);
  });

  return (
    <div className="flex flex-col h-screen">
      <header className="">
        <Header />
      </header>

      <main className="flex-1 overflow-y-auto">
        <div style={{ backgroundImage: `url(${slides[currentIndex].url})` }} className="w-full h-64 bg-no-repeat ease-in-out duration-500">
          <div className="flex justify-between top left w-full h-full">
            <button
              onClick={prevSlide}
              className="hover:bg-blue-900/20 text-white w-10 h-full text-center opacity-75 hover:opacity-100 z-10 p-0 m-0 duration-400"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-20 -ml-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="hover:bg-blue-900/20 text-white w-10 h-full text-center opacity-75 hover:opacity-100 z-10 p-0 m-0 duration-400"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-20 -ml-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="flex top-4 justify-center py-2">
            {slides.map((slide, index) => (
              <div></div>
            ))}
          </div>
        </div>

        <div className="p-5">
          <div>
            <img src="/src/assets/images/letter-only.png" className="w-28 opacity-50" />
            <p className="text-text">
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
