import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ReservationCard = ({ info, openModal }) => {
  const [isPetSitter, setIsPetSitter] = useState(true);

  const navigate = useNavigate();

  const openModalAction = (value) => {
    openModal(value, info);
  };

  const handleStatusCode = () => {
    if (info.status === 'reserved') return '예약 완료';
    else if (info.status === 'cancelled') return '취소 완료';
    else if (info.status === 'completed') return '펫시팅 완료';
    else return '';
  };

  const handleDetailClick = () => navigate('/petsitter/reservation/detail');

  return (
    <div className={`bg-paleblue rounded-lg shadow-sm p-5 ${info.status === 'reserved' ? 'grayscale-0' : 'grayscale'}`}>
      <div className="profile flex items-center mt-3">
        <img src="/src/assets/images/dog.jpeg" className="object-cover object-center w-24 h-24 rounded-full " />
        <div className="personal ml-5">
          <span className="text-xl text-slate-900 font-bold">{info.name}</span>
        </div>
        {isPetSitter && (
          <span className={`${info.status === 'cancelled' ? 'text-white bg-gray-500' : 'text-black bg-secondary'} rounded-md px-2 py-1 text-sm ml-auto`}>
            {handleStatusCode()}
          </span>
        )}
      </div>
      <div className="flex mt-3 justify-between items-center">
        <div className="flex flex-col">
          <span className="text-lg text-slate-900 font-medium">요청한 날짜와 시간</span>
          <span>{info.scheduled}</span>
          <span>{`${info.startTime}~${info.endTime}`}</span>
        </div>
        {isPetSitter && info.status === 'reserved' && (
          <span className="text-gray-500 text-2xl cursor-pointer" onClick={handleDetailClick}>
            &gt;
          </span>
        )}
      </div>
      <div className="flex gap-5 mt-3">
        {!isPetSitter ? (
          <div className="flex gap-5 mt-3 w-full">
            <button className="text-white bg-delete px-4 py-2 rounded-lg font-normal w-full" onClick={() => openModalAction('reject')}>
              거절
            </button>
            <button className="text-white bg-primary px-4 py-2 rounded-lg font-normal w-full" onClick={() => openModalAction('confirm')}>
              수락
            </button>
          </div>
        ) : info.status === 'reserved' ? (
          <button className="text-white bg-primary px-4 py-2 rounded-lg font-normal w-full" onClick={() => openModalAction('cancel')}>
            예약 취소하기
          </button>
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

export default ReservationCard;
