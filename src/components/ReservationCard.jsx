import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { useUserStore } from '../store/user';

const ReservationCard = ({ info, openModal, userType }) => {
  const { petsitter } = useUserStore();
  const navigate = useNavigate();

  const openModalAction = (value) => {
    openModal(value, info);
  };

  const handleStatusCode = () => {
    if (info.status === 'reserved') return '예약 대기';
    else if (info.status === 'confirmed') return '예약 완료';
    else if (info.status === 'cancelled') return '취소 완료';
    else if (info.status === 'completed') return '펫시팅 완료';
    else return '';
  };

  const handleDetailClick = () => navigate('/petsitter/reservation/detail', { state: { info: info, userType: userType } });

  return (
    <div className={`rounded-lg shadow-sm p-5 h-[220px] ${info.status === 'reserved' ? 'bg-paleblue' : 'bg-gray-100'}`}>
      <div className="profile flex items-center">
        <img
          src={info.profile_image}
          className={`object-cover object-center w-16 h-16 rounded-full ${info.status === 'reserved' ? 'grayscale-0' : 'grayscale'}`}
        />
        <div className="personal ml-5">
          <span className="text text-slate-900 font-bold">{info.name}</span>
        </div>
        <span className={`${info.status === 'cancelled' ? 'text-alert' : 'text-primary'} -mt-10 mr-2 text-sm ml-auto`}>{handleStatusCode()}</span>
      </div>
      <div className="flex mt-3 justify-between items-center">
        <div className={`flex flex-col ${info.status === 'reserved' ? 'grayscale-0' : 'grayscale'}`}>
          <span className="text-sm">요청한 날짜와 시간</span>
          <span>
            <span className="font-semibold mr-3">📅 {info.requestDate}</span> 🕟 {`${info.startTime} - ${info.endTime}`}
          </span>
        </div>
        {info.status !== 'cancelled' && (
          <button onClick={handleDetailClick} className="cursor-pointer -mt-16">
            <ChevronRightIcon className="h-6 w-6 ml-5" />
          </button>
        )}
      </div>
      {info.status !== 'cancelled' && (
        <div className="flex gap-5 mt-3">
          {petsitter ? (
            info.status === 'reserved' ? (
              <div className="flex gap-5 mt-3 w-full">
                <button className="text-white bg-delete px-4 py-2 rounded-lg font-normal w-full" onClick={() => openModalAction('reject')}>
                  거절
                </button>
                <button className="text-white bg-primary px-4 py-2 rounded-lg font-normal w-full" onClick={() => openModalAction('confirm')}>
                  수락
                </button>
              </div>
            ) : (
              <button
                className="text-primary border border-primary px-4 py-2 rounded-lg w-full hover:bg-primary hover:text-white"
                onClick={() => openModalAction('cancel')}
              >
                예약 취소하기
              </button>
            )
          ) : (
            info.status === 'reserved' && (
              <button
                className="text-primary border border-primary px-4 py-2 rounded-lg w-full hover:bg-primary hover:text-white"
                onClick={() => openModalAction('cancel')}
              >
                예약 취소하기
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default ReservationCard;
