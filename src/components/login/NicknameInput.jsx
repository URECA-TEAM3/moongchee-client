// NicknameInput.jsx
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { checkNickname } from '../../api/login';

const NicknameInput = ({ nickname, setNickname, setIsNicknameChecked, errors, setErrors }) => {
  const [isChecking, setIsChecking] = useState(false);

  const validateNickname = (nickname) => {
    const validPattern = /^[가-힣a-zA-Z0-9._]+$/;
    return validPattern.test(nickname);
  };

  const handleNicknameChange = (e) => {
    const value = e.target.value;
    setNickname(value);
    setIsNicknameChecked(false);
    setErrors((prevErrors) => ({ ...prevErrors, nickname: '' }));

    if (!validateNickname(value)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        nickname: '닉네임에 자음이나 모음만 사용할 수 없습니다.',
      }));
    } else if (value.length > 15) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        nickname: '닉네임은 15자 이하여야 합니다.',
      }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, nickname: '' }));
    }
  };

  const handleNicknameCheck = async () => {
    if (!nickname) {
      toast.error('닉네임을 입력해주세요.');
      return;
    }
    if (errors.nickname) return;

    setIsChecking(true);
    try {
      const response = await checkNickname(nickname);
      if (response.data.available) {
        toast.success('사용 가능한 닉네임입니다.');
        setIsNicknameChecked(true);
      } else {
        toast.error('이미 사용 중인 닉네임입니다.');
      }
    } catch (error) {
      toast.error('닉네임 중복 확인 중 오류가 발생했습니다.');
      console.error('닉네임 중복 확인 오류:', error);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="flex-1">
      <label className="block text-sm font-medium mb-1 ml-2">닉네임*</label>
      <div className="flex space-x-2">
        <input
          type="text"
          placeholder="닉네임 입력"
          value={nickname}
          onChange={handleNicknameChange}
          className={`flex-1 p-2 ml-2 border ${errors.nickname ? 'border-red-500' : 'border-divider'} rounded-lg`}
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
  );
};

export default NicknameInput;
