import React, { useState } from 'react';
import registerPetProfileImage from '/src/assets/images/registerpetprofile.svg';
import { useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';


const EditPetInfo = () => {

    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [weight, setWeight] = useState('');
    const [species, setSpecies] = useState('');
    const [gender, setGender] = useState('');
    const [neutered, setNeutered] = useState('');
    const [userId, setUserId] = useState(null);
    const [profileImage, setProfileImage] = useState(registerPetProfileImage);
    const [selectedImageFile, setSelectedImageFile] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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
    
    const confirmDelete = () => {
        // 반려동물 삭제 로직
        setIsModalOpen(false); // 모달 닫기
        alert("삭제되었습니다.");
    }
    
    const closeModal = () => {
        setIsModalOpen(false); // 모달 닫기
    }

    return (
        <div className="flex flex-col items-center bg-white min-h-screen">
            <Toaster position="top-center" reverseOrder={false} />
            <div className='flex items-center mb-4 mt-6'>
                <button onClick={() => navigate('/mypage')}><ChevronLeftIcon className="h-6 w-6 ml-1" stroke="gray" /></button>
                <h1 className="text-center text-lg font-bold">반려동물 정보 수정</h1>
            </div>
            <hr className="border-gray-300 w-[450px] mb-6" />

            <div className="mb-6">
                <div className="relative w-20 h-20 overflow-hidden cursor-pointer">
                {profileImage !== registerPetProfileImage ? (
                    <img src={profileImage} alt="반려동물 프로필 이미지" className="w-full h-full object-cover rounded-full" />
                ) : (
                    <img src={profileImage} alt="반려동물 기본 프로필 이미지" className="w-full h-full object-contain" />
                )}
                </div>
                <input type="file" id="profileImageUpload" accept="image/*" className="hidden" onChange={handleImageChange} />
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
                <div className='flex justify-between p-5 w-full'>
                    <button onClick={handleDelete} className='py-2 bg-delete text-white rounded-lg w-48'>삭제하기</button>
                    <button className='py-2 bg-primary rounded-lg w-48 text-white'>저장</button>
                </div>

                {/* Confirm Delete Modal */}
                {isModalOpen && (
                <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
                    <div className='bg-white p-6 rounded-lg shadow-lg w-80'>
                    <h2 className='text-base font-bold mb-6 text-center'>반려견을 삭제하시겠습니까?</h2>
                    <h3 className='text-sm text-center mb-6'>해당 반려견의 정보도 함께 삭제됩니다.</h3>
                    <div className='flex justify-center space-x-4'>
                        <button onClick={closeModal} className='px-6 py-2 bg-divider text-gray-500 rounded-lg'>취소</button>
                        <button onClick={confirmDelete} className='px-6 py-2 bg-delete text-white rounded-lg'>확인</button>
                    </div>
                    </div>
                </div>
                )}
            </div>

        </div>
    );
};

export default EditPetInfo;