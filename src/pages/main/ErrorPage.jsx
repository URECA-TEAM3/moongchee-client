import React from 'react';
import { useNavigate } from 'react-router-dom';
import whiteCurve from '../../assets/images/white-curve.png';

const ErrorPage = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-white overflow-y-auto text-gray-800 text-center p-6">
      <div className="relative w-full h-80">
        <img src={whiteCurve} alt="Curve Design" className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md opacity-50" />
      </div>
      <h1 className="text-4xl font-bold mb-4">페이지를 찾을 수 없습니다</h1>
      <p className="text-lg mb-6">요청하신 페이지가 존재하지 않거나 잘못된 경로입니다.</p>
      <button onClick={handleGoBack} className="px-6 py-2 mb-2 bg-primary text-white rounded-lg font-semibold transition-colors">
        뒤로 가기
      </button>
    </div>
  );
};

export default ErrorPage;
