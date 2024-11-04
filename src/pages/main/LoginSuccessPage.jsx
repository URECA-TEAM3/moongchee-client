import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import EmptyPage from '../../components/EmptyPage';

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
    <div className="flex flex-col items-center justify-center h-full bg-white overflow-y-auto">
      <EmptyPage message="회원가입이 완료되었습니다." buttonText="바로 반려동물 등록하기" onButtonClick={handleRegisterClick} />
      <button onClick={handleSkipClick} className="mt-5 text-sm text-gray-500 underline hover:text-gray-700">
        스킵하기
      </button>
    </div>
  );
};

export default LoginSuccessPage;
