import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import defaultProfileImage from '/src/assets/images/user.svg';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../firebase';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { ko } from 'date-fns/locale';
import axios from 'axios';

const EditUserInfo = () => {

    const navigate = useNavigate();
    const [id, setId] = useState(0);
    const [uniqueId, setUniqueId] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [roadAddress, setRoadAddress] = useState('');
    const [detailedAddress, setDetailedAddress] = useState('');
    const [email, setEmail] = useState('');
    const [birthDate, setBirthDate] = useState(null);
    const [errors, setErrors] = useState({});
    const [selectedImage, setSelectedImage] = useState(null);
    const [nickname, setNickname] = useState('');
    const [isPetsitter, setIsPetsitter] = useState(0);
    const [socialProvider, setSocialProvider] = useState('');
    const [isNicknameChecked, setIsNicknameChecked] = useState(false);
    const [selectedImageFile, setSelectedImageFile] = useState(null);
    const [showModal, setShowModal] = useState(false); // 모달 표시 여부

    useEffect(() => {
        const userData = sessionStorage.getItem('userData');
        if (userData) {
            const parsedData = JSON.parse(userData); // JSON 파싱
            console.log(parsedData)
            setId(parsedData.id);
            setNickname(parsedData.nickname);
            setName(parsedData.name);
            setPhone(parsedData.phone);
            setBirthDate(parsedData.birthDate);
            setRoadAddress(parsedData.address);
            setSelectedImage(parsedData.profile_image_url);
            setEmail(parsedData.email);
            setIsPetsitter(parsedData.petsitter);
            setSocialProvider(parsedData.social_provider);
            setUniqueId(parsedData.unique_id);
        }
    }, []);

    const formattedBirthDate = birthDate
        ? (birthDate instanceof Date
            ? birthDate
            : new Date(birthDate)
        ).toISOString().split('T')[0]
        : null;

    // 모달 창에서 '기본 이미지로 변경' 선택 시
    const handleSetDefaultImage = () => {
        setSelectedImage(defaultProfileImage);
        setSelectedImageFile(null); // 파일 업로드 초기화
        setShowModal(false); // 모달 닫기
    };

    // 모달 창에서 '사진 선택' 선택 시
    const handleSelectImage = () => {
        document.getElementById('profileImageUpload').click(); // 파일 선택창 열기
        setShowModal(false); // 모달 닫기
    };

    // 파일 선택 시 호출
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedImage(URL.createObjectURL(file)); // 이미지 미리보기
            setSelectedImageFile(file); // Firebase 업로드용 파일 설정
        }
    };

    const handleSave = async() => {
        try {
            let profileImageUrl = selectedImage;
            // 이미지 파일이 선택된 경우 Firebase에 업로드
            if (selectedImage) {
                const storageRef = ref(storage, `profiles/${id}_${Date.now()}`);
                await uploadBytes(storageRef, selectedImageFile);
                profileImageUrl = await getDownloadURL(storageRef);
            }

            const updatedData = {
                id,
                petsitter: isPetsitter,
                social_provider: socialProvider,
                unique_id: uniqueId,
                name,
                email,
                nickname,
                phone,
                birthDate: formattedBirthDate,
                address: roadAddress,
                detailedAddress,
                profile_image_url: profileImageUrl,
            };

            const response = await axios.put('http://localhost:3000/api/members/update-profile', updatedData);
            // Session Storage update
            sessionStorage.setItem('userData', JSON.stringify(response.data));

            alert('프로필이 수정되었습니다.');
            navigate('/mypage');
        } catch (error) {
            console.error(error);
            alert('프로필 수정 실패')
        }
    }

    const handleNicknameCheck = async () => {
        if (!nickname) {
            toast.error('닉네임을 입력해주세요.');
            return;
        }
    
        if (!validateNickname(nickname)) {
            toast.error('닉네임에 자음이나 모음만 사용할 수 없습니다.');
            return;
        }
    
        if (nickname.length > 15) {
            toast.error('닉네임은 15자 이하여야 합니다.');
            return;
        }
    
        try {
            const response = await axios.post('http://localhost:3000/api/members/check-nickname', { nickname });
            if (response.data.available) {
                toast.success('사용 가능한 닉네임입니다.');
                setIsNicknameChecked(true);
            } else {
                toast.error('이미 사용 중인 닉네임입니다.');
            }
        } catch (error) {
        toast.error('닉네임 중복 확인 중 오류가 발생했습니다.');
        console.error('닉네임 중복 확인 오류:', error);
        }
    };

    const validateNickname = (nickname) => {
        const validPattern = /^(?!.*[._]{2})(?![._])[가-힣a-zA-Z0-9._]+(?<![._])$/;
        return validPattern.test(nickname);
    };

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
        <div className="flex flex-col items-center bg-white h-full">
            <Toaster />
            <div className="relative w-full flex items-center mb-4 mt-6">
                <button onClick={() => navigate('/mypage')} className="absolute left-0 ml-1">
                    <ChevronLeftIcon className="h-6 w-6 ml-5" stroke="black" />
                </button>
                <h1 className="mx-auto text-lg font-bold">프로필 수정</h1>
            </div>
            {/* <hr className="border-gray-300 w-full mb-6" /> */}

            <div className="w-full max-w-md mt-5">
                <div className="flex items-center space-x-4 mb-4">
                <div className="relative w-20 h-20 overflow-hidden cursor-pointer" onClick={() => setShowModal(true)}>
                    {selectedImage ? (
                    <img src={selectedImage} alt="프로필 이미지" className="w-full h-full object-cover rounded-full" />
                    ) : (
                    <img src={defaultProfileImage} alt="기본 프로필 이미지" className="w-full h-full object-contain" />
                    )}
                </div>
                <input type="file" id="profileImageUpload" accept="image/*" className="hidden" onChange={handleImageChange} />

                <div className="flex-1">
                    <div className="flex space-x-2">
                    <input
                        type="text"
                        placeholder="닉네임"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        className="flex-1 p-2 p-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded"
                    />
                    <button
                        type="button"
                        onClick={handleNicknameCheck}
                        className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
                    >
                        중복확인
                    </button>
                    </div>
                </div>
                </div>
            </div>

            <form className="w-full max-w-md">
                <label className="block text-sm font-medium mb-1">이름</label>
                <input
                type="text"
                placeholder="이름"
                value={name}
                readOnly
                onChange={(e) => setName(e.target.value)}
                className={`mb-4 block w-full p-2 border border-gray-300 text-gray-400 rounded mb-1`}
                />

                <label className="block text-sm font-medium mb-1">이메일</label>
                <input
                    type="text"
                    placeholder="이메일"
                    value={email}
                    readOnly
                    onChange={(e) => setPhone(e.target.value)}
                    className={`mb-4 block w-full p-2 border border-gray-300 text-gray-400 rounded mb-1`}
                />

                <label className="block text-sm font-medium mb-1">휴대폰 번호*</label>
                <input
                    type="tel"
                    placeholder="휴대폰번호"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`w-full mb-4 p-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded`}
                />
                {errors.phone && <span className="text-red-500 text-xs mt-1">{errors.phone}</span>}

                <label className="block text-sm font-medium mb-1">생년월일</label>
                <div className="flex items-center mb-4">
                <DatePicker
                    selected={birthDate}
                    onChange={handleDateChange}
                    dateFormat="yyyy/MM/dd"
                    placeholderText="YYYY/MM/DD"
                    readOnly
                    className={`block w-full p-2 border border-gray-300 text-gray-400 rounded`}
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
                    <button type='button' onClick={handleSave} className='py-2 bg-primary rounded-lg w-48 text-white'>저장</button>
                </div>
            </form>

            {/* Profile Image Change Modal */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                        <h2 className="text-lg text-center font-bold mb-4">프로필 이미지 설정</h2>
                        <button
                            onClick={handleSetDefaultImage}
                            className="w-full py-2 mb-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
                        >
                            기본 이미지로 변경
                        </button>
                        <button
                            onClick={handleSelectImage}
                            className="w-full py-2 border border-primary text-primary hover:bg-primary hover:text-white rounded-lg"
                        >
                            사진 선택
                        </button>
                        <button
                            onClick={() => setShowModal(false)}
                            className="w-full py-2 mt-5 text-white bg-delete rounded-lg"
                        >
                            취소
                        </button>
                    </div>
                </div>
            )}

        </div>

    );
};

export default EditUserInfo;