import React from 'react';
import { useNavigate } from 'react-router-dom';
import { convertWeekDay } from '../../utils/petSitterHelper';
import usePetSitterStore from '../../store/petsitterStore';

const index = () => {
  const navigate = useNavigate();
  const { petsitter } = usePetSitterStore();

  const handleReservationClick = () => {
    navigate('/petsitter/reservation');
  };

  return (
    <div className="flex flex-col justify-between items-center px-10 h-full">
      <div className="card bg-white rounded-2xl px-6 py-6 hover:shadow-lg shadow-black-500/50 ease-in duration-200 mt-10 w-full">
        <div className="profile flex items-center justify-between">
          <div className="flex items-center w-full">
            <img src={petsitter.imageUrl} className="object-cover object-center w-24 h-24 rounded-full" />
            <div className="personal ml-5">
              <span className="text-lg font-bold mr-3">{petsitter.name}</span>
              <button
                className="border border-primary text-primary text-sm rounded-lg w-16 h-7 relative left-56 hover:bg-primary hover:text-white"
                onClick={handleReservationClick}
              >
                예약
              </button>

              <div className="weekday">
                <div className="holiday">근무일: {convertWeekDay(petsitter.weekdays)}</div>
                <span className="workTime">근무시간: {`${petsitter.startTime} ~ ${petsitter.endTime}`}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="personal-history mt-5 flex flex-col gap-3">
          <div>
            <span className="text-sm font-bold">자기소개</span>
            <div className="">{petsitter.description}</div>
          </div>
          <div>
            <span className="text-sm font-bold">경험</span>
            <div className="">{petsitter.experience}</div>
          </div>
        </div>
      </div>
      <div className="w-full py-10">
        <button className="h-12 w-full text-white bg-primary py-2 rounded-lg" onClick={handleReservationClick}>
          예약하기
        </button>
      </div>
    </div>
  );
};

export default index;
