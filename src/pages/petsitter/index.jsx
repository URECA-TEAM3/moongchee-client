import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PetSitterInfo from '../../components/PetSitterInfo';
import Dropdown from '../../components/DropDown';

const index = () => {
  const [sitterList, setSitterList] = useState([]);
  const [isPetSitter, setIsPetSitter] = useState(false);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [dayList, setDayList] = useState([
    {
      name: '월',
      target: false,
    },
    {
      name: '화',
      target: false,
    },
    {
      name: '수',
      target: false,
    },
    {
      name: '목',
      target: false,
    },
    {
      name: '금',
      target: false,
    },
    {
      name: '토',
      target: false,
    },
    {
      name: '일',
      target: false,
    },
  ]);
  const dropDownTime = ['09:00', '08:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];
  const navigate = useNavigate();

  useEffect(() => {
    setSitterList([
      {
        name: '박주광',
        profile: '/src/assets/images/dog.jpeg',
        weekday: '월, 화, 수, 목, 금',
        startTime: '10:00',
        endTime: '17:00',
        introduction:
          '안녕하세요! 믿고 맡길 수 있는 펫시터 김예원입니다. 저는 동물을 진심으로 사랑하며, 오랜 시간 동안 반려견과 함께한 경험이 있습니다. 어린 시절부터 반려동물을 키우며 책임감과 배려심을 배웠고',
        experience:
          '현재도 반려견과 함께 생활하고 있습니다! 강아지들과 시간을 보내는 게 저에게는 큰 행복이에요. 산책도 자주 하고, 집에서도 재밌게 놀아주고, 강아지가 필요로 하는 것들을 잘 챙겨주는 편이에요.',
      },
      {
        name: '박주광',
        profile: '/src/assets/images/dog.jpeg',
        weekday: '월, 화, 수, 목, 금',
        startTime: '10:00',
        endTime: '17:00',
        introduction:
          '안녕하세요! 믿고 맡길 수 있는 펫시터 김예원입니다. 저는 동물을 진심으로 사랑하며, 오랜 시간 동안 반려견과 함께한 경험이 있습니다. 어린 시절부터 반려동물을 키우며 책임감과 배려심을 배웠고',
        experience:
          '현재도 반려견과 함께 생활하고 있습니다! 강아지들과 시간을 보내는 게 저에게는 큰 행복이에요. 산책도 자주 하고, 집에서도 재밌게 놀아주고, 강아지가 필요로 하는 것들을 잘 챙겨주는 편이에요.',
      },
      {
        name: '박주광',
        profile: '/src/assets/images/dog.jpeg',
        weekday: '월, 화, 수, 목, 금',
        startTime: '10:00',
        endTime: '17:00',
        introduction:
          '안녕하세요! 믿고 맡길 수 있는 펫시터 김예원입니다. 저는 동물을 진심으로 사랑하며, 오랜 시간 동안 반려견과 함께한 경험이 있습니다. 어린 시절부터 반려동물을 키우며 책임감과 배려심을 배웠고',
        experience:
          '현재도 반려견과 함께 생활하고 있습니다! 강아지들과 시간을 보내는 게 저에게는 큰 행복이에요. 산책도 자주 하고, 집에서도 재밌게 놀아주고, 강아지가 필요로 하는 것들을 잘 챙겨주는 편이에요.',
      },
      {
        name: '박주광',
        profile: '/src/assets/images/dog.jpeg',
        weekday: '월, 화, 수, 목, 금',
        startTime: '10:00',
        endTime: '17:00',
        introduction:
          '안녕하세요! 믿고 맡길 수 있는 펫시터 김예원입니다. 저는 동물을 진심으로 사랑하며, 오랜 시간 동안 반려견과 함께한 경험이 있습니다. 어린 시절부터 반려동물을 키우며 책임감과 배려심을 배웠고',
        experience:
          '현재도 반려견과 함께 생활하고 있습니다! 강아지들과 시간을 보내는 게 저에게는 큰 행복이에요. 산책도 자주 하고, 집에서도 재밌게 놀아주고, 강아지가 필요로 하는 것들을 잘 챙겨주는 편이에요.',
      },
    ]);
  }, []);

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

  const handleSearchClick = () => {};

  return (
    <div className="container inline-grid px-4 py-5 gap-y-5 h-full overflow-y-scroll">
      <h1 className="text-2xl subpixel-antialiased ">펫시터</h1>
      <div className="flex items-center container gap-5">
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
      <div>
        <div className="search">
          <span className="text-text text-sm">펫시터가 필요한 요일과 시간을 선택해보세요</span>
          <div className="days container flex items-center justify-center mt-3">
            {dayList.map((day, index) => (
              <div className="flex-1 flex items-center justify-center" key={day.name + index}>
                <div
                  onClick={() => handleDayClick(day.name)}
                  className={`day rounded-full w-10 h-10 text-center leading-10 text-slate-400 cursor-pointer ${!day.target ? 'bg-divider' : 'bg-secondary'}`}
                >
                  {day.name}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center items-center gap-5 mt-5">
            <div className="start flex justify-center items-center flex-col">
              <Dropdown
                label={'10:00'}
                options={dropDownTime}
                title={'Start Time'}
                onSelect={(option) => {
                  setStartTime(option);
                }}
              />
            </div>
            ~
            <div className="end">
              <Dropdown
                label={'10:00'}
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
