import React from 'react';
import { useNavigate } from 'react-router-dom';
import EmptyPage from '../../components/EmptyPage';

const AnimalRegisterSuccessPage = () => {
  const navigate = useNavigate();

  const handleMain = () => {
    navigate('/main');
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-white overflow-y-auto">
      <EmptyPage message="반려동물 등록이 완료되었습니다." buttonText="메인으로 이동" onButtonClick={handleMain} />
    </div>
  );
};

export default AnimalRegisterSuccessPage;
