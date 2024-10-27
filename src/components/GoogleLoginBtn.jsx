import React, { useState } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const GoogleLoginBtn = () => {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const navigate = useNavigate();
  const [isFetched, setIsFetched] = useState(false);

  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      console.error('리프레시 토큰이 없습니다.');
      return null;
    }
    try {
      const response = await axios.post('http://localhost:3000/api/auth/refresh-token', {}, { headers: { Authorization: `Bearer ${refreshToken}` } });
      const newAccessToken = response.data.accessToken;
      if (newAccessToken) {
        localStorage.setItem('accessToken', newAccessToken);
        return newAccessToken;
      } else {
        console.error('서버로부터 유효한 액세스 토큰을 받지 못했습니다.');
        return null;
      }
    } catch (error) {
      console.error('액세스 토큰 갱신 오류:', error);
      return null;
    }
  };

  const isTokenExpired = (token) => {
    if (!token) return true;
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    } catch (error) {
      console.error('토큰 디코딩 오류:', error);
      return true;
    }
  };

  const axiosRequestWithRetry = async (url, method = 'GET', data = null) => {
    let accessToken = localStorage.getItem('accessToken');
    if (isTokenExpired(accessToken)) {
      console.log('액세스 토큰이 만료됨, 갱신 필요');
      accessToken = await refreshAccessToken();
      if (!accessToken) throw new Error('토큰 갱신 실패');
    }

    try {
      const response = await axios({
        method,
        url,
        data,
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return response;
    } catch (error) {
      console.error('API 요청 실패:', error);
      throw error;
    }
  };

  const fetchUserData = async () => {
    if (isFetched) {
      console.log('이미 사용자 데이터를 불러왔습니다.');
      return;
    }

    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken || isTokenExpired(accessToken)) {
      console.log('유효하지 않은 토큰이므로 사용자 정보를 요청하지 않음');
      return;
    }

    try {
      const response = await axiosRequestWithRetry('http://localhost:3000/api/auth/user-info');
      console.log('사용자 정보:', response.data);
      setIsFetched(true); // 최초 요청 이후 추가 요청 방지
    } catch (error) {
      console.error('사용자 정보 가져오기 오류:', error);
    }
  };

  const handleLoginSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;

    try {
      const response = await axios.post('http://localhost:3000/api/auth/google-login', { token });
      const { accessToken, refreshToken, exists, userId } = response.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      if (accessToken && !isTokenExpired(accessToken) && !isFetched) {
        await fetchUserData();
      }

      if (exists) {
        navigate('/main');
      } else {
        navigate('/signup', { state: { provider: 'google', userId } });
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
          style={{ cursor: 'pointer', width: '300px', height: '50px' }}
          onClick={handleGoogleLogin}
        />
      </div>
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginBtn;
