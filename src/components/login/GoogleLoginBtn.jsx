import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/userStore';
import axiosInstance from '../../api/axiosInstance';

const GoogleLoginBtn = () => {
  const { login } = useUserStore((state) => state);
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const navigate = useNavigate();

  const handleLoginSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;

    try {
      const response = await axiosInstance.post('/auth/google-login', { token });
      const { accessToken, refreshToken, exists, userData } = response.data;

      if (exists) {
        sessionStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        sessionStorage.setItem('userData', JSON.stringify(userData));
        console.log('유저 데이터:', userData);
        login(userData);
        navigate('/main');
      } else {
        navigate('/signup', { state: { provider: 'google', userId: response.data.userId, accessToken } });
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
          src="/assets/images/googlebtn.svg"
          alt="Google 로그인"
          style={{ cursor: 'pointer', width: '300px', height: '50px' }}
          onClick={handleGoogleLogin}
        />
      </div>
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginBtn;
