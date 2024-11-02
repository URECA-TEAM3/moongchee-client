import React from 'react';
import successImage from '../../assets/images/white-curve.png';
import { useNavigate } from 'react-router-dom';

const AnimalRegisterSuccessPage = () => {
  const navigate = useNavigate();

  const handleMain = () => {
    navigate('/main');
  };

  return (
    <div className="flex flex-col justify-start items-center h-full bg-white overflow-y-auto p-5">
      <img src={successImage} alt="반려동물 등록하기 완료" className="w-[300px]" />
      <h2 className="text-lg font-bold text-gray-800">반려동물 등록이 완료되었습니다</h2>
      <button onClick={handleMain} className="mt-6 py-2 px-4 bg-primary text-white rounded-lg focus:outline-none">
        메인으로 이동
      </button>
    </div>
  );
};

export default AnimalRegisterSuccessPage;
