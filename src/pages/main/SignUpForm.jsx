import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { ko } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import defaultProfileImage from '/src/assets/images/user.svg';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import toast, { Toaster } from 'react-hot-toast';
import { storage } from '../../../firebase';
import AddressSearch from '../../components/AddressSearch';
import EmailVerification from '../../components/EmailVerification';
import NicknameInput from '../../components/NicknameInput';
import ProfileImageUpload from '../../components/ProfileImageUpload';

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

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    if (/^[0-9\b]+$/.test(value) || value === '') {
      setPhone(value);
      if (value) {
        setErrors((prevErrors) => ({ ...prevErrors, phone: '' }));
      }
    }
  };

  const handleCompleteAddress = (address) => {
    setRoadAddress(address);
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

  const handleDateChange = (date) => {
    setBirthDate(date);
    setErrors((prevErrors) => ({ ...prevErrors, birthDate: '' }));
  };

  const validateFields = () => {
    let newErrors = {};

    if (!name) {
      newErrors.name = '이름을 입력해주세요.';
      toast.error('이름을 입력해주세요.');
    }

    if (!phone) {
      newErrors.phone = '휴대폰 번호를 입력해주세요.';
      toast.error('휴대폰 번호를 입력해주세요.');
    }

    if (!email) {
      newErrors.email = '이메일을 입력해주세요.';
      toast.error('이메일을 입력해주세요.');
    }

    if (!isEmailVerified) {
      newErrors.emailVerified = '이메일 인증을 완료해주세요.';
      toast.error('이메일 인증을 완료해주세요.');
    }

    if (!roadAddress) {
      newErrors.address = '주소를 입력해주세요.';
      toast.error('주소를 입력해주세요.');
    }

    if (!birthDate) {
      newErrors.birthDate = '생년월일을 선택해주세요.';
      toast.error('생년월일을 선택해주세요.');
    }

    if (!nickname) {
      newErrors.nickname = '닉네임을 입력해주세요.';
      toast.error('닉네임을 입력해주세요.');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
          detailAddress: detailedAddress,
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
          <ProfileImageUpload selectedImage={selectedImage} setSelectedImage={setSelectedImage} setSelectedImageFile={setSelectedImageFile} />

          <NicknameInput nickname={nickname} setNickname={setNickname} setIsNicknameChecked={setIsNicknameChecked} errors={errors} setErrors={setErrors} />
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

        <EmailVerification email={email} setEmail={setEmail} setIsEmailVerified={setIsEmailVerified} />

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

        <label className="block text-sm font-medium mb-1">주소*</label>
        <AddressSearch onComplete={handleCompleteAddress} />
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
