import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import toast, { Toaster } from 'react-hot-toast';
import PetSitterInfo from '../../components/PetSitterInfo';
import Dropdown from '../../components/DropDown';
import { useUserStore } from '../../store/userStore';
import usePetSitterStore from '../../store/petsitterStore';
import { getSitterList, getPetList } from '../../api/petsitter';
import { dropDownTime } from '../../constants/petsitter';
import ToggleSwitch from '../../components/ToggleSwitch';
const index = () => {
  const { setType } = usePetSitterStore();
  const [sitterList, setSitterList] = useState([]);
  const [isPetSitter, setIsPetSitter] = useState(false);
  const [isDisabled, setIsDisbaled] = useState(false);
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('18:00');
  const [isToggleOn, setIsToggleOn] = useState(false);
  const [dayList, setDayList] = useState([
    { name: '월', value: 'MON', target: false },
    { name: '화', value: 'TUE', target: false },
    { name: '수', value: 'WED', target: false },
    { name: '목', value: 'THU', target: false },
    { name: '금', value: 'FRI', target: false },
    { name: '토', value: 'SAT', target: false },
    { name: '일', value: 'SUN', target: false },
  ]);

  const { id, petsitter, address } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    const savedToggleState = localStorage.getItem('isToggleOn');
    if (savedToggleState !== null) {
      setIsToggleOn(JSON.parse(savedToggleState));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('isToggleOn', JSON.stringify(isToggleOn));
  }, [isToggleOn]);

  const handleToggleChange = () => {
    const newToggleState = !isToggleOn;
    setIsToggleOn(newToggleState);

    if (newToggleState) {
      toast.success('펫시터 모드입니다.');
    } else {
      toast('펫시터 모드를 종료하였습니다.');
    }
  };

  const handleApplyClick = () => {
    setType('apply');
    navigate('/petsitter/apply');
  };

  const handleReservationClick = (type) => {
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
      <Toaster />
      {petsitter === 1 && (
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-900 dark:text-gray-300">펫시터모드</span>
          <ToggleSwitch checked={isToggleOn} onChange={handleToggleChange} />
        </div>
      )}
      <div className="flex items-center container gap-5 w-full">
        {petsitter === 0 && (
          <button className="text-primary border border-primary px-4 py-2 rounded-lg font-normal hover:bg-primary hover:text-white" onClick={handleApplyClick}>
            펫시터 지원하기
          </button>
        )}
        {isToggleOn ? (
          <>
            <button
              className="text-primary border border-primary px-4 py-2 rounded-lg font-normal hover:bg-primary hover:text-white"
              onClick={() => handleReservationClick('user')}
            >
              예약 현황
            </button>
            <button
              className="text-primary border border-primary px-4 py-2 rounded-lg font-normal hover:bg-primary hover:text-white"
              onClick={handleProfileClick}
            >
              나의 펫시터 프로필
            </button>
          </>
        ) : (
          <button
            className="text-primary border border-primary px-4 py-2 rounded-lg font-normal hover:bg-primary hover:text-white"
            onClick={() => handleReservationClick('user')}
          >
            예약 / 취소 내역
          </button>
        )}
      </div>
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
