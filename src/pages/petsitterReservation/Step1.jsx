import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Dropdown from '../../components/DropDown';
import DogChew from '../../components/DogChew';

const index = ({ handleNextStep }) => {
  const [startTime, setStartTime] = useState('08:00 AM');
  const [endTime, setEndTime] = useState('08:00 AM');
  const [selected, setSelected] = useState('sm');
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
  const { name } = location.state || '';

  const getTime = (time) => {
    const hours = parseInt(time.split(':')[0]);
    return hours;
  };

  const calculateTimeDifference = () => {
    const startInHours = getTime(startTime);
    const endInHours = getTime(endTime);
    const differenceInHours = endInHours - startInHours;

    return differenceInHours;
  };

  const handleSizeCost = () => {
    if (selected === 'sm') return 0;
    else if (selected === 'md') return 50;
    else return 100;
  };

  const handleSizeCheck = (value) => {
    setSelected(value);
  };

  return (
    <div className="p-5">
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
      <div className="mt-5">
        <span>반려견 사이즈</span>
        <div className="flex justify-center gap-20 mt-5">
          <div className="flex items-center justify-center flex-col">
            <button
              className={`rounded-xl border-primary px-7 py-1 border ${selected === 'sm' ? 'bg-primary text-white' : 'text-primary bg-white'}`}
              onClick={() => handleSizeCheck('sm')}
            >
              소
            </button>
            <span className="text-transparent mt-1">none</span>
          </div>
          <div className="flex items-center justify-center flex-col">
            <button
              className={`rounded-xl border-primary px-7 py-1 border ${selected === 'md' ? 'bg-primary text-white' : 'text-primary bg-white'}`}
              onClick={() => handleSizeCheck('md')}
            >
              중
            </button>
            <span className="text-sm text-gray-950 mt-1"> + 50개</span>
          </div>
          <div className="flex items-center justify-center flex-col">
            <button
              className={`rounded-xl border-primary px-7 py-1 border ${selected === 'lg' ? 'bg-primary text-white' : 'text-primary bg-white'}`}
              onClick={() => handleSizeCheck('lg')}
            >
              대
            </button>
            <span className="text-sm text-gray-950 mt-1">+ 100개</span>
          </div>
        </div>
      </div>
      <div className="text-gray-400 font-medium leading-8 text-sm-">
        반려견 크기 안내 <br /> 소형견: 10kg 이하 (ex: 말티즈, 포메라니안, 비숑 프리제) <br />
        중형견: 10kg ~ 25kg (ex: 코카 스파니엘, 보더콜리, 휘핏) <br />
        대형견: 25kg 이상 (ex: 저먼 셰퍼드, 골든 리트리버, 도베르만 핀셔) <br />
        ⚠️ 반려동물에 대한 허위 사실 기재 시 추가비용이 발생 할 수 있으며, 향후 펫시터 서비스 이용에 패널티가 작용할 수 있습니다.
      </div>
      <div className="flex flex-col items-center">
        <div className="flex justify-between w-full mt-5">
          <div className="">
            <span>펫시터 서비스 비용</span>
            <p className="text-sm text-gray-500 font-light">( 시간당 개껌 150개 )</p>
          </div>
          <div>
            <span>{`150개 X ${calculateTimeDifference()}(시간) =`}</span>
            <p className="flex">
              <DogChew />
              {150 * calculateTimeDifference()} 개
            </p>
          </div>
        </div>
        <div className="flex justify-between w-full mt-5 items-center">
          <div className="">
            <span>반려견 사이즈 추가 비용</span>
          </div>
          <div>
            <span>{`${handleSizeCost()}개 X ${calculateTimeDifference()}(시간) =`}</span>
            <p className="flex">
              <DogChew />
              {`${handleSizeCost() * calculateTimeDifference()}개`}
            </p>
          </div>
        </div>
        <div className="flex justify-between w-full mt-5 items-center">
          <span>최종 차감될</span>
          <span className="font-bold flex">
            <DogChew />
            {`${handleSizeCost() * calculateTimeDifference() + 150 * calculateTimeDifference()}개`}
          </span>
        </div>
      </div>
      <div className="flex justify-center mt-10">
        <button className="text-white bg-primary px-4 py-2 rounded-lg font-normal w-[150px]" onClick={handleNextStep}>
          다음
        </button>
      </div>
    </div>
  );
};

export default index;
