import React from 'react';
import KakaoLoginBtn from '../../components/KakaoLoginBtn';
import GoogleLoginBtn from '../../components/GoogleLoginBtn';
import '../../styles/LoginPage.css';

const LoginPage = () => {
  return (
    <div className="login-container">
      <div className="content">
        <h1 className="title">
          반려견의 행복수치 상승을 위한<br></br> 쇼핑과 펫시터 앱
        </h1>
        <img src="/src/assets/images/LoginLogo.png" alt="로고" className="logo" />
        <div className="divider">SNS 계정으로 로그인</div>
        <KakaoLoginBtn />
        <GoogleLoginBtn />
      </div>
    </div>
  );
};

export default LoginPage;
