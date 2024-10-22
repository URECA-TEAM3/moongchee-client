import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../firebase';

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

  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    setUserId(storedUserId);
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

  const handleSave = async () => {
    const surgery = neutered === 'yes';

    try {
      let animalImageUrl = null;

      if (selectedImageFile) {
        const storageRef = ref(storage, `animals/${userId}`);
        await uploadBytes(storageRef, selectedImageFile);
        animalImageUrl = await getDownloadURL(storageRef);
      }

      const response = await axios.post('http://localhost:3000/api/animal-register', {
        userId,
        name,
        age,
        weight,
        species,
        gender,
        surgery,
        animalImageUrl,
      });
      console.log('애니멀 이미지 경로', animalImageUrl);

      console.log('반려동물 정보 저장 성공:', response.data);
      navigate('/main');
    } catch (error) {
      console.error('반려동물 정보 저장 오류:', error);
    }
  };

  return (
    <div className="flex flex-col items-center bg-white min-h-screen p-4">
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

      <label className="block text-sm font-medium mb-2 text-left w-full max-w-md">이름</label>
      <input
        type="text"
        placeholder="이름"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="block w-full max-w-md p-2 border border-gray-300 rounded mb-4"
      />

      <label className="block text-sm font-medium mb-2 text-left w-full max-w-md">나이</label>
      <input
        type="number"
        placeholder="나이"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        className="block w-full max-w-md p-2 border border-gray-300 rounded mb-4"
      />

      <label className="block text-sm font-medium mb-2 text-left w-full max-w-md">견종</label>
      <input
        type="text"
        placeholder="견종"
        value={species}
        onChange={(e) => setSpecies(e.target.value)}
        className="block w-full max-w-md p-2 border border-gray-300 rounded mb-4"
      />

      <label className="block text-sm font-medium mb-2 text-left w-full max-w-md">성별</label>
      <div className="flex justify-between mb-4 w-full max-w-md space-x-2">
        <button
          onClick={() => setGender('male')}
          className={`w-1/2 py-2 border-2 rounded-[10px] ${
            gender === 'male' ? 'border-blue-500 text-blue-500' : 'border-gray-200 text-black'
          } hover:border-blue-500 hover:text-blue-500 transition-colors`}
        >
          남아
        </button>
        <button
          onClick={() => setGender('female')}
          className={`w-1/2 py-2 border-2 rounded-[10px] ${
            gender === 'female' ? 'border-blue-500 text-blue-500' : 'border-gray-200 text-black'
          } hover:border-blue-500 hover:text-blue-500 transition-colors`}
        >
          여아
        </button>
      </div>

      <label className="block text-sm font-medium mb-2 text-left w-full max-w-md">중성화 수술 여부</label>
      <div className="flex justify-between mb-4 w-full max-w-md space-x-2">
        <button
          onClick={() => setNeutered('yes')}
          className={`w-1/2 py-2 border-2 rounded-[10px] ${
            neutered === 'yes' ? 'border-blue-500 text-blue-500' : 'border-gray-200 text-black'
          } hover:border-blue-500 hover:text-blue-500 transition-colors`}
        >
          했어요
        </button>
        <button
          onClick={() => setNeutered('no')}
          className={`w-1/2 py-2 border-2 rounded-[10px] ${
            neutered === 'no' ? 'border-blue-500 text-blue-500' : 'border-gray-200 text-black'
          } hover:border-blue-500 hover:text-blue-500 transition-colors`}
        >
          안했어요
        </button>
      </div>

      <label className="block text-sm font-medium mb-2 text-left w-full max-w-md">몸무게</label>
      <div className="relative w-full max-w-md">
        <input
          type="text"
          placeholder="몸무게"
          className="block w-full p-2 pr-12 border border-gray-300 rounded mb-6"
          value={weight}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*\.?\d*$/.test(value)) {
              setWeight(value);
            }
          }}
        />
        <span className={`absolute right-3 top-1/3 transform -translate-y-1/2 ${weight ? 'text-black' : 'text-gray-400'}`}>kg</span>
      </div>

      <div className="flex justify-between w-full max-w-md">
        <button className="py-2 px-4 bg-gray-400 text-white rounded-lg hover:bg-gray-500">스킵하기</button>
        <button onClick={handleSave} className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          저장하고 홈으로
        </button>
      </div>
    </div>
  );
};

export default AnimalInfo;
