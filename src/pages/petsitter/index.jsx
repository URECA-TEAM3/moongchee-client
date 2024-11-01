import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PetSitterInfo from '../../components/PetSitterInfo';
import Dropdown from '../../components/DropDown';

const index = () => {
  const [sitterList, setSitterList] = useState([]);
  const [isPetSitter, setIsPetSitter] = useState(false);
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('18:00');
  const [dayList, setDayList] = useState([
    {
      name: '월',
      value: 'MON',
      target: false,
    },
    {
      name: '화',
      value: 'TUE',
      target: false,
    },
    {
      name: '수',
      value: 'WED',
      target: false,
    },
    {
      name: '목',
      value: 'THU',
      target: false,
    },
    {
      name: '금',
      value: 'FRI',
      target: false,
    },
    {
      name: '토',
      value: 'SAT',
      target: false,
    },
    {
      name: '일',
      value: 'SUN',
      target: false,
    },
  ]);
  const dropDownTime = ['09:00', '08:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];
  const navigate = useNavigate();

  const handleApplyClick = () => {
    navigate('/petsitter/apply');
  };

  const handleReservationClick = () => {
    navigate('/petsitter/reservation');
  };

  const handleProfileClick = () => {
    navigate('/petsitter/profile');
  };

  const handleDayClick = (dayName) => {
    setDayList((prevDayList) => prevDayList.map((day) => (day.name === dayName ? { ...day, target: !day.target } : day)));
  };

  const handleSearchClick = async () => {
    let str = '';
    for (let i = 0; i < dayList.length; i++) {
      if (dayList[i].target === true) str += `${dayList[i].value},`;
    }

    const params = {
      weekdays: str.slice(0, -1),
      startTime: startTime,
      endTime: endTime,
    };

    try {
      const res = await axios.get('http://localhost:3000/api/petsitter/list', { params });
      const sitterList = res.data.data.map((item) => {
        return {
          id: item.id,
          name: item.name,
          imageUrl: item.image,
          weekdays: item.weekdays,
          startTime: item.startTime,
          endTime: item.endTime,
          description: item.description,
          experience: item.experience,
        };
      });
      setSitterList(sitterList);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleSearchClick();
  }, [dayList, startTime, endTime]);

  return (
    <div className="flex flex-col gap-y-5 px-5 py-4 justify-center w-full">
      <h1 className="text-2xl subpixel-antialiased w-full">펫시터</h1>
      <div className="flex items-center container gap-5 w-full">
        <button className="text-white bg-primary px-4 py-2 rounded-lg font-normal" onClick={handleApplyClick}>
          펫시터 지원하기
        </button>
        <button className="text-white bg-primary px-4 py-2 rounded-lg font-normal" onClick={handleReservationClick}>
          예약 / 취소 내역
        </button>
        {isPetSitter && (
          <button className="text-white bg-primary px-4 py-2 rounded-lg font-normal" onClick={handleProfileClick}>
            나의 펫시터 프로필
          </button>
        )}
      </div>
      <div className="w-full">
        <div className="search">
          <span className="text-text text-sm">펫시터가 필요한 요일과 시간을 선택해보세요</span>
          <div className="days container flex items-center justify-center mt-3">
            {dayList.map((day, index) => (
              <div className="flex-1 flex items-center justify-center" key={day.name + index}>
                <div
                  onClick={() => handleDayClick(day.name)}
                  className={`day rounded-full w-10 h-10 text-center leading-10 text-slate-400 cursor-pointer ${!day.target ? 'bg-divider' : 'bg-primary text-white'}`}
                >
                  {day.name}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center items-center gap-5 mt-5">
            <div className="flex items-center flex-col w-[150px]">
              <span>근무 시작 시간</span>
              <Dropdown
                width={'150'}
                label={startTime}
                options={dropDownTime}
                title={'Start Time'}
                onSelect={(option) => {
                  setStartTime(option);
                }}
              />
            </div>
            ~
            <div className="flex items-center flex-col w-[150px]">
              <span>근무 종료 시간</span>
              <Dropdown
                width={'150'}
                label={endTime}
                options={dropDownTime}
                title={'End Time'}
                onSelect={(option) => {
                  setEndTime(option);
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="search"></div>
      {sitterList.map((item, index) => (
        <PetSitterInfo key={'item' + index} info={item} />
      ))}
    </div>
  );
};

export default index;
