import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Dropdown from '../../components/DropDown';
import DogChew from '../../components/DogChew';
import ToolTip from '../../components/ToolTip';
import useReservationStore from '../../store/reservationStore';

const index = ({ handleNextStep }) => {
  const { setReservationData } = useReservationStore();
  const dropDownTime = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];
  const [formData, setFormData] = useState({
    user_id: '',
    sitter_id: '',
    requestDate: '',
    startTime: '선택',
    endTime: '선택',
    status: 'reserved',
    request: '',
    pet: '선택',
    dogSize: '',
    workingTime: '',
    price: 0,
  });
  const petList = ['말티즈', '시츄', '리트리버', '푸들'];
  const location = useLocation();
  const { name } = location.state || '';

  const getTime = (time) => {
    if (time === '선택') {
      return 0;
    } else {
      const hours = parseInt(time.split(':')[0]);
      return hours;
    }
  };

  const handleSizeCost = () => {
    if (formData.dogSize === 'md') return 50;
    else if (formData.dogSize === 'lg') return 100;
    else return 0;
  };

  const handleChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const calculateTimeDifference = useMemo(() => {
    const startInHours = getTime(formData.startTime);
    const endInHours = getTime(formData.endTime);
    return endInHours - startInHours;
  }, [formData.startTime, formData.endTime]);

  const handlePrice = useMemo(() => {
    const timeDifference = calculateTimeDifference;
    return handleSizeCost() * timeDifference + 150 * timeDifference;
  }, [formData.startTime, formData.endTime, formData.dogSize]);

  useEffect(() => {
    handleChange('price', handlePrice);
  }, [handlePrice]);

  useEffect(() => {
    handleChange('workingTime', calculateTimeDifference);
  }, [calculateTimeDifference]);

  const handleReservationInfo = () => {
    let str = '';
    Object.entries(formData).map((item) => {
      if (item[0] === 'requestDate' && item[1] === '') {
        str += '날짜, ';
      }
      if (item[0] === 'pet' && item[1] === '선택') {
        str += '반려동물 선택란, ';
      }
      if (item[0] === 'dogSize' && item[1] === '') {
        str += '반려동물 사이즈 선택란, ';
      }
      if (item[0] === 'startTime' && item[1] === '선택') {
        str += '시작시간, ';
      }
      if (item[0] === 'endTime' && item[1] === '선택') {
        str += '종료시간, ';
      }
    });
    if (str.length > 0) {
      alert(`${str}은 필수 입력 란입니다.`);
      return null;
    }
    console.log(formData);
    setReservationData(formData);
    handleNextStep();
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
        <input
          type="text"
          className="block w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg mt-3"
          required
          onChange={(e) => handleChange('requestDate', e.target.value)}
        />
      </div>
      <div className="mt-3">
        <label className="block mb-2 text-sm font-medium text-gray-900">시간 *</label>
        <div className="flex justify-center items-center gap-5 mt-3">
          <Dropdown
            label={formData.startTime}
            options={dropDownTime}
            title={'Start Time'}
            onSelect={(option) => {
              handleChange('startTime', option);
            }}
          />
          ~
          <Dropdown
            label={formData.endTime}
            options={dropDownTime}
            title={'Start Time'}
            onSelect={(option) => {
              handleChange('endTime', option);
            }}
          />
        </div>
      </div>
      <div className="mt-3">
        <label className="block mb-2 text-sm font-medium text-gray-900">반려동물 선택 *</label>
        <Dropdown
          label={formData.pet}
          options={petList}
          title={'Start Time'}
          onSelect={(option) => {
            handleChange('pet', option);
          }}
        />
      </div>
      <div className="mt-3">
        <label className="block mb-2 text-sm font-medium text-gray-900">요청사항 *</label>
        <textarea
          type="text"
          className="block w-full p-2.5 h-40 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg mt-3"
          required
          onChange={(e) => handleChange('request', e.target.value)}
        />
      </div>
      <div className="flex justify-center mt-3">
        <span className="text-slate-400 text-sm">예약이 완료된 후 펫시터와 채팅으로도 소통할 수 있습니다.</span>
      </div>
      <div className="mt-5">
        <div className="flex items-center">
          <span>반려견 사이즈</span>
          <ToolTip
            text={[
              '반려견 크기 안내',
              '소형견: 10kg 이하 (ex: 말티즈, 포메라니안, 비숑 프리제)',
              '중형견: 10kg ~ 25kg (ex: 코카 스파니엘, 보더콜리, 휘핏)',
              '대형견: 25kg 이상 (ex: 저먼 셰퍼드, 골든 리트리버, 도베르만 핀셔)',
              '⚠️ 반려동물에 대한 허위 사실 기재 시 추가비용이 발생 할 수 있으며, 향후 펫시터 서비스 이용에 패널티가 작용할 수 있습니다.',
            ]}
            style={{
              left: '200px',
              width: '450px',
            }}
          >
            <button className="w-6 h-6 bg-divider text-gray-500 rounded-full ml-5">?</button>
          </ToolTip>
        </div>
        <div className="flex justify-center gap-20 mt-5">
          <div className="flex items-center justify-center flex-col">
            <button
              className={`rounded-xl border-primary px-7 py-1 border ${formData.dogSize === 'sm' ? 'bg-primary text-white' : 'text-primary bg-white'}`}
              onClick={() => handleChange('dogSize', 'sm')}
            >
              소
            </button>
            <span className="text-transparent mt-1">none</span>
          </div>
          <div className="flex items-center justify-center flex-col">
            <button
              className={`rounded-xl border-primary px-7 py-1 border ${formData.dogSize === 'md' ? 'bg-primary text-white' : 'text-primary bg-white'}`}
              onClick={() => handleChange('dogSize', 'md')}
            >
              중
            </button>
            <span className="text-sm text-gray-950 mt-1"> + 50개</span>
          </div>
          <div className="flex items-center justify-center flex-col">
            <button
              className={`rounded-xl border-primary px-7 py-1 border ${formData.dogSize === 'lg' ? 'bg-primary text-white' : 'text-primary bg-white'}`}
              onClick={() => handleChange('dogSize', 'lg')}
            >
              대
            </button>
            <span className="text-sm text-gray-950 mt-1">+ 100개</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <div className="flex justify-between w-full mt-5">
          <div className="">
            <span>펫시터 서비스 비용</span>
            <p className="text-sm text-gray-500 font-light">( 시간당 개껌 150개 )</p>
          </div>
          <div>
            <span>{`150개 X ${calculateTimeDifference}(시간) =`}</span>
            <p className="flex">
              <DogChew />
              {150 * calculateTimeDifference} 개
            </p>
          </div>
        </div>
        <div className="flex justify-between w-full mt-5 items-center">
          <div className="">
            <span>반려견 사이즈 추가 비용</span>
          </div>
          <div>
            <span>{`${handleSizeCost()}개 X ${calculateTimeDifference}(시간) =`}</span>
            <p className="flex">
              <DogChew />
              {`${handleSizeCost() * calculateTimeDifference}개`}
            </p>
          </div>
        </div>
        <div className="flex justify-between w-full mt-5 items-center">
          <span>최종 차감될</span>
          <span className="font-bold flex">
            <DogChew />
            {`${handlePrice}개`}
          </span>
        </div>
      </div>
      <div className="flex justify-center mt-10">
        <button className="text-white bg-primary px-4 py-2 rounded-lg font-normal w-[150px]" onClick={handleReservationInfo}>
          다음
        </button>
      </div>
    </div>
  );
};

export default index;
