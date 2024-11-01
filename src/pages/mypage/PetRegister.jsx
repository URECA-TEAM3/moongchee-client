import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useRef, useState } from 'react';
import petProfileImage from '/src/assets/images/registerpetprofile.svg';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../firebase';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PetRegister = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [species, setSpecies] = useState('');
  const [gender, setGender] = useState('');
  const [neutered, setNeutered] = useState('');
  const [userId, setUserId] = useState(null);
  const [profileImage, setProfileImage] = useState(petProfileImage);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const userData = sessionStorage.getItem('userData');
    if (userData) {
      const parsedData = JSON.parse(userData); // JSON 파싱
      setUserId(parsedData.id);
    }
  }, []);

  const validateFields = () => {
    const newErrors = {};
    if (!name) newErrors.name = '이름을 입력해주세요';
    if (!age) newErrors.age = '나이를 입력해주세요';
    else if (parseInt(age, 10) < 0) newErrors.age = '올바른 값을 입력해주세요';
    if (!weight) newErrors.weight = '몸무게를 입력해주세요';
    if (!species) newErrors.species = '견종을 입력해주세요';
    if (!gender) newErrors.gender = '성별을 선택해주세요';
    if (!neutered) newErrors.neutered = '중성화 여부를 선택해주세요';
    setErrors(newErrors);

    if (!name || !age || !species || !gender || !neutered || !weight) {
      toast.error('항목을 모두 입력해주세요.');
      return false;
    }
    return true;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImageFile(file);
      setProfileImage(URL.createObjectURL(file));
    }
  };

  const handleWeightChange = (e) => {
    const value = e.target.value;

    if (/^(?!-)[0-9]*\.?[0-9]*$/.test(value)) {
      setWeight(value);
    }
  };

  const validateSingleField = (field, value) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: value ? '' : prevErrors[field],
    }));
  };

  const handleSave = async () => {
    if (!validateFields()) {
      toast.error('필수 항목을 모두 입력해주세요.');
      return;
    }

    const surgery = neutered === 'yes';

    try {
      let animalImageUrl = null;
      if (selectedImageFile) {
        const storageRef = ref(storage, `animals/${userId}`);
        await uploadBytes(storageRef, selectedImageFile);
        animalImageUrl = await getDownloadURL(storageRef);
      }

      const response = await axios.post('http://localhost:3000/api/pets/animal-register', {
        userId,
        name,
        age,
        weight,
        species,
        gender,
        surgery,
        animalImageUrl,
      });
      setIsSavedModalOpen(true);
    } catch (error) {
      console.error('반려동물 정보 저장 오류:', error);
    }
  };

  return (
    <div className="flex flex-col items-center bg-white min-h-screen">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="relative w-full flex items-center mb-6 mt-6">
        <button onClick={() => navigate('/mypage')} className="absolute left-0 ml-1">
          <ChevronLeftIcon className="h-6 w-6 ml-5" stroke="black" />
        </button>
        <h1 className="mx-auto text-lg font-bold">반려동물 등록</h1>
      </div>

      <div className="mb-6">
        <div className="relative w-20 h-20 overflow-hidden cursor-pointer" onClick={() => fileInputRef.current.click()}>
          {profileImage !== petProfileImage ? (
            <img src={profileImage} alt="반려동물 프로필 이미지" className="w-full h-full object-cover rounded-full" />
          ) : (
            <img src={profileImage} alt="반려동물 기본 프로필 이미지" className="w-full h-full object-contain" />
          )}
        </div>
        <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleImageChange} />
      </div>

      <div>
        {[
          { label: '이름*', value: name, setter: setName, errorKey: 'name' },
          { label: '나이*', value: age, setter: setAge, errorKey: 'age', type: 'number' },
          { label: '견종*', value: species, setter: setSpecies, errorKey: 'species' },
        ].map(({ label, value, setter, errorKey, type = 'text' }) => (
          <div key={label} className="w-full max-w-md mb-4">
            <label className="block text-sm font-medium mb-2 text-left">{label}</label>
            <input
              type={type}
              placeholder={label.replace('*', '')}
              value={value}
              onChange={(e) => {
                setter(e.target.value);
                validateSingleField(errorKey, e.target.value);
              }}
              className={`block w-full p-2 border ${errors[errorKey] ? 'border-red-500' : 'border-gray-300'} rounded`}
            />
          </div>
        ))}

        <label className="block text-sm font-medium mb-2 text-left w-full max-w-md">성별*</label>
        <div className="flex justify-between mb-4 w-full max-w-md space-x-2">
          {['male', 'female'].map((type) => (
            <button
              key={type}
              onClick={() => {
                setGender(type);
                validateSingleField('gender', type);
              }}
              className={`w-1/2 py-2 border-2 rounded-[10px] ${
                gender === type ? 'border-blue-500 text-blue-500' : 'border-gray-200 text-black'
              } hover:border-blue-500 hover:text-blue-500 transition-colors`}
            >
              {type === 'male' ? '남아' : '여아'}
            </button>
          ))}
        </div>

        <label className="block text-sm font-medium mb-2 text-left w-full max-w-md">중성화 수술 여부*</label>
        <div className="flex justify-between mb-4 w-full max-w-md space-x-2">
          {['yes', 'no'].map((option) => (
            <button
              key={option}
              onClick={() => {
                setNeutered(option);
                validateSingleField('neutered', option);
              }}
              className={`w-1/2 py-2 border-2 rounded-[10px] ${
                neutered === option ? 'border-blue-500 text-blue-500' : 'border-gray-200 text-black'
              } hover:border-blue-500 hover:text-blue-500 transition-colors`}
            >
              {option === 'yes' ? '했어요' : '안했어요'}
            </button>
          ))}
        </div>

        <label className="block text-sm font-medium mb-2 text-left w-full max-w-md">몸무게*</label>
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="몸무게"
            className={`block w-full p-2 pr-12 border ${errors.weight ? 'border-red-500' : 'border-gray-300'} rounded`}
            value={weight}
            onChange={(e) => {
              handleWeightChange(e);
              validateSingleField('weight', e.target.value);
            }}
          />
          <span className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${weight ? 'text-black' : 'text-gray-400'}`}>kg</span>
        </div>

        <div className="flex justify-between p-5 w-full">
          <button onClick={() => navigate('/mypage')} className="py-2 bg-divider text-gray-400 rounded-lg w-48">
            취소
          </button>
          <button
            onClick={() => {
              if (!validateFields()) {
                return;
              }
              setIsModalOpen(true);
            }}
            className="py-2 ml-5 bg-primary rounded-lg w-48 text-white"
          >
            저장
          </button>
        </div>
      </div>

      {/* Saved Confirm Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg text-center w-80 h-auto p-6">
            <h2 className="text-base font-extrabold mb-6">반려동물을 등록하시겠습니까?</h2>
            <div className="flex justify-center space-x-4">
              <button onClick={() => setIsModalOpen(false)} className="px-12 py-2 bg-divider text-gray-500 rounded-lg">
                취소
              </button>
              <button onClick={handleSave} className="px-12 py-2 bg-primary text-white rounded-lg">
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Saved Success Modal */}
      {isSavedModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg text-center w-80 h-auto p-6">
            <h2 className="text-base font-extrabold mb-6">반려동물이 등록되었습니다.</h2>
            <button
              onClick={() => {
                setIsSavedModalOpen(false);
                navigate('/mypage');
              }}
              className="px-12 py-2 bg-primary text-white rounded-lg"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PetRegister;
