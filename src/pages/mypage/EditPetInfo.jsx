import React, { useEffect, useRef, useState } from 'react';
import petProfileImage from '/src/assets/images/registerpetprofile.svg';
import { useLocation, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../firebase';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import axios from 'axios';


const EditPetInfo = () => {

    const location = useLocation();
    const petId = location.state?.petId;
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [weight, setWeight] = useState('');
    const [species, setSpecies] = useState('');
    const [gender, setGender] = useState('');
    const [neutered, setNeutered] = useState('');
    const [profileImage, setProfileImage] = useState(petProfileImage);
    const [selectedImageFile, setSelectedImageFile] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeletedModalOpen, setIsDeletedModalOpen] = useState(false); // 삭제 완료 모달
    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchPet = async (petId) => {
            try {
                const response = await axios.get(`http://localhost:3000/api/pets/detail/${petId}`);
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

        if (petId) {
            fetchPet(petId);
        }
    }, [petId]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
            if (file) {
            setSelectedImageFile(file);
            setProfileImage(URL.createObjectURL(file));
        }
    };

    const handleDelete = () => {
        setIsModalOpen(true); // 로그아웃 버튼 클릭 시 모달 open
    }
    
    const confirmDelete = async () => {
        
        try {
            await axios.delete(`http://localhost:3000/api/pets/${petId}`);
            setIsModalOpen(false); // 삭제 여부 모달 닫기
            setIsDeletedModalOpen(true); // 삭제 확인 모달 열기
        } catch (error) {
            console.error(error);
            toast.error('반려동물 정보 삭제에 실패했습니다.');
        }
    }

    const handleCloseDeletedModal = () => {
        setIsDeletedModalOpen(false);
        navigate('/mypage'); // 마이페이지로 이동
    };
    
    const closeModal = () => {
        setIsModalOpen(false); // 모달 닫기
    }

    const handleSave = async () => {

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
                surgery: neutered === 'yes'? 1 : 0,
                weight: weight,
                animal_image_url: profileImageUrl,
            }

            const response = await axios.put('http://localhost:3000/api/pets/update-profile', updatedData);

        } catch (error) {
            console.error(error);
            toast.dismiss(toastId);
            toast.error('반려동물 정보 저장에 실패했습니다.')
        }
    }

    return (
        <div className="flex flex-col items-center bg-white h-full">
            <Toaster position="bottom-center" reverseOrder={false} />
            <div className="relative w-full flex items-center mb-6 mt-6">
                <button onClick={() => navigate('/mypage')} className="absolute left-0 ml-1">
                    <ChevronLeftIcon className="h-6 w-6 ml-5" stroke="black" />
                </button>
                <h1 className="mx-auto text-lg font-bold">반려동물 정보 수정</h1>
            </div>

            <div className="mb-6">
                <div className="relative w-20 h-20 overflow-hidden cursor-pointer" onClick={() => fileInputRef.current.click()}>
                    {profileImage !== petProfileImage ? (
                        <img src={profileImage} alt="반려동물 프로필 이미지" className="w-full h-full object-cover rounded-full" />
                    ) : (
                        <img src={profileImage} alt="반려동물 기본 프로필 이미지" className="w-full h-full object-contain" />
                    )}
                </div>
                <input type="file" ref={fileInputRef} id="profileImageUpload" accept="image/*" className="hidden" onChange={handleImageChange} />
            </div>
            
            <div className='flex flex-col w-full items-center max-w-md'>
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
                    readOnly
                    onChange={(e) => setSpecies(e.target.value)}
                    className="block w-full max-w-md p-2 border border-gray-300 text-gray-400 rounded mb-4"
                />

                <label className="block text-sm font-medium mb-2 text-left w-full max-w-md">성별</label>
                <div className="flex justify-between mb-4 w-full max-w-md space-x-2">
                    <button
                    disabled
                    className={`w-1/2 py-2 border-2 rounded-[10px] ${
                        gender === 'male' ? 'border-blue-500 text-blue-500' : 'border-gray-200 text-black'
                    } hover:border-blue-500 hover:text-blue-500 transition-colors`}
                    >
                    남아
                    </button>
                    <button
                    disabled
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
                <div className='flex justify-between p-5 w-full'>
                    <button onClick={handleDelete} className='py-2 bg-delete text-white rounded-lg w-48'>삭제하기</button>
                    <button onClick={handleSave} className='py-2 bg-primary rounded-lg w-48 text-white'>저장</button>
                </div>

                {/* Confirm Delete Modal */}
                {isModalOpen && (
                <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
                    <div className='bg-white rounded-lg shadow-lg text-center w-80 h-auto p-6'>
                        <h2 className='text-base font-extrabold mb-6'>반려견 정보를 삭제하시겠습니까?</h2>
                        <h3 className='text-sm m-10 p-2'>삭제 후 복구가 불가능합니다.</h3>
                        <div className='flex justify-center space-x-4'>
                            <button onClick={closeModal} className='px-12 py-2 bg-divider text-gray-500 rounded-lg'>취소</button>
                            <button onClick={confirmDelete} className='px-12 py-2 bg-delete text-white rounded-lg'>확인</button>
                        </div>
                    </div>
                </div>
                )}

                {/* Delete Completed Modal */}
                {isDeletedModalOpen && (
                    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
                        <div className='bg-white rounded-lg shadow-lg text-center w-80 h-auto p-6'>
                            <h2 className='text-base font-extrabold mb-6'>삭제되었습니다.</h2>
                            <button onClick={handleCloseDeletedModal} className='px-12 py-2 bg-primary text-white rounded-lg'>확인</button>
                        </div>
                    </div>
                )}
    
            </div>

        </div>
    );
};

export default EditPetInfo;