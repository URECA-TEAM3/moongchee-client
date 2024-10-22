import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Dropdown from '../../components/DropDown';

const index = () => {
  const [startTime, setStartTime] = useState('08:00 AM');
  const [endTime, setEndTime] = useState('08:00 AM');
  const dropDownTime = [
    '09:00 AM',
    '08:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '13:00 PM',
    '14:00 PM',
    '15:00 PM',
    '16:00 PM',
    '17:00 PM',
    '18:00 PM',
    '19:00 PM',
  ];
  const location = useLocation();
  const navigate = useNavigate();
  const { name } = location.state || '';

  const handleReservationClick = () => {
    navigate('/petsitter/reservation/list');
  };

  return (
    <div>
      <h1>펫시터</h1>
      <div className="profile flex items-center mt-3">
        <img src="/src/assets/images/dog.jpeg" className="object-cover object-center w-24 h-24 rounded-full " />
        <div className="personal ml-5">
          <span className="text-xl text-slate-900 font-medium">{name}</span>
        </div>
      </div>
      <div className="mt-3">
        <label className="block mb-2 text-sm font-medium text-gray-900">날짜 *</label>
        <input type="text" className="block w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg mt-3" required />
      </div>
      <div className="mt-3">
        <label className="block mb-2 text-sm font-medium text-gray-900">시간 *</label>
        <div className="flex justify-center items-center gap-5 mt-3">
          <Dropdown
            label={startTime}
            options={dropDownTime}
            title={'Start Time'}
            onSelect={(option) => {
              setStartTime(option);
            }}
          />
          ~
          <Dropdown
            label={endTime}
            options={dropDownTime}
            title={'Start Time'}
            onSelect={(option) => {
              setEndTime(option);
            }}
          />
        </div>
      </div>
      <div className="mt-3">
        <label className="block mb-2 text-sm font-medium text-gray-900">반려동물 선택 *</label>
        <Dropdown
          label={startTime}
          options={dropDownTime}
          title={'Start Time'}
          onSelect={(option) => {
            setStartTime(option);
          }}
        />
      </div>
      <div className="mt-3">
        <label className="block mb-2 text-sm font-medium text-gray-900">요청사항 *</label>
        <textarea type="text" className="block w-full p-2.5 h-40 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg mt-3" required />
      </div>
      <div className="flex justify-center mt-3">
        <span className="text-slate-400 text-sm">예약이 완료된 후 펫시터와 채팅으로도 소통할 수 있습니다.</span>
      </div>
      <div className="flex justify-center mt-10">
        <button className="text-white bg-primary px-4 py-2 rounded-lg font-normal w-[150px]" onClick={handleReservationClick}>
          완료하기
        </button>
      </div>
    </div>
  );
};

export default index;
