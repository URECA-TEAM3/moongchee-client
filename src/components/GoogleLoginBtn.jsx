import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const GoogleLoginBtn = () => {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const navigate = useNavigate();

  const handleLoginSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;

    console.log('로그인 성공, 받은 토큰:', token);

    try {
      const response = await axios.post('http://localhost:3000/api/auth/google-login', {
        token,
      });

      console.log('서버 응답:', response.data);

      if (response.data.exists) {
        console.log('이미 가입된 회원입니다. 회원 ID:', response.data.id); // ID 값 출력
        navigate('/main');
      } else {
        const userId = response.data.userId;
        console.log('회원가입 필요, 받은 userId:', userId); // userId 출력
        navigate('/signup', { state: { provider: 'google', token, userId } });
      }
    } catch (error) {
      console.error('로그인 오류:', error);
    }
  };

  const handleGoogleLogin = () => {
    window.google.accounts.id.initialize({
      client_id: googleClientId,
      callback: handleLoginSuccess,
    });

    window.google.accounts.id.prompt();
  };

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <img
          src="/src/assets/images/googlebtn.svg"
          alt="Google 로그인"
          style={{
            cursor: 'pointer',
            width: '300px',
            height: '50px',
          }}
          onClick={handleGoogleLogin}
        />
      </div>
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginBtn;
