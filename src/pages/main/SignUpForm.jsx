import React, { useState, useEffect } from 'react';
import DaumPostcode from 'react-daum-postcode';
import DatePicker from 'react-datepicker';
import { ko } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import defaultProfileImage from '/src/assets/images/registerprofile.svg';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import toast, { Toaster } from 'react-hot-toast';
import { storage } from '../../../firebase';

const SignUpForm = () => {
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

  const location = useLocation();
  const provider = location.state?.provider || 'Unknown';
  const userId = location.state?.userId || null;
  const accessToken = location.state?.accessToken || null;

  useEffect(() => {
    const handleUnload = () => {
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
      console.log('토큰 삭제 완료');
    };

    window.addEventListener('beforeunload', handleUnload);
    window.addEventListener('popstate', handleUnload);

    return () => {
      window.removeEventListener('beforeunload', handleUnload);
      window.removeEventListener('popstate', handleUnload);
    };
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setSelectedImageFile(file);
    }
  };

  const handleProfileClick = () => {
    document.getElementById('profileImageUpload').click();
  };

  const validateNickname = (nickname) => {
    const validPattern = /^(?=.{1,15}$)[가-힣a-zA-Z0-9._]+$/;
    return validPattern.test(nickname);
  };

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

  const handleComplete = (data) => {
    let fullAddress = data.address;
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress += extraAddress !== '' ? `, ${extraAddress}` : data.buildingName;
      }
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
    }

    setRoadAddress(fullAddress);
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

  window.addEventListener('message', (event) => {
    if (event.data && event.data.address) {
      handleComplete(event.data);
    }
  });

  const handleDateChange = (date) => {
    setBirthDate(date);
  };

  const handleVerifyClick = () => {
    setShowVerificationInput(true);
  };

  const handleVerificationCodeChange = (e) => {
    setVerificationCode(e.target.value);
  };

  const validateFields = () => {
    let newErrors = {};
    if (!name) newErrors.name = '이름을 입력해주세요.';
    if (!phone) newErrors.phone = '휴대폰 번호를 입력해주세요.';
    if (!roadAddress) newErrors.address = '주소를 입력해주세요.';
    if (!birthDate) newErrors.birthDate = '생년월일을 선택해주세요.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 유효성 검사
    if (!validateFields()) {
      return;
    }

    if (!isNicknameChecked) {
      toast.error('닉네임 중복 확인을 해주세요.');
      return;
    }

    const formattedBirthDate = birthDate
      ? `${birthDate.getFullYear()}-${(birthDate.getMonth() + 1).toString().padStart(2, '0')}-${birthDate.getDate().toString().padStart(2, '0')}`
      : null;

    try {
      toast.loading('회원가입 진행 중...');
      const storageRef = ref(storage, `profiles/${userId}`);
      console.log('이때의 userid', userId);

      await uploadBytes(storageRef, selectedImageFile);
      const downloadURL = await getDownloadURL(storageRef);
      console.log('downloadurl', downloadURL);
      const response = await axios.post('http://localhost:3000/api/members/signup', {
        name,
        phone,
        address: `${roadAddress} ${detailedAddress}`,
        birthDate: formattedBirthDate,
        provider,
        token: userId,
        nickname,
        profileImageUrl: downloadURL,
      });

      const { refreshToken } = response.data;

      if (accessToken && refreshToken) {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        console.log('토큰이 로컬 스토리지에 저장되었습니다.');

        const userData = {
          name,
          phone,
          address: `${roadAddress} ${detailedAddress}`,
          birthDate: formattedBirthDate,
          provider,
          userId,
          nickname,
          profileImageUrl: downloadURL,
        };
        sessionStorage.setItem('userData', JSON.stringify(userData));
        console.log('유저 데이터가 세션 스토리지에 저장되었습니다.');
      }

      toast.dismiss();
      toast.success('회원가입 성공!');
      navigate('/loginsuccess');
    } catch (error) {
      toast.dismiss();
      toast.error('회원가입 실패. 다시 시도해주세요.');
      console.error('회원가입 오류:', error);
    }
  };

  return (
    <div className="flex flex-col items-center bg-white min-h-screen">
      <Toaster />
      <h1 className="text-center text-lg font-bold mb-4 mt-6">회원정보</h1>
      <hr className="border-gray-300 w-[450px] mb-6" />

      <div className="w-full max-w-md">
        <label className="block text-sm font-medium mb-1">프로필 등록(선택)</label>

        <div className="flex items-center space-x-4 mb-4">
          <div className="relative w-20 h-20 overflow-hidden cursor-pointer" onClick={handleProfileClick}>
            {selectedImage ? (
              <img src={selectedImage} alt="프로필 이미지" className="w-full h-full object-cover rounded-full" />
            ) : (
              <img src={defaultProfileImage} alt="기본 프로필 이미지" className="w-full h-full object-contain" />
            )}
          </div>
          <input type="file" id="profileImageUpload" accept="image/*" className="hidden" onChange={handleImageChange} />

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
                onClick={handleNicknameCheck}
                className="px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition-colors"
              >
                중복확인
              </button>
            </div>
          </div>
        </div>
      </div>

      <form className="w-full max-w-md" onSubmit={handleSubmit}>
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
          <button type="button" className="w-1/4 bg-gray-500 text-white rounded-lg hover:bg-gray-600" onClick={handleVerifyClick}>
            인증
          </button>
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

        <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          회원가입
        </button>
      </form>
    </div>
  );
};

export default SignUpForm;