import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { emailVerification } from '../../api/login';

const EmailVerification = ({ email, setEmail, setIsEmailVerified, errors, setErrors }) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [emailVerificationCode, setEmailVerificationCode] = useState('');
  const [showVerificationInput, setShowVerificationInput] = useState(false);
  const [timer, setTimer] = useState(180);
  const [isResend, setIsResend] = useState(false);
  const [isEmailFieldDisabled, setIsEmailFieldDisabled] = useState(false);

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

  const handleEmailVerification = async () => {
    if (!email) {
      setErrors((prev) => ({ ...prev, email: '이메일을 입력해주세요.' }));
      toast.error('이메일을 입력해주세요.');
      return;
    }

    const toastId = toast.loading('인증 번호 보내는 중...');

    try {
      const response = await emailVerification(email);
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
      setIsEmailFieldDisabled(true);
      toast.success('이메일 인증 성공!');
      setShowVerificationInput(false);
    } else {
      toast.error('인증 코드가 올바르지 않습니다.');
    }
  };

  return (
    <>
      <label className="block text-sm font-medium my-1 mt-4">이메일 주소*</label>
      <div className="flex space-x-2 mb-1">
        <input
          type="email"
          placeholder="이메일 주소"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setErrors((prev) => ({ ...prev, email: '' }));
          }}
          disabled={isEmailFieldDisabled}
          className={`flex-1 p-2 border ${errors.email ? 'border-red-500' : 'border-divider'} rounded-lg`}
        />
        <button
          type="button"
          onClick={handleEmailVerification}
          disabled={isEmailFieldDisabled}
          className={`px-4 py-2 rounded-lg transition-colors ${
            isEmailFieldDisabled ? 'bg-gray-300 text-white cursor-not-allowed' : 'border border-primary text-primary hover:bg-primary hover:text-white'
          }`}
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
              onChange={(e) => setVerificationCode(e.target.value)}
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
    </>
  );
};

export default EmailVerification;
