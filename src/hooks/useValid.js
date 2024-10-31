import { useEffect, useState } from 'react';

export const useValid = (form) => {
  // 오류 메시지
  const [validMessage, setValidMessage] = useState({
    idMessage: '',
    passwordMessage: '',
    passwordConfirmMessage: '',
    emailMessage: '',
    nameMessage: '',
    nickNameMessage: '',
    ageMessage: '',
    gender: '',
  });

  // 유효성 검사
  const [isValid, setIsValid] = useState({
    id: false,
    password: false,
    passwordConfirm: false,
    email: false,
    name: false,
    nickname: false,
    age: false,
    gender: false,
  });

  const updateValid = (name, state) => {
    setIsValid((prev) => ({
      ...prev,
      [name]: state,
    }));
  };
  const updateMessage = (name, message) => {
    setValidMessage((prev) => ({
      ...prev,
      [name]: message,
    }));
  };

  // 아이디 유효성 검사
  useEffect(() => {
    const regex = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{5,10}$/;

    if (!regex.test(form.id || '')) {
      updateMessage('idMessage', '영어, 숫자를 포함한 5 ~ 10자로 입력해주세요');
      updateValid('id', false);
    } else {
      updateValid('id', true);
    }
  }, [form.id]);

  // 비밀번호 유효성 검사
  useEffect(() => {
    const regex = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*]).{8,15}$/;

    if (!regex.test(form.password || '')) {
      updateMessage('passwordMessage', '숫자, 영문, 특수문자를 포함하여 최소 8자를 입력해주세요');
      updateValid('password', false);
    } else {
      updateValid('password', true);
    }
  }, [form.password]);

  // 비밀번호 확인
  useEffect(() => {
    if (form.password !== form.passwordConfirm) {
      updateMessage('passwordConfirmMessage', '비밀번호가 일치하지 않아요');
      updateValid('passwordConfirm', false);
    } else {
      updateValid('passwordConfirm', true);
    }
  }, [form.passwordConfirm]);

  // 이메일 유효성 검사
  useEffect(() => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regex.test(form.email || '')) {
      updateMessage('emailMessage', '올바른 이메일 형식을 입력해주세요');
      updateValid('email', false);
    } else {
      updateValid('email', true);
    }
  }, [form.email]);

  // 나이 유효성 검사
  useEffect(() => {
    const regex = /^[0-9]{4}$/;

    if (!regex.test(form.age || '')) {
      updateMessage('ageMessage', '태어난 연도를 알려주세요');
      updateValid('age', false);
    } else {
      updateValid('age', true);
    }
  }, [form.age]);

  return { validMessage, isValid };
};
