import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import defaultProfileImage from '/src/assets/images/registerprofile.svg';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { ko } from 'date-fns/locale';

const EditUserInfo = () => {

    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [roadAddress, setRoadAddress] = useState('');
    const [detailedAddress, setDetailedAddress] = useState('');
    const [birthDate, setBirthDate] = useState(null);
    const [verificationCode, setVerificationCode] = useState('');
    const [showVerificationInput, setShowVerificationInput] = useState(false);
    const [errors, setErrors] = useState({});
    const [selectedImage, setSelectedImage] = useState(null);
    const [nickname, setNickname] = useState('');
    const [isNicknameChecked, setIsNicknameChecked] = useState(false);
    const [selectedImageFile, setSelectedImageFile] = useState(null);

    const handleDateChange = (date) => {
        setBirthDate(date);
    };

    const openPostcodePopup = () => {
        const popupWidth = 500;
        const popupHeight = 600;
        const popupX = window.screen.width / 2 - popupWidth / 2;
        const popupY = window.screen.height / 2 - popupHeight / 2;
    
        const popup = window.open('', '우편번호검색', `width=${popupWidth},height=${popupHeight},left=${popupX},top=${popupY}`);
    
        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>주소 검색</title>
                <script src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"></script>
            </head>
            <body>
                <div id="postcode-container"></div>
                <script>
                new daum.Postcode({
                    oncomplete: function(data) {
                    window.opener.postMessage(data, '*');
                    window.close();
                    }
                }).embed(document.getElementById('postcode-container'));
                </script>
            </body>
            </html>
            `;
        
            popup.document.write(htmlContent);
        };

    return (
        // <div>
        // </div>
        <div className="flex flex-col items-center bg-white min-h-screen">
            <Toaster />
            <div className='flex items-center mb-4 mt-6'>
                <button onClick={() => navigate('/mypage')}><ChevronLeftIcon className="h-6 w-6 ml-1" stroke="gray" /></button>
                <h1 className="text-center text-lg font-bold">프로필 수정</h1>
            </div>
            <hr className="border-gray-300 w-[450px] mb-6" />

            <div className="w-full max-w-md">
                <label className="block text-sm font-medium mb-1">프로필 등록</label>

                <div className="flex items-center space-x-4 mb-4">
                <div className="relative w-20 h-20 overflow-hidden cursor-pointer">
                    {selectedImage ? (
                    <img src={selectedImage} alt="프로필 이미지" className="w-full h-full object-cover rounded-full" />
                    ) : (
                    <img src={defaultProfileImage} alt="기본 프로필 이미지" className="w-full h-full object-contain" />
                    )}
                </div>
                <input type="file" id="profileImageUpload" accept="image/*" className="hidden" />

                <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">닉네임*</label>
                    <div className="flex space-x-2">
                    <input
                        type="text"
                        placeholder="닉네임 입력"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        className="flex-1 p-2 border border-blue-500 rounded"
                    />
                    <button
                        type="button"
                        // onClick={handleNicknameCheck}
                        className="px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition-colors"
                    >
                        중복확인
                    </button>
                    </div>
                </div>
                </div>
            </div>

            <form className="w-full max-w-md">
                <label className="block text-sm font-medium mb-1">이름*</label>
                <input
                type="text"
                placeholder="이름"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`block w-full p-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded mb-1`}
                />
                {errors.name && <span className="text-red-500 text-xs mt-1">{errors.name}</span>}

                <label className="block text-sm font-medium mb-1">휴대폰 번호*</label>
                <div className="flex space-x-2 mb-1">
                <input
                    type="tel"
                    placeholder="휴대폰번호"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`w-3/4 p-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded`}
                />
                </div>
                {errors.phone && <span className="text-red-500 text-xs mt-1">{errors.phone}</span>}

                {showVerificationInput && (
                <div className="flex space-x-2 mb-1">
                    <input
                    type="text"
                    placeholder="인증번호 입력"
                    value={verificationCode}
                    onChange={handleVerificationCodeChange}
                    className="w-3/4 p-2 border border-gray-300 rounded"
                    />
                    <button type="button" className="w-1/4 bg-gray-500 text-white rounded-lg hover:bg-gray-600">
                    인증하기
                    </button>
                </div>
                )}

                <label className="block text-sm font-medium mb-1">생년월일*</label>
                <div className="flex items-center space-x-2 mb-1">
                <DatePicker
                    selected={birthDate}
                    onChange={handleDateChange}
                    dateFormat="yyyy/MM/dd"
                    placeholderText="YYYY/MM/DD"
                    className={`block w-full p-2 border ${errors.birthDate ? 'border-red-500' : 'border-gray-300'} rounded`}
                    showYearDropdown
                    showMonthDropdown
                    dropdownMode="select"
                    maxDate={new Date()}
                    yearDropdownItemNumber={100}
                    locale={ko}
                />
                </div>
                {errors.birthDate && <span className="text-red-500 text-xs mt-1">{errors.birthDate}</span>}

                <label className="block text-sm font-medium mb-1">주소*</label>
                <input
                type="text"
                placeholder="도로명 주소 (필수)"
                className={`block w-full p-2 border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded mb-1`}
                value={roadAddress}
                readOnly
                onClick={openPostcodePopup}
                />
                {errors.address && <span className="text-red-500 text-xs mt-1">{errors.address}</span>}

                <input
                type="text"
                placeholder="상세 주소 입력 (선택)"
                value={detailedAddress}
                onChange={(e) => setDetailedAddress(e.target.value)}
                className="block w-full p-2 border border-gray-300 rounded mb-6"
                />

                <div className='flex justify-between p-5 w-full'>
                    <button className='py-2 bg-divider text-gray-400 rounded-lg w-48'>취소</button>
                    <button className='py-2 bg-primary rounded-lg w-48 text-white'>저장</button>
                </div>
            </form>
        </div>

    );
};

export default EditUserInfo;