import React from 'react';
import KakaoLoginBtn from '../../components/KakaoLoginBtn';
import GoogleLoginBtn from '../../components/GoogleLoginBtn';

const LoginPage = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-[#2589e7]">
      <div className="text-center text-white">
        <h1 className="mt-8 text-2xl">
          반려견의 행복수치 상승을 위한
          <br /> 쇼핑과 펫시터 앱
        </h1>
        <img src="/src/assets/images/LoginLogo.png" alt="로고" className="w-[350px] h-[400px] mx-auto my-6" />
        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-white mx-2"></div>
          <span className="text-white">SNS 계정으로 로그인</span>
          <div className="flex-grow border-t border-white mx-2"></div>
        </div>
        <KakaoLoginBtn provider="kakao" />
        <GoogleLoginBtn provider="google" />
      </div>
    </div>
  );
};

export default LoginPage;
