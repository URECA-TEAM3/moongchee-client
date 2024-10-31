import React from 'react';
import { useNavigate } from 'react-router-dom';
import { convertWeekDay } from '../../utils/petSitterHelper';
import usePetSitterStore from '../../store/petsitterStore';

const index = () => {
  const navigate = useNavigate();
  const { petsitter } = usePetSitterStore();

  const handleReservationClick = () => {
    navigate('/petsitter/reservation', { state: { name: petsitter.name } });
  };

  return (
    <div className="flex items-center flex-col p-5">
      <div className="card bg-white rounded-2xl px-6 py-6 hover:shadow-lg shadow-black-500/50 ease-in duration-200 mt-10 w-full">
        <div className="profile flex items-center justify-between">
          <div className="flex items-center">
            <img src={petsitter.imageUrl} className="object-cover object-center w-24 h-24 rounded-full " />
            <div className="personal ml-5">
              <span className="text-xl text-slate-900 font-medium">{petsitter.name}</span>
              <div className="weekday">
                <div className="holiday text-text">{convertWeekDay(petsitter.weekdays)} 근무</div>
                <span className="workTime text-text">{`${petsitter.startTime} ~ ${petsitter.endTime}`}</span>
              </div>
            </div>
          </div>
          <button className="text-white bg-primary px-4 py-2 rounded-lg font-normal cursor-pointer" onClick={handleReservationClick}>
            예약
          </button>
        </div>
        <div className="personal-history mt-5 flex flex-col gap-3">
          <div>
            <span className="text-xl font-medium ">자기소개</span>
            <div className="text-text">{petsitter.description}</div>
          </div>
          <div>
            <span className="text-xl font-medium">경험</span>
            <div className="text-text">{petsitter.experience}</div>
          </div>
        </div>
      </div>
      <button className="text-white bg-primary px-4 py-2 rounded-lg font-normal mt-10 w-[300px] cursor-pointer" onClick={handleReservationClick}>
        예약하기
      </button>
    </div>
  );
};

export default index;
