import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { refreshAccessToken } from '../../api/login';
import KakaoLoginBtn from '../../components/login/KakaoLoginBtn';
import GoogleLoginBtn from '../../components/login/GoogleLoginBtn';

const LoginPage = () => {
  const navigate = useNavigate();

  const isTokenExpired = (token) => {
    if (!token) return true;

    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    } catch (error) {
      console.error('토큰 만료 확인 중 오류:', error);
      return true;
    }
  };

  const checkTokenAndRedirect = async () => {
    let accessToken = sessionStorage.getItem('accessToken');

    if (!accessToken || isTokenExpired(accessToken)) {
      accessToken = await refreshAccessToken();
    }

    if (accessToken && !isTokenExpired(accessToken)) {
      navigate('/main');
    }
  };

  useEffect(() => {
    checkTokenAndRedirect();
  }, []);

  return (
    <div className="flex justify-center items-center h-screen bg-primary">
      <div className="text-center text-white">
        <h1 className="text-xl">
          반려견의 행복수치 상승을 위한
          <br /> 쇼핑과 펫시터 앱
        </h1>
        <img src="/assets/images/LoginLogo.png" alt="로고" className="h-[400px] mx-auto my-6" />
        <div className="flex items-center mb-5">
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
