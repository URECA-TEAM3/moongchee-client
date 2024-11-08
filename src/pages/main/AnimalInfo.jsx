import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../firebase';
import { toast, Toaster } from 'react-hot-toast';
import registerPetProfileImage from '/src/assets/images/registerpetprofile.svg';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { registerPet, deletePet, updatePetProfile, getPetDetail } from '../../api/login';
import Modal from '../../components/Modal';

const AnimalInfo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const petId = location.state?.petId;
  const uponSignup = location.pathname.includes('/animalinfo');
  const newPet = location.pathname.includes('/petregister');
  const editPet = location.pathname.includes('/editpet');

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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [confirmDeletedOpen, setConfirmDeletedOpen] = useState(false);
  const closeDeleteModal = () => setDeleteModalOpen(false);

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

  const fetchPet = async (petId) => {
    try {
      const response = await getPetDetail(petId);
      setName(response.data[0].name);
      setAge(response.data[0].age);
      setSpecies(response.data[0].species);
      setGender(response.data[0].gender);
      setNeutered(response.data[0].surgery == 1 ? 'yes' : 'no');
      setWeight(response.data[0].weight);
      setProfileImage(response.data[0].animal_image_url);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem('userData'));
    if (storedUser && storedUser.id) {
      setUserId(storedUser.id);
    }
  }, []);

  useEffect(() => {
    if (petId) fetchPet(petId);
  }, [petId]);

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

      await registerPet(userId, name, age, weight, species, gender, surgery, animalImageUrl);
      toast.dismiss(toastId);

      uponSignup && navigate('/animalRegisterSuccess');
      newPet && setIsModalOpen(true);
    } catch (error) {
      console.error('반려동물 정보 저장 오류:', error);
      toast.dismiss(toastId);
      toast.error('반려동물 정보 저장에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  const handleDelete = async () => {
    try {
      await deletePet(petId);

      setDeleteModalOpen(false);
      setConfirmDeletedOpen(true);
    } catch (error) {
      console.error(error);
      toast.error('반려동물 정보 삭제에 실패했습니다.');
    }
  };

  const handleEdit = async () => {
    try {
      let profileImageUrl = profileImage;

      if (selectedImageFile) {
        const storageRef = ref(storage, `animals/${petId}_${Date.now()}`);
        await uploadBytes(storageRef, selectedImageFile);
        profileImageUrl = await getDownloadURL(storageRef);
      }

      const updatedData = {
        id: petId,
        name,
        age,
        gender,
        surgery: neutered === 'yes' ? 1 : 0,
        weight: weight,
        animal_image_url: profileImageUrl,
      };

      const response = await updatePetProfile(updatedData);

      if (response.status === 200) {
        toast.success('반려동물 정보가 성공적으로 수정되었습니다.');
      }
    } catch (error) {
      console.error(error);
      toast.dismiss(toastId);
      toast.error('반려동물 정보 저장에 실패했습니다.');
    }
  };

  return (
    <div className="flex flex-col items-center bg-white h-full overflow-y-auto">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="relative w-full flex items-center mb-4 mt-6">
        {!uponSignup && (
          <button onClick={() => navigate('/mypage')} className="absolute left-0 ml-1">
            <ChevronLeftIcon className="h-6 w-6 ml-5" stroke="black" />
          </button>
        )}
        <h1 className="mx-auto font-bold">반려동물 정보</h1>
      </div>

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
        <div key={label} className="w-full px-10">
          <label className="block text-sm font-medium mb-2 mt-4 text-left">{label}</label>
          <input
            type={type}
            placeholder={label.replace('*', '')}
            value={value}
            onChange={(e) => {
              setter(e.target.value);
              validateSingleField(errorKey, e.target.value);
            }}
            className={`block w-full p-2 border ${errors[errorKey] ? 'border-red-500' : 'border-divider'} rounded-lg`}
          />
          {errors[errorKey] && <span className="text-red-500 text-xs">{errors[errorKey]}</span>}
        </div>
      ))}

      <label className="block text-sm font-medium mb-2 mt-4 text-left w-full px-10">성별*</label>
      <div className="flex justify-between mb-1 w-full px-10 space-x-2">
        {genderOptions.map(({ type, label }) => (
          <button
            key={type}
            onClick={() => {
              setGender(type);
              validateSingleField('gender', type);
            }}
            className={`w-1/2 py-2 border rounded-lg ${
              gender === type ? 'border-primary text-primary' : 'border-divider text-black'
            } hover:border-primary hover:text-primary transition-colors`}
          >
            {label}
          </button>
        ))}
      </div>
      {errors.gender && <span className="text-red-500 text-xs w-full px-10 text-left">{errors.gender}</span>}

      <label className="block text-sm font-medium mb-2 mt-4 text-left w-full px-10">중성화 수술 여부*</label>
      <div className="flex justify-between mb-1 w-full px-10 space-x-2">
        {neuteredOptions.map(({ option, label }) => (
          <button
            key={option}
            onClick={() => {
              setNeutered(option);
              validateSingleField('neutered', option);
            }}
            className={`w-1/2 py-2 border rounded-lg ${
              neutered === option ? 'border-primary text-primary' : 'border-divider text-black'
            } hover:border-primary hover:text-primary transition-colors`}
          >
            {label}
          </button>
        ))}
      </div>
      {errors.neutered && <span className="text-red-500 text-xs w-full px-10 text-left">{errors.neutered}</span>}

      <label className="block text-sm font-medium mb-2 mt-4 text-left w-full px-10">몸무게(kg)*</label>
      <div className="relative w-full px-10">
        <input
          type="text"
          placeholder="몸무게"
          className={`block w-full p-2 pr-12 border ${errors.weight ? 'border-red-500' : 'border-divider'} rounded-lg`}
          value={weight}
          onChange={(e) => {
            handleWeightChange(e);
            validateSingleField('weight', e.target.value);
          }}
        />
        <span className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${weight ? 'text-black' : 'text-divider'}`}></span>
      </div>
      {errors.weight && <span className="text-red-500 text-xs w-full px-10 text-left">{errors.weight}</span>}

      {uponSignup && (
        <div className="flex justify-between space-x-2 px-10 my-8 w-full">
          <button onClick={() => navigate('/main')} className="py-2 h-12 w-1/2 rounded-lg bg-divider text-gray-400">
            스킵하기
          </button>
          <button onClick={handleSave} className="py-2 h-12 w-1/2 bg-primary text-white rounded-lg">
            저장하고 홈으로
          </button>
        </div>
      )}

      {newPet && (
        <div className="flex justify-between space-x-2 px-10 my-8 w-full">
          <button type="button" onClick={handleSave} className="w-full h-12 py-2 h-12 bg-primary text-white rounded-lg">
            저장하기
          </button>
        </div>
      )}

      {editPet && (
        <div className="flex justify-between space-x-2 px-10 my-8 w-full">
          <button onClick={() => setDeleteModalOpen(true)} className="py-2 h-12 w-1/2 rounded-lg bg-delete text-white">
            삭제하기
          </button>
          <button onClick={handleEdit} className="py-2 h-12 w-1/2 bg-primary text-white rounded-lg">
            저장하기
          </button>
        </div>
      )}

      <Modal isOpen={isModalOpen} title={<div className="font-bold mb-6">반려동물이 저장되었습니다.</div>}>
        <div className="flex mt-3">
          <button
            onClick={() => {
              setIsModalOpen(false);
              navigate('/mypage');
            }}
            className="px-10 py-2 w-full bg-primary text-white rounded-lg"
          >
            확인
          </button>
        </div>
      </Modal>

      <Modal isOpen={deleteModalOpen} title={<div className="font-bold">이 반려동물의 정보를 삭제하시겠습니까?</div>}>
        <div className="my-10 flex justify-center">
          <span className="">삭제 후 복구가 불가능합니다.</span>
        </div>
        <div className="flex gap-4 mt-3">
          <button onClick={closeDeleteModal} className="px-10 py-2 w-full bg-divider text-gray-500 rounded-lg">
            아니요
          </button>
          <button onClick={handleDelete} className="px-8 py-2 w-full bg-delete text-white rounded-lg">
            삭제
          </button>
        </div>
      </Modal>

      <Modal isOpen={confirmDeletedOpen} title={<div className="font-bold mb-6">삭제되었습니다.</div>}>
        <div className="flex mt-3">
          <button onClick={() => navigate('/mypage')} className="px-10 py-2 w-full bg-primary text-white rounded-lg">
            확인
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default AnimalInfo;
