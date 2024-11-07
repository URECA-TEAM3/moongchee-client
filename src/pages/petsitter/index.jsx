import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PetSitterInfo from '../../components/PetSitterInfo';
import Dropdown from '../../components/DropDown';
import { useUserStore } from '../../store/userStore';
import usePetSitterStore from '../../store/petsitterStore';
import { getSitterList, getPetList } from '../../api/petsitter';
import { dropDownTime } from '../../constants/petsitter';
const index = () => {
  const { setType } = usePetSitterStore();
  const [sitterList, setSitterList] = useState([]);
  const [isPetSitter, setIsPetSitter] = useState(false);
  const [isDisabled, setIsDisbaled] = useState(false);
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

  const { id, petsitter, address } = useUserStore();
  const navigate = useNavigate();

  const handleApplyClick = () => {
    setType('apply');
    navigate('/petsitter/apply');
  };

  const handleReservationClick = (type) => {
    console.log(type);
    navigate('/petsitter/reservation/list', { state: { type: type } });
  };

  const handleProfileClick = () => {
    setType('update');
    navigate('/petsitter/profile');
  };

  const availableEndTimes = useMemo(() => {
    const startIndex = dropDownTime.indexOf(startTime);
    return startIndex >= 0 ? dropDownTime.slice(startIndex + 1) : dropDownTime;
  }, [startTime]);

  const handleDayClick = (dayName) => {
    setDayList((prevDayList) => prevDayList.map((day) => (day.name === dayName ? { ...day, target: !day.target } : day)));
  };

  const handlePetList = async () => {
    try {
      const petList = await getPetList(id);
      if (petList === 0) {
        setIsDisbaled(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearchClick = async () => {
    try {
      let str = '';

      for (let i = 0; i < dayList.length; i++) {
        if (dayList[i].target === true) str += `${dayList[i].value},`;
      }

      const addr = address.split(' ');
      const p_id = id;
      const weekdays = str.slice(0, -1);
      const p_startTime = startTime;
      const p_endTime = endTime;
      const region = `${addr[0]} ${addr[1]}`;

      const sitterList = await getSitterList(p_id, weekdays, p_startTime, p_endTime, region);

      setSitterList(sitterList);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleSearchClick();
  }, [dayList, startTime, endTime]);

  useEffect(() => {
    if (petsitter) {
      setIsPetSitter(true);
    } else {
      setIsPetSitter(false);
    }
    handlePetList();
  }, []);

  return (
    <div className="flex flex-col gap-y-5 p-10 justify-center w-full">
      {isPetSitter ? (
        <div className="flex items-center container gap-5 w-full">
          <button
            className="text-primary border border-primary px-4 py-2 rounded-lg font-normal hover:bg-primary hover:text-white"
            onClick={() => handleReservationClick('user')}
          >
            예약 / 취소 내역
          </button>
          {isPetSitter && (
            <button
              className="text-primary border border-primary px-4 py-2 rounded-lg font-normal hover:bg-primary hover:text-white"
              onClick={() => handleReservationClick('petsitter')}
            >
              요청 목록
            </button>
          )}
          {isPetSitter && (
            <button
              className="text-primary border border-primary px-4 py-2 rounded-lg font-normal hover:bg-primary hover:text-white"
              onClick={() => handleProfileClick()}
            >
              나의 펫시터 프로필
            </button>
          )}
        </div>
      ) : (
        <div className="flex items-center container gap-5 w-full">
          <button
            className="text-primary border border-primary px-4 py-2 rounded-lg font-normal hover:bg-primary hover:text-white"
            onClick={() => handleApplyClick('apply')}
          >
            펫시터 지원하기
          </button>
          <button
            className="text-primary border border-primary px-4 py-2 rounded-lg font-normal hover:bg-primary hover:text-white"
            onClick={() => handleReservationClick('user')}
          >
            예약 / 취소 내역
          </button>
        </div>
      )}
      <div className="w-full">
        <div className="search">
          <span className="text-text text-sm">펫시터가 필요한 요일과 시간을 선택해보세요</span>
          <div className="days w-full flex items-center justify-between mt-3">
            {dayList.map((day, index) => (
              <div key={day.name + index}>
                <div
                  onClick={() => handleDayClick(day.name)}
                  className={`day rounded-full w-10 h-10 text-center leading-10 cursor-pointer hover:bg-primary hover:text-white ${!day.target ? 'bg-gray-100' : 'bg-primary text-white'}`}
                >
                  {day.name}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center items-center gap-5 mt-5">
            <div className="flex items-center flex-col w-[50%]">
              <span className="text-text text-sm mb-1">시작 시간</span>
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
            <p className="">~</p>
            <div className="flex items-center flex-col w-[50%]">
              <span className="text-text text-sm mb-1">종료 시간</span>
              <Dropdown
                width={'150'}
                label={endTime}
                options={availableEndTimes}
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
        <PetSitterInfo key={'item' + index} info={item} isDisabled={isDisabled} />
      ))}
    </div>
  );
};

export default index;
