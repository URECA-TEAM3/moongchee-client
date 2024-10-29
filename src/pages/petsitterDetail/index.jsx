import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const index = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { info } = location.state || {};

  const handleReservationClick = () => {
    navigate('/petsitter/reservation', { state: { name: info.name } });
  };

  return (
    <div className="flex items-center flex-col p-5">
      <div className="card bg-white rounded-2xl px-6 py-6 hover:shadow-lg shadow-black-500/50 ease-in duration-200 mt-10 w-full">
        <div className="profile flex items-center justify-between">
          <div className="flex items-center">
            <img src="/src/assets/images/dog.jpeg" className="object-cover object-center w-24 h-24 rounded-full " />
            <div className="personal ml-5">
              <span className="text-xl text-slate-900 font-medium">{info.name}</span>
              <div className="weekday">
                <div className="holiday text-text">{info.weekday} 근무</div>
                <span className="workTime text-text">{`${info.startTime} ~ ${info.endTime}`}</span>
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
            <div className="text-text">{info.introduction}</div>
          </div>
          <div>
            <span className="text-xl font-medium">경험</span>
            <div className="text-text">{info.experience}</div>
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
