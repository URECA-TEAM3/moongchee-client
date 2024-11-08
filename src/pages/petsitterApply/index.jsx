import React, { useState, useMemo, useEffect } from 'react';
import Dropdown from '../../components/DropDown';
import Modal from '../../components/Modal';
import { storage } from '../../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import defaultProfileImage from '/src/assets/images/registerprofile.svg';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import { useUserStore } from '../../store/userStore';
import usePetSitterStore from '../../store/petsitterStore';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { getPetsitter, applyPetsitter, updatePetsitter } from '../../api/petsitter';
import { koreaRegions, dropDownTime, daysList } from '../../constants/petsitter';

const index = () => {
  const { id } = useUserStore();
  const { type } = usePetSitterStore();
  const { login } = useUserStore((state) => state);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [formData, setFormData] = useState({
    selectedImage: defaultProfileImage,
    weekdays: '',
    startTime: '선택',
    endTime: '선택',
    region1: '선택',
    region2: '선택',
    description: '',
    experience: '',
  });
  const [dayList, setDayList] = useState(daysList);
  const regionList = Object.keys(koreaRegions);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    navigate('/petsitter');
  };

  const availableEndTimes = useMemo(() => {
    const startIndex = dropDownTime.indexOf(formData.startTime);
    return startIndex >= 0 ? dropDownTime.slice(startIndex + 1) : dropDownTime;
  }, [formData.startTime]);

  const handleChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (name === 'region1') setFormData((prev) => ({ ...prev, region2: '선택' }));
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

  const validateFields = () => {
    const newErrors = {};
    Object.entries(formData).map((item) => {
      if (item[0] === 'description' && item[1] === '') {
        newErrors.description = '자기소개를 입력해주세요.';
      }
      if (item[0] === 'experience' && item[1] === '') {
        newErrors.experience = '경험을 선택해주세요.';
      }
      if (item[0] === 'region1' && item[1] === '선택') {
        newErrors.region = '지역을 선택해주세요.';
      }
      if (item[0] === 'region2' && item[1] === '선택') {
        newErrors.region = '지역을 선택해주세요.';
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

  const handleApplyAction = async () => {
    if (!validateFields()) {
      toast.error('필수 항목을 모두 입력해주세요.');
      return null;
    }

    const userData = JSON.parse(sessionStorage.getItem('userData'));

    let str = '';
    for (let i = 0; i < dayList.length; i++) {
      if (dayList[i].target === true) str += `${dayList[i].value},`;
    }

    let downloadURL;
    if (selectedImageFile) {
      const storageRef = ref(storage, `petsitter/${userData.id}`);
      await uploadBytes(storageRef, selectedImageFile);
      downloadURL = await getDownloadURL(storageRef);
    } else {
      downloadURL = defaultProfileImage;
    }

    const params = {
      weekdays: str.slice(0, -1),
      description: formData.description,
      experience: formData.experience,
      startTime: formData.startTime,
      endTime: formData.endTime,
      region: `${formData.region1} ${formData.region2}`,
      image: downloadURL,
      name: userData.name,
      userId: userData.id,
    };

    try {
      await applyPetsitter(params);

      userData.petsitter = 1;
      sessionStorage.setItem('userData', JSON.stringify(userData));

      login(userData);
      openModal();
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateSitter = async () => {
    if (!validateFields()) {
      toast.error('필수 항목을 모두 입력해주세요.');
      return null;
    }

    const userData = JSON.parse(sessionStorage.getItem('userData'));

    let str = '';
    for (let i = 0; i < dayList.length; i++) {
      if (dayList[i].target === true) str += `${dayList[i].value},`;
    }

    let downloadURL;
    if (selectedImageFile) {
      const storageRef = ref(storage, `petsitter/${userData.id}`);
      await uploadBytes(storageRef, selectedImageFile);
      downloadURL = await getDownloadURL(storageRef);
    } else {
      downloadURL = defaultProfileImage;
    }

    const params = {
      weekdays: str.slice(0, -1),
      description: formData.description,
      experience: formData.experience,
      startTime: formData.startTime,
      endTime: formData.endTime,
      region: `${formData.region1} ${formData.region2}`,
      image: downloadURL,
      status: 'confirmed',
      name: userData.name,
      userId: userData.id,
    };

    try {
      const res = await updatePetsitter(params);
      if (res.status === 200) {
        toast.success('시터 정보가 성공적으로 수정되었습니다.');
        fetchSitterDetail();
      }
    } catch (error) {
      console.error('시터 정보 수정 실패:', error);
      toast.error('수정에 실패했습니다.');
    }
  };

  const fetchSitterDetail = async () => {
    if (type === 'update') {
      try {
        const info = await getPetsitter(id);
        setFormData(info);

        const days = info.weekdays.split(',');
        setDayList((prevDayList) =>
          prevDayList.map((day) => ({
            ...day,
            target: days.includes(day.value),
          }))
        );
      } catch (error) {
        console.log(error);
      }
    } else {
      return null;
    }
  };

  const cities = useMemo(() => {
    return formData.region1 !== '선택' ? koreaRegions[formData.region1] : [];
  }, [formData.region1]);

  useEffect(() => {
    fetchSitterDetail();
  }, []);

  return (
    <div className="p-10 bg-white h-full overflow-y-auto">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="relative w-full flex items-center mb-3">
        <button onClick={() => navigate(-1)} className="absolute left-0">
          <ChevronLeftIcon className="h-6 w-6" stroke="black" />
        </button>
        <h1 className="mx-auto font-bold">펫시터 프로필 수정</h1>
      </div>

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
          <span>지원서 검토 후 승인이 되면 펫시터로 활동하실 수 있습니다. 지원서 승인까지는 평균 2~3일 정도 소요됩니다.</span>
        </div>
        <div className="flex justify-center">
          <button className="text-white bg-primary px-4 py-2 rounded-lg font-normal w-[100px]" onClick={closeModal}>
            확인
          </button>
        </div>
      </Modal>
      <div className="mt-4 flex justify-center items-center flex-col">
        <div className="relative w-20 h-20 overflow-hidden cursor-pointer" onClick={handleProfileClick}>
          {formData.selectedImage !== defaultProfileImage ? (
            <img src={formData.selectedImage} alt="프로필 이미지" className="w-full h-full object-cover rounded-full" />
          ) : (
            <img src={defaultProfileImage} alt="기본 프로필 이미지" className="w-full h-full object-contain" />
          )}
        </div>
        <input type="file" id="profileImageUpload" accept="image/*" className="hidden" onChange={handleImageChange} />
        <span className="mt-5 text-alert text-sm">펫시터는 실명으로 활동하게 됩니다.</span>
      </div>
      <div className="mt-3">
        <span className="text-text text-sm">근무 요일 *</span>
        <div className="days container flex items-center justify-center mt-3">
          {dayList.map((day, index) => (
            <div className="flex-1 flex items-center justify-center" key={day.name + index}>
              <div
                onClick={() => handleDayClick(day.name)}
                className={`day rounded-full w-10 h-10 text-center leading-10 cursor-pointer ${!day.target ? 'bg-divider' : 'bg-primary text-white'}`}
              >
                {day.name}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center items-center gap-5 mt-5">
          <div className="flex items-center flex-col w-[150px]">
            <span className="text-sm">근무 시작 시간</span>
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
            <span className="text-sm">근무 종료 시간</span>
            <Dropdown
              width={'150'}
              label={formData.endTime}
              options={availableEndTimes}
              title={'End Time'}
              onSelect={(option) => {
                handleChange('endTime', option);
              }}
            />
          </div>
        </div>
      </div>
      <div className="mt-3">
        <label className="block mb-2 text-sm font-medium">지역 *</label>
        <div className="flex gap-5">
          <Dropdown
            label={formData.region1}
            options={regionList}
            title={'Region'}
            onSelect={(option) => {
              handleChange('region1', option);
            }}
          />
          <Dropdown
            label={formData.region2}
            options={cities}
            title={'Region'}
            onSelect={(option) => {
              handleChange('region2', option);
            }}
          />
        </div>
      </div>
      <div className="mt-3">
        <label className="block mb-2 text-sm font-medium ">자기소개 *</label>
        <textarea
          type="text"
          className="block w-full p-2.5 h-40 border border-divider text-sm rounded-lg mt-3"
          required
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
        />
      </div>
      <div className="mt-3">
        <label className="block mb-2 text-sm font-medium ">경험 *</label>
        <textarea
          type="text"
          className="block w-full p-2.5 h-40 border border-divider text-sm rounded-lg mt-3"
          required
          value={formData.experience}
          onChange={(e) => handleChange('experience', e.target.value)}
        />
      </div>
      {type === 'apply' ? (
        <div className="flex justify-center mt-10">
          <button className="text-white bg-primary px-4 py-2 rounded-lg w-full h-12" onClick={handleApplyAction}>
            완료하기
          </button>
        </div>
      ) : (
        <div className="flex justify-center mt-10">
          <button className="text-white bg-primary px-4 py-2 rounded-lg w-full h-12" onClick={handleUpdateSitter}>
            저장하기
          </button>
        </div>
      )}
    </div>
  );
};

export default index;
