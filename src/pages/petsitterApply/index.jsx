import React, { useState } from 'react';
import Dropdown from '../../components/DropDown';
import axios from 'axios';
import Modal from '../../components/Modal';
import { storage } from '../../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import defaultProfileImage from '/src/assets/images/registerprofile.svg';
import { useNavigate } from 'react-router-dom';

const index = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [formData, setFormData] = useState({
    selectedImage: defaultProfileImage,
    weekdays: '',
    startTime: '선택',
    endTime: '선택',
    region: '선택',
    description: '',
    experience: '',
  });
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
  const regionList = ['경기도 고양시', '서울특별시', '경기도 수원시', '경기도 화성시', '경기도 성남시'];
  const dropDownTime = ['09:00', '08:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    navigate('/petsitter');
  };

  const handleChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImageFile(file);
      setFormData((prev) => ({ ...prev, selectedImage: URL.createObjectURL(file) }));
    }
  };

  const handleProfileClick = () => {
    document.getElementById('profileImageUpload').click();
  };

  const handleDayClick = (dayName) => {
    setDayList((prevDayList) => prevDayList.map((day) => (day.name === dayName ? { ...day, target: !day.target } : day)));
  };

  const handleApplyAction = async () => {
    const userData = JSON.parse(sessionStorage.getItem('userData'));

    let str = '';
    for (let i = 0; i < dayList.length; i++) {
      if (dayList[i].target === true) str += `${dayList[i].value},`;
    }

    const storageRef = ref(storage, `petsitter/${userData.id}`);
    await uploadBytes(storageRef, selectedImageFile);
    const downloadURL = await getDownloadURL(storageRef);

    const params = {
      weekdays: str.slice(0, -1),
      description: formData.description,
      experience: formData.experience,
      startTime: formData.startTime,
      endTime: formData.endTime,
      region: formData.region,
      image: downloadURL,
      name: userData.name,
      userId: userData.id,
    };

    try {
      const res = await axios.post('http://localhost:3000/api/petsitter/apply', params);
      console.log(res);
      openModal();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-5">
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={
          <div>
            <span className="text-lg font-bold mr-2">펫시터 지원 완성!</span>
          </div>
        }
      >
        <div className="my-10 flex justify-center">
          <span className="text-black font-bold text-lg">
            지원서 검토 후 승인이 되면 펫시터로 활동하실 수 있습니다. 지원서 승인까지는 평균 2~3일 정도 소요됩니다.
          </span>
        </div>
        <div className="flex justify-center">
          <button className="text-white bg-primary px-4 py-2 rounded-lg font-normal w-[100px]" onClick={closeModal}>
            확인
          </button>
        </div>
      </Modal>
      <div className="mt-3 flex justify-center items-center flex-col">
        <div className="relative w-20 h-20 overflow-hidden cursor-pointer" onClick={handleProfileClick}>
          {formData.selectedImage !== defaultProfileImage ? (
            <img src={formData.selectedImage} alt="프로필 이미지" className="w-full h-full object-cover rounded-full" />
          ) : (
            <img src={defaultProfileImage} alt="기본 프로필 이미지" className="w-full h-full object-contain" />
          )}
        </div>
        <input type="file" id="profileImageUpload" accept="image/*" className="hidden" onChange={handleImageChange} />
        <span className="mt-5 text-alert font-normal text-base">펫시터는 실명으로 활동하게 됩니다.</span>
      </div>
      <div className="mt-5">
        <span className="text-text text-sm">근무 요일 *</span>
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
              label={formData.startTime}
              options={dropDownTime}
              title={'Start Time'}
              onSelect={(option) => {
                handleChange('startTime', option);
              }}
            />
          </div>
          ~
          <div className="flex items-center flex-col w-[150px]">
            <span>근무 종료 시간</span>
            <Dropdown
              width={'150'}
              label={formData.endTime}
              options={dropDownTime}
              title={'End Time'}
              onSelect={(option) => {
                handleChange('endTime', option);
              }}
            />
          </div>
        </div>
      </div>
      <div className="mt-3">
        <label className="block mb-2 text-sm font-medium text-gray-900">지역 *</label>
        <Dropdown
          label={formData.region}
          options={regionList}
          title={'Region'}
          onSelect={(option) => {
            handleChange('region', option);
          }}
        />
      </div>
      <div className="mt-3">
        <label className="block mb-2 text-sm font-medium text-gray-900">자기소개 *</label>
        <textarea
          type="text"
          className="block w-full p-2.5 h-40 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg mt-3"
          required
          onChange={(e) => handleChange('description', e.target.value)}
        />
      </div>
      <div className="mt-3">
        <label className="block mb-2 text-sm font-medium text-gray-900">경험 *</label>
        <textarea
          type="text"
          className="block w-full p-2.5 h-40 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg mt-3"
          required
          onChange={(e) => handleChange('experience', e.target.value)}
        />
      </div>
      <div className="flex justify-center mt-10">
        <button className="text-white bg-primary px-4 py-2 rounded-lg font-normal w-[150px]" onClick={handleApplyAction}>
          완료하기
        </button>
      </div>
    </div>
  );
};

export default index;
