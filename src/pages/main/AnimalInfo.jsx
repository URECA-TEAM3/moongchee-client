import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../firebase';
import { toast, Toaster } from 'react-hot-toast';
import registerPetProfileImage from '/src/assets/images/registerpetprofile.svg';

const AnimalInfo = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [species, setSpecies] = useState('');
  const [gender, setGender] = useState('');
  const [neutered, setNeutered] = useState('');
  const [userId, setUserId] = useState(null);
  const [profileImage, setProfileImage] = useState(registerPetProfileImage);
  const [selectedImageFile, setSelectedImageFile] = useState(null);

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const inputFields = [
    { label: '이름*', value: name, setter: setName, errorKey: 'name', type: 'text' },
    { label: '나이*', value: age, setter: setAge, errorKey: 'age', type: 'number' },
    { label: '견종*', value: species, setter: setSpecies, errorKey: 'species', type: 'text' },
  ];

  const genderOptions = [
    { type: 'male', label: '남아' },
    { type: 'female', label: '여아' },
  ];

  const neuteredOptions = [
    { option: 'yes', label: '했어요' },
    { option: 'no', label: '안했어요' },
  ];

  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem('userData'));
    if (storedUser && storedUser.id) {
      setUserId(storedUser.id);
    }
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImageFile(file);
      setProfileImage(URL.createObjectURL(file));
    }
  };

  const handleProfileClick = () => {
    document.getElementById('profileImageUpload').click();
  };

  const handleWeightChange = (e) => {
    const value = e.target.value;
    if (/^(?!-)[0-9]*\.?[0-9]*$/.test(value)) {
      setWeight(value);
      validateSingleField('weight', value);
    }
  };

  const validateSingleField = (field, value) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: value ? '' : prevErrors[field],
    }));
  };

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
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateFields()) {
      toast.error('필수 항목을 모두 입력해주세요.');
      return;
    }

    const surgery = neutered === 'yes';
    const toastId = toast.loading('반려동물 정보 저장 중...');

    try {
      let animalImageUrl = null;
      if (selectedImageFile) {
        const storageRef = ref(storage, `animals/${userId}`);
        await uploadBytes(storageRef, selectedImageFile);
        animalImageUrl = await getDownloadURL(storageRef);
      }

      await axios.post('http://localhost:3000/api/pets/animal-register', {
        userId,
        name,
        age,
        weight,
        species,
        gender,
        surgery,
        animalImageUrl,
      });
      toast.dismiss(toastId);
      toast.success('반려동물 정보가 성공적으로 저장되었습니다!');
      navigate('/animalRegisterSuccess');
    } catch (error) {
      console.error('반려동물 정보 저장 오류:', error);
      toast.dismiss(toastId);
      toast.error('반려동물 정보 저장에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  return (
    <div className="flex flex-col items-center bg-white h-full overflow-y-auto p-5">
      <Toaster position="top-center" reverseOrder={false} />
      <h1 className="text-center text-lg font-bold mb-4">반려동물 정보</h1>
      <hr className="border-gray-300 w-[450px] mb-6" />

      <div className="mb-6">
        <div className="relative w-20 h-20 overflow-hidden cursor-pointer" onClick={handleProfileClick}>
          {profileImage !== registerPetProfileImage ? (
            <img src={profileImage} alt="반려동물 프로필 이미지" className="w-full h-full object-cover rounded-full" />
          ) : (
            <img src={profileImage} alt="반려동물 기본 프로필 이미지" className="w-full h-full object-contain" />
          )}
        </div>
        <input type="file" id="profileImageUpload" accept="image/*" className="hidden" onChange={handleImageChange} />
      </div>

      {inputFields.map(({ label, value, setter, errorKey, type }) => (
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
          {errors[errorKey] && <span className="text-red-500 text-xs">{errors[errorKey]}</span>}
        </div>
      ))}

      <label className="block text-sm font-medium mb-2 text-left w-full max-w-md">성별*</label>
      <div className="flex justify-between mb-1 w-full max-w-md">
        {genderOptions.map(({ type, label }) => (
          <button
            key={type}
            onClick={() => {
              setGender(type);
              validateSingleField('gender', type);
            }}
            className={`w-1/2 py-2 border-2 rounded-[10px] ${
              gender === type ? 'border-primary text-primary' : 'border-gray-200 text-black'
            } hover:border-primary hover:text-primary transition-colors`}
          >
            {label}
          </button>
        ))}
      </div>
      {errors.gender && <span className="text-red-500 text-xs w-full max-w-md text-left">{errors.gender}</span>}

      <label className="block text-sm font-medium mb-2 text-left w-full max-w-md">중성화 수술 여부*</label>
      <div className="flex justify-between mb-1 w-full max-w-md">
        {neuteredOptions.map(({ option, label }) => (
          <button
            key={option}
            onClick={() => {
              setNeutered(option);
              validateSingleField('neutered', option);
            }}
            className={`w-1/2 py-2 border-2 rounded-[10px] ${
              neutered === option ? 'border-primary text-primary' : 'border-gray-200 text-black'
            } hover:border-primary hover:text-primary transition-colors`}
          >
            {label}
          </button>
        ))}
      </div>

      {errors.neutered && <span className="text-red-500 text-xs w-full max-w-md text-left">{errors.neutered}</span>}

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
      {errors.weight && <span className="text-red-500 text-xs w-full max-w-md text-left">{errors.weight}</span>}

      <div className="flex justify-between w-full max-w-md my-5">
        <button className="py-2 px-4 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white">스킵하기</button>
        <button onClick={handleSave} className="py-2 px-4 bg-primary text-white rounded-lg hover:bg-primary">
          저장하고 홈으로
        </button>
      </div>
    </div>
  );
};

export default AnimalInfo;
