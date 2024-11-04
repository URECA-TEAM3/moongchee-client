import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import axiosInstance from '../api/axiosInstance';

const KakaoLoginBtn = () => {
  const navigate = useNavigate();
  const { login } = useUserStore.getState();

  useEffect(() => {
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(import.meta.env.VITE_KAKAO_JS_KEY);
    }
  }, []);

  const handleKakaoLogin = async () => {
    const storedAccessToken = sessionStorage.getItem('accessToken');

    if (storedAccessToken) {
      try {
        const userInfoResponse = await axiosInstance.get('/auth/user-info');
        sessionStorage.setItem('userData', JSON.stringify(userInfoResponse.data));

        console.log('유저 데이터:', userInfoResponse.data);
        navigate('/main');
        return;
      } catch (error) {
        console.error('유저 데이터 가져오기 오류:', error);
      }
    }

    window.Kakao.Auth.login({
      success: async (authObj) => {
        try {
          const response = await axiosInstance.post('/auth/kakao-login', {
            token: authObj.access_token,
          });

          const { accessToken, refreshToken, userId, exists, userData } = response.data;

          if (exists) {
            sessionStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);

            sessionStorage.setItem('userData', JSON.stringify(userData));
            login(userData);

            console.log('유저 데이터:', userData);
            navigate('/main');
          } else {
            navigate('/signup', { state: { provider: 'kakao', userId, accessToken } });
          }
        } catch (error) {
          console.error('로그인 오류:', error);
        }
      },
      fail: (err) => {
        console.error('로그인 실패:', err);
      },
    });
  };

  return (
    <button onClick={handleKakaoLogin} style={{ border: 'none', background: 'transparent' }} className="mb-3">
      <img
        src="/src/assets/images/kakaobtnimg.svg"
        alt="카카오 로그인"
        style={{
          cursor: 'pointer',
          width: '300px',
          height: '50px',
        }}
      />
    </button>
  );
};

export default KakaoLoginBtn;
