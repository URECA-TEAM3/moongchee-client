import React, { useState, useEffect } from 'react';
import DaumPostcode from 'react-daum-postcode';
import DatePicker from 'react-datepicker';
import { ko } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import defaultProfileImage from '/src/assets/images/user.svg';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import toast, { Toaster } from 'react-hot-toast';
import { storage } from '../../../firebase';

const SignUpForm = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerificationInput, setShowVerificationInput] = useState(false);
  const [emailVerificationCode, setEmailVerificationCode] = useState('');
  const [roadAddress, setRoadAddress] = useState('');
  const [detailedAddress, setDetailedAddress] = useState('');
  const [birthDate, setBirthDate] = useState(null);
  const [errors, setErrors] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [nickname, setNickname] = useState('');
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState(null);

  const [timer, setTimer] = useState(180);
  const [isResend, setIsResend] = useState(false);

  const location = useLocation();
  const provider = location.state?.provider || 'Unknown';
  const userId = location.state?.userId || null;
  const accessToken = location.state?.accessToken || null;

  useEffect(() => {
    const handleUnload = () => {
      sessionStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    };

    window.addEventListener('beforeunload', handleUnload);
    window.addEventListener('popstate', handleUnload);

    return () => {
      window.removeEventListener('beforeunload', handleUnload);
      window.removeEventListener('popstate', handleUnload);
    };
  }, []);

  useEffect(() => {
    let interval;
    if (showVerificationInput && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      clearInterval(interval);
      setShowVerificationInput(false);
    }
    return () => clearInterval(interval);
  }, [showVerificationInput, timer]);

  const formatTime = (seconds) => {
    const min = String(Math.floor(seconds / 60)).padStart(2, '0');
    const sec = String(seconds % 60).padStart(2, '0');
    return `${min}:${sec}`;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    console.log(file);
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setSelectedImageFile(file);
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    if (/^[0-9\b]+$/.test(value) || value === '') {
      setPhone(value);
      if (value) {
        setErrors((prevErrors) => ({ ...prevErrors, phone: '' }));
      }
    }
  };

  const handleProfileClick = () => {
    document.getElementById('profileImageUpload').click();
  };

  const validateNickname = (nickname) => {
    const validPattern = /^[가-힣a-zA-Z0-9._]+$/;
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

  const handleEmailVerification = async () => {
    if (!email) {
      toast.error('이메일을 입력해주세요.');
      return;
    }

    const toastId = toast.loading('인증 번호 보내는 중...');

    try {
      const response = await axios.post('http://localhost:3000/api/members/send-email-verification', { email });
      setEmailVerificationCode(response.data.code);
      setShowVerificationInput(true);
      setTimer(180);
      setIsResend(true);

      toast.dismiss(toastId);
      toast.success('인증 코드가 발송되었습니다.');
    } catch (error) {
      toast.dismiss(toastId);
      if (error.response && error.response.status === 409) {
        toast.error('이미 등록된 이메일 주소입니다.');
      } else {
        toast.error('이메일 인증 중 오류가 발생했습니다.');
      }
      console.error('이메일 인증 오류:', error);
    }
  };

  const handleVerifyEmailCode = () => {
    if (verificationCode === emailVerificationCode) {
      setIsEmailVerified(true);
      toast.success('이메일 인증 성공!');
      setShowVerificationInput(false);
    } else {
      toast.error('인증 코드가 올바르지 않습니다.');
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
    setErrors((prevErrors) => ({ ...prevErrors, address: '' }));
  };

  const handleInputChange = (field, value) => {
    setErrors((prevErrors) => ({ ...prevErrors, [field]: '' }));
    if (field === 'name') setName(value);
    if (field === 'phone') setPhone(value);
    if (field === 'email') setEmail(value);
    if (field === 'nickname') setNickname(value);
    if (field === 'verificationCode') setVerificationCode(value);
    if (field === 'detailedAddress') setDetailedAddress(value);
    if (field === 'birthDate') setBirthDate(value);
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
    setErrors((prevErrors) => ({ ...prevErrors, birthDate: '' }));
  };

  const validateFields = () => {
    let newErrors = {};
    if (!name) newErrors.name = '이름을 입력해주세요.';
    if (!phone) newErrors.phone = '휴대폰 번호를 입력해주세요.';
    if (!email) newErrors.email = '이메일을 입력해주세요.';
    if (!isEmailVerified) newErrors.emailVerified = '이메일 인증을 완료해주세요.';
    if (!roadAddress) newErrors.address = '주소를 입력해주세요.';
    if (!birthDate) newErrors.birthDate = '생년월일을 선택해주세요.';
    if (!nickname) newErrors.nickname = '닉네임을 입력해주세요.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 유효성 검사
    if (!validateFields()) {
      if (!isEmailVerified) {
        toast.error('이메일 인증을 완료해주세요.');
      }
      return;
    }

    if (!isEmailVerified) {
      toast.error('이메일 인증을 완료해주세요.');
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
      let downloadURL;

      if (selectedImage) {
        const storageRef = ref(storage, `profiles/${userId}`);
        await uploadBytes(storageRef, selectedImageFile);
        downloadURL = await getDownloadURL(storageRef);
      } else {
        downloadURL = defaultProfileImage;
      }

      const response = await axios.post('http://localhost:3000/api/members/signup', {
        name,
        phone,
        email,
        address: roadAddress,
        detailAddress: detailedAddress,
        birthDate: formattedBirthDate,
        provider,
        token: userId,
        nickname,
        profileImageUrl: downloadURL,
      });
      console.log('디테일 주소', detailedAddress);

      const { userId: responseUserId, refreshToken } = response.data;

      if (accessToken && refreshToken) {
        sessionStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        const userData = {
          id: responseUserId,
          name,
          phone,
          email,
          address: roadAddress,
          detailAddress: detailedAddress, // 세션 데이터에 추가
          birthDate: formattedBirthDate,
          provider,
          userId,
          nickname,
          profile_image_url: downloadURL,
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
    <div className="flex flex-col items-center bg-white h-full overflow-y-auto">
      <Toaster />
      <h1 className="text-center font-bold mb-4 mt-6">회원가입</h1>

      <div className="w-full px-10">
        <label className="text-sm font-medium mb-1">프로필 등록(선택)</label>
        <div className="flex items-center space-x-4 mb-4">
          <div className="relative w-20 h-20 ml-2 overflow-hidden cursor-pointer" onClick={handleProfileClick}>
            {selectedImage ? (
              <img src={selectedImage} alt="프로필 이미지" className="w-full h-full object-cover rounded-full" />
            ) : (
              <img src={defaultProfileImage} alt="기본 프로필 이미지" className="w-full h-full object-contain" />
            )}
          </div>
          <input type="file" id="profileImageUpload" accept="image/*" className="hidden" onChange={handleImageChange} />

          <div className="flex-1">
            <label className="block text-sm font-medium mb-1 ml-2">닉네임*</label>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="닉네임 입력"
                value={nickname}
                onChange={(e) => handleInputChange('nickname', e.target.value)}
                className={`flex-1 p-2 ml-2 border ${errors.nickname ? 'border-red-500' : 'border-primary'} rounded-lg`}
              />
              <button
                type="button"
                onClick={handleNicknameCheck}
                className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
              >
                중복확인
              </button>
            </div>
            {errors.nickname && <span className="text-red-500 text-xs mt-1">{errors.nickname}</span>}
          </div>
        </div>
      </div>

      <form className="w-full px-10" onSubmit={handleSubmit}>
        <label className="block text-sm font-medium my-1">이름*</label>
        <input
          type="text"
          placeholder="이름"
          value={name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className={`block w-full p-2 border ${errors.name ? 'border-red-500' : 'border-divider'} rounded-lg mb-1`}
        />
        {errors.name && <span className="text-red-500 text-xs mt-1">{errors.name}</span>}

        <label className="block text-sm font-medium my-1 mt-4">이메일 주소*</label>
        <div className="flex space-x-2 mb-1">
          <input
            type="email"
            placeholder="이메일 주소"
            value={email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`flex-1 p-2 border ${errors.email ? 'border-red-500' : 'border-divider'} rounded-lg`}
          />
          <button
            type="button"
            onClick={handleEmailVerification}
            className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
          >
            {isResend ? '재발송' : '인증번호 발송'}
          </button>
        </div>
        {errors.email && <span className="text-red-500 text-xs mt-1">{errors.email}</span>}

        {showVerificationInput && timer > 0 && (
          <div className="flex space-x-2 mb-1 items-center">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="인증번호 입력"
                value={verificationCode}
                onChange={(e) => handleInputChange('verificationCode', e.target.value)}
                className="w-full p-2 pr-12 border border-divider rounded-lg"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">{formatTime(timer)}</span>
            </div>
            <button
              type="button"
              onClick={handleVerifyEmailCode}
              className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
            >
              인증
            </button>
          </div>
        )}

        <label className="block text-sm font-medium my-1 mt-4">휴대폰 번호*</label>
        <input
          type="tel"
          placeholder="휴대폰번호"
          value={phone}
          onChange={handlePhoneChange}
          className={`w-full p-2 border ${errors.phone ? 'border-red-500' : 'border-divider'} rounded-lg`}
        />
        {errors.phone && <span className="text-red-500 text-xs mt-1">{errors.phone}</span>}

        <label className="block text-sm font-medium my-1 mt-4">생년월일*</label>
        <div className="flex items-center space-x-2 mb-1">
          <DatePicker
            selected={birthDate}
            onChange={handleDateChange}
            dateFormat="yyyy/MM/dd"
            placeholderText="YYYY/MM/DD"
            className={`block w-full p-2 border ${errors.birthDate ? 'border-red-500' : 'border-divider'} rounded-lg`}
            showYearDropdown
            showMonthDropdown
            dropdownMode="select"
            maxDate={new Date()}
            yearDropdownItemNumber={100}
            locale={ko}
          />
        </div>
        {errors.birthDate && <span className="text-red-500 text-xs mt-1">{errors.birthDate}</span>}

        <label className="block text-sm font-medium my-1 mt-4">주소*</label>
        <input
          type="text"
          placeholder="도로명 주소 (필수)"
          className={`block w-full p-2 border ${errors.address ? 'border-red-500' : 'border-divider'} rounded-lg mb-1`}
          value={roadAddress}
          readOnly
          onClick={() => openPostcodePopup()}
        />
        {errors.address && <span className="text-red-500 text-xs mt-1">{errors.address}</span>}

        <input
          type="text"
          placeholder="상세 주소 입력 (선택)"
          value={detailedAddress}
          onChange={(e) => handleInputChange('detailedAddress', e.target.value)}
          className="block w-full p-2 border border-divider rounded-lg mb-6"
        />

        <button type="submit" className="w-full h-12 mb-5 py-2 bg-primary text-white rounded-lg">
          회원가입
        </button>
      </form>
    </div>
  );
};

export default SignUpForm;
