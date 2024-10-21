import React, { useState } from 'react';
import DaumPostcode from 'react-daum-postcode';
import DatePicker from 'react-datepicker';
import { ko } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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

  const location = useLocation();
  const provider = location.state?.provider || 'Unknown';
  const userId = location.state?.userId || null;

  console.log('회원가입 폼 유저아이디', userId);

  const handleComplete = (data) => {
    let fullAddress = data.address;
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
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

    if (!validateFields()) {
      return;
    }

    const formattedBirthDate = birthDate
      ? `${birthDate.getFullYear()}-${(birthDate.getMonth() + 1).toString().padStart(2, '0')}-${birthDate.getDate().toString().padStart(2, '0')}`
      : null;

    try {
      const response = await axios.post('http://localhost:3000/api/signup', {
        name,
        phone,
        address: `${roadAddress} ${detailedAddress}`,
        birthDate: formattedBirthDate,
        provider,
        token: userId,
      });
      const newUserId = response.data.userId;
      console.log('받은 userId:', newUserId);
      localStorage.setItem('userId', newUserId);

      navigate('/loginsuccess');
    } catch (error) {
      console.error('회원가입 오류:', error);
    }
  };

  return (
    <div className="flex flex-col items-center bg-white min-h-screen">
      <h1 className="text-center text-lg font-bold mb-4 mt-6">회원정보</h1>
      <hr className="border-gray-300 w-[450px] mb-6" />

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
