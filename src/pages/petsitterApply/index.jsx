import React, { useState, useMemo, useEffect } from 'react';
import Dropdown from '../../components/DropDown';
import axios from 'axios';
import Modal from '../../components/Modal';
import { storage } from '../../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import defaultProfileImage from '/src/assets/images/registerprofile.svg';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import { useUserStore } from '../../store/userStore';
import usePetSitterStore from '../../store/petsitterStore';

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
  const koreaRegions = {
    서울특별시: [
      '종로구',
      '중구',
      '용산구',
      '성동구',
      '광진구',
      '동대문구',
      '중랑구',
      '성북구',
      '강북구',
      '도봉구',
      '노원구',
      '은평구',
      '서대문구',
      '마포구',
      '양천구',
      '강서구',
      '구로구',
      '금천구',
      '영등포구',
      '동작구',
      '관악구',
      '서초구',
      '강남구',
      '송파구',
      '강동구',
    ],
    부산광역시: [
      '중구',
      '서구',
      '동구',
      '영도구',
      '부산진구',
      '동래구',
      '남구',
      '북구',
      '해운대구',
      '사하구',
      '금정구',
      '강서구',
      '연제구',
      '수영구',
      '사상구',
      '기장군',
    ],
    대구광역시: ['중구', '동구', '서구', '남구', '북구', '수성구', '달서구', '달성군'],
    인천광역시: ['중구', '동구', '미추홀구', '연수구', '남동구', '부평구', '계양구', '서구', '강화군', '옹진군'],
    광주광역시: ['동구', '서구', '남구', '북구', '광산구'],
    대전광역시: ['동구', '중구', '서구', '유성구', '대덕구'],
    울산광역시: ['중구', '남구', '동구', '북구', '울주군'],
    세종특별자치시: ['세종시'],
    경기도: [
      '수원시',
      '성남시',
      '의정부시',
      '안양시',
      '부천시',
      '광명시',
      '평택시',
      '동두천시',
      '안산시',
      '고양시',
      '과천시',
      '의왕시',
      '구리시',
      '남양주시',
      '오산시',
      '시흥시',
      '군포시',
      '의정부시',
      '하남시',
      '용인시',
      '파주시',
      '이천시',
      '안성시',
      '김포시',
      '화성시',
      '광주시',
      '양주시',
      '포천시',
      '여주시',
    ],
    강원도: [
      '춘천시',
      '원주시',
      '강릉시',
      '동해시',
      '태백시',
      '속초시',
      '삼척시',
      '홍천군',
      '횡성군',
      '영월군',
      '평창군',
      '정선군',
      '철원군',
      '화천군',
      '양구군',
      '인제군',
      '고성군',
      '양양군',
    ],
    충청북도: ['청주시', '충주시', '제천시', '보은군', '옥천군', '영동군', '진천군', '괴산군', '음성군', '단양군'],
    충청남도: [
      '천안시',
      '공주시',
      '보령시',
      '아산시',
      '서산시',
      '논산시',
      '계룡시',
      '당진시',
      '금산군',
      '부여군',
      '서천군',
      '청양군',
      '홍성군',
      '예산군',
      '태안군',
    ],
    전라북도: ['전주시', '군산시', '익산시', '정읍시', '남원시', '김제시', '완주군', '진안군', '무주군', '장수군', '임실군', '순창군', '고창군', '부안군'],
    전라남도: [
      '목포시',
      '여수시',
      '순천시',
      '나주시',
      '광양시',
      '담양군',
      '곡성군',
      '구례군',
      '고흥군',
      '보성군',
      '화순군',
      '장흥군',
      '강진군',
      '해남군',
      '영암군',
      '무안군',
      '함평군',
      '영광군',
      '장성군',
      '완도군',
      '진도군',
      '신안군',
    ],
    경상북도: [
      '포항시',
      '경주시',
      '김천시',
      '안동시',
      '구미시',
      '영주시',
      '영천시',
      '상주시',
      '문경시',
      '경산시',
      '군위군',
      '의성군',
      '청송군',
      '영양군',
      '영덕군',
      '청도군',
      '고령군',
      '성주군',
      '칠곡군',
      '예천군',
      '봉화군',
      '울진군',
      '울릉군',
    ],
    경상남도: [
      '창원시',
      '진주시',
      '통영시',
      '사천시',
      '김해시',
      '밀양시',
      '거제시',
      '양산시',
      '의령군',
      '함안군',
      '창녕군',
      '고성군',
      '남해군',
      '하동군',
      '산청군',
      '함양군',
      '거창군',
      '합천군',
    ],
    제주특별자치도: ['제주시', '서귀포시'],
  };
  const regionList = Object.keys(koreaRegions);
  const dropDownTime = ['09:00', '08:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];

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

  const handleDecodeDayList = (dayName) => {
    setDayList((prevDayList) => prevDayList.map((day) => (day.value === dayName ? { ...day, target: !day.target } : day)));
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

    const storageRef = ref(storage, `petsitter/${userData.id}`);
    await uploadBytes(storageRef, selectedImageFile);
    const downloadURL = await getDownloadURL(storageRef);

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
      const res = await axios.post('http://localhost:3000/api/petsitter/apply', params);

      userData.petsitter = 1;
      sessionStorage.setItem('userData', JSON.stringify(userData));
      login(userData);
      openModal();
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateSitter = async () => {
    try {
      const response = await axios.put('http://localhost:3000/api/petsitter/sitter/update', formData);
      if (response.status === 200) {
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
        const res = await axios.get('http://localhost:3000/api/petsitter/sitter/detail', { params: { id } });
        const data = res.data.data;

        setFormData({
          selectedImage: data.image,
          weekdays: data.weekdays,
          startTime: data.startTime,
          endTime: data.endTime,
          region: data.region,
          description: data.description,
          experience: data.experience,
        });
        const days = data.weekdays.split(',');
        for (let i = 0; i < days.length; i++) {
          handleDecodeDayList(days[i]);
        }
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

  useEffect(() => {
    setFormData((prev) => ({ ...prev, region2: '선택' }));
  }, [formData.region1]);

  return (
    <div className="p-10 bg-white h-full overflow-y-auto">
      <Toaster position="top-center" reverseOrder={false} />
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
        <span className="mt-5 text-alert text-sm">펫시터는 실명으로 활동하게 됩니다.</span>
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
            수정하기
          </button>
        </div>
      )}
    </div>
  );
};

export default index;
