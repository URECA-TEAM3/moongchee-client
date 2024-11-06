import React, { useState, useMemo, useEffect } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { ko } from 'date-fns/locale';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import Dropdown from '../../components/DropDown';
import DogChew from '../../components/DogChew';
import ToolTip from '../../components/ToolTip';
import useReservationStore from '../../store/reservationStore';
import usePetSitterStore from '../../store/petsitterStore';
import { useUserStore } from '../../store/userStore';

const index = ({ handleNextStep }) => {
  const { id } = useUserStore();
  const { setReservationData } = useReservationStore();
  const { petsitter } = usePetSitterStore();
  const dropDownTime = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];
  const [formData, setFormData] = useState({
    user_id: id,
    sitter_id: petsitter.id,
    requestDate: '',
    startTime: petsitter.startTime,
    endTime: petsitter.endTime,
    status: 'reserved',
    request: '',
    pet: '선택',
    dogSize: '',
    workingTime: '',
    price: 0,
  });
  const [petList, setPetList] = useState([]);

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

  const handlePetList = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/pets/${id}`);
      const petList = res.data.map((pet) => pet.name);
      setPetList(petList);
    } catch (error) {
      console.error(error);
    }
  };

  const isWeekday = (date) => {
    const dayMapping = {
      SUN: 0,
      MON: 1,
      TUE: 2,
      WED: 3,
      THU: 4,
      FRI: 5,
      SAT: 6,
    };

    const allowedDays = petsitter.weekdays.split(',');
    const day = date.getDay();
    return allowedDays.map((day) => dayMapping[day]).includes(day);
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

  const availableStartTimes = useMemo(() => {
    const startIndex = dropDownTime.indexOf(petsitter.startTime);
    const endIndex = dropDownTime.indexOf(petsitter.endTime);
    return dropDownTime.slice(startIndex, endIndex + 1);
  }, [petsitter.startTime, petsitter.endTime]);

  const availableEndTimes = useMemo(() => {
    const startIndex = Math.max(dropDownTime.indexOf(formData.startTime), dropDownTime.indexOf(petsitter.startTime));
    const endIndex = dropDownTime.indexOf(petsitter.endTime);
    return startIndex >= 0 ? dropDownTime.slice(startIndex + 1, endIndex + 1) : [];
  }, [formData.startTime, petsitter.startTime, petsitter.endTime]);

  const validateFields = () => {
    const newErrors = {};
    Object.entries(formData).map((item) => {
      if (item[0] === 'requestDate' && item[1] === '') {
        newErrors.requestDate = '날짜를 입력해주세요.';
      }
      if (item[0] === 'pet' && item[1] === '선택') {
        newErrors.pet = '반려동물을 선택해주세요.';
      }
      if (item[0] === 'dogSize' && item[1] === '') {
        newErrors.dogSize = '반려견 사이즈 선택해주세요.';
      }
      if (item[0] === 'startTime' && item[1] === '선택') {
        newErrors.startTime = '시작시간을 선택해주세요.';
      }
      if (item[0] === 'endTime' && item[1] === '선택') {
        newErrors.endTime = '종료시간을 선택해주세요.';
      }
    });
    return Object.keys(newErrors).length === 0;
  };

  const handleReservationInfo = () => {
    if (!validateFields()) {
      toast.error('필수 항목을 모두 입력해주세요.');
      return null;
    }
    setReservationData(formData);
    handleNextStep();
  };

  useEffect(() => {
    handleChange('price', handlePrice);
  }, [handlePrice]);

  useEffect(() => {
    handleChange('workingTime', calculateTimeDifference);
  }, [calculateTimeDifference]);

  useEffect(() => {
    handlePetList();
  }, []);

  return (
    <div className="py-10">
      <div className="px-10">
        <Toaster position="top-center" reverseOrder={false} />
        <h1 className="font-bold">예약하기</h1>
        <div className="profile flex items-center mt-3">
          <img src={petsitter.imageUrl} className="object-cover object-center w-16 h-16 rounded-full " />
          <div className="personal ml-5">
            <span className="text-lg font-medium">{petsitter.name}</span>
          </div>
        </div>
        <div className="mt-5">
          <label className="block mb-1 text-sm font-medium">날짜 *</label>
          <div className="flex items-center space-x-2 mb-1">
            <DatePicker
              selected={formData.requestDate}
              onChange={(date) =>
                handleChange(
                  'requestDate',
                  `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
                )
              }
              dateFormat="yyyy/MM/dd"
              placeholderText="YYYY/MM/DD"
              className={`block w-full p-2 border rounded-lg`}
              showYearDropdown
              showMonthDropdown
              minDate={new Date()}
              dropdownMode="select"
              filterDate={isWeekday}
              maxDate={new Date().setFullYear(new Date().getFullYear() + 1)}
              yearDropdownItemNumber={100}
              locale={ko}
            />
          </div>
        </div>
        <div className="mt-3">
          <label className="block mb-1 text-sm font-medium">시간 *</label>
          <div className="flex justify-center items-center gap-5 mb-1">
            <Dropdown
              label={formData.startTime}
              options={availableStartTimes}
              title={'Start Time'}
              onSelect={(option) => {
                handleChange('startTime', option);
              }}
            />
            ~
            <Dropdown
              label={formData.endTime}
              options={availableEndTimes}
              title={'Start Time'}
              onSelect={(option) => {
                handleChange('endTime', option);
              }}
            />
          </div>
        </div>
        <div className="mt-3">
          <label className="block mb-1 text-sm font-medium">반려동물 선택 *</label>
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
          <label className="block mb-1 text-sm font-medium">요청사항 *</label>
          <textarea
            type="text"
            className="block w-full p-2.5 h-40 bg-white border border-divider text-sm rounded-lg"
            required
            onChange={(e) => handleChange('request', e.target.value)}
          />
        </div>
        <div className="flex justify-center mt-3">
          {/* <span className="text-slate-400 text-sm">예약이 완료된 후 펫시터와 채팅으로도 소통할 수 있습니다.</span> */}
        </div>
        <div className="mt-5">
          <div className="flex items-center">
            <span>반려견 사이즈 *</span>
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
              <button className="w-5 h-5 text-sm border border-primary text-primary rounded-full ml-5">i</button>
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
      </div>
      <div className="flex flex-col items-center">
        <div className="flex justify-between w-full mt-5 px-10">
          <div className="">
            <span>펫시터 서비스 비용</span>
            <p className="text-sm font-light">( 시간당 개껌 150개 )</p>
          </div>
          <div className="">
            <span>{`150개 X ${calculateTimeDifference}(시간) =`}</span>
            <p className="flex justify-end">
              <DogChew />
              {150 * calculateTimeDifference} 개
            </p>
          </div>
        </div>
        <div className="flex justify-between w-full mt-5 items-center px-10">
          <div>
            <span>반려견 사이즈 추가 비용</span>
          </div>
          <div>
            <span>{`${handleSizeCost()}개 X ${calculateTimeDifference}(시간) =`}</span>
            <p className="flex justify-end">
              <DogChew />
              {`${handleSizeCost() * calculateTimeDifference}개`}
            </p>
          </div>
        </div>
        <div className="w-full flex justify-between items-center py-4 bg-paleblue mt-5 px-10">
          <div className="flex">
            <span className="mr-2">최종 차감 될 </span> <DogChew />
          </div>
          <div className="font-bold"> {`${handlePrice}개`}</div>
        </div>
      </div>
      <div className="flex w-full justify-center mt-10 px-10">
        <button className="text-white w-full h-12 bg-primary px-4 py-2 rounded-lg" onClick={handleReservationInfo}>
          다음
        </button>
      </div>
    </div>
  );
};

export default index;
