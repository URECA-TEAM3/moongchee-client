import React from 'react';
import { useNavigate } from 'react-router-dom';
import whiteCurve from '../../assets/images/white-curve.png';

const ErrorPage = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white text-gray-800 text-center p-6">
      <div className="relative w-full h-80">
        <img src={whiteCurve} alt="Curve Design" className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md opacity-50" />
      </div>
      <h1 className="text-4xl font-bold mb-4">페이지를 찾을 수 없습니다</h1>
      <p className="text-lg mb-6">요청하신 페이지가 존재하지 않거나 잘못된 경로입니다. 아래 버튼을 클릭하여 돌아가거나, 홈 화면으로 이동해 주세요.</p>
      <button onClick={handleGoBack} className="px-6 py-2 mb-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold transition-colors">
        뒤로 가기
      </button>
      <button onClick={() => navigate('/')} className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-full font-semibold transition-colors">
        홈으로 이동
      </button>
    </div>
  );
};

export default ErrorPage;
