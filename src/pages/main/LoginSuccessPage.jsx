import React from 'react';
import successImage from '../../assets/images/white-curve.png';
import { useNavigate, useLocation } from 'react-router-dom';

const LoginSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.userId;

  console.log('유저아이디:', userId);

  const handleRegisterClick = () => {
    navigate('/animalinfo', { state: { userId } });
  };

  const handleSkipClick = () => {
    navigate('/main');
  };

  return (
    <div className="flex flex-col justify-start items-center h-full bg-white overflow-y-auto p-5">
      <img src={successImage} alt="회원가입 성공" className="w-[300px]" />
      <h2 className="text-lg font-bold text-gray-800">회원가입이 완료되었습니다</h2>
      <button onClick={handleRegisterClick} className="mt-6 py-2 px-4 bg-primary text-white rounded-lg focus:outline-none">
        바로 반려동물 등록하기
      </button>
      <div className="flex flex-col items-center mt-4">
        <hr className="w-full border-gray-300 mb-4" />
        <button onClick={handleSkipClick} className="text-sm text-gray-500 underline hover:text-gray-700">
          스킵하기
        </button>
      </div>
    </div>
  );
};

export default LoginSuccessPage;
