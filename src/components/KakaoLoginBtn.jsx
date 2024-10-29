import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const KakaoLoginBtn = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(import.meta.env.VITE_KAKAO_JS_KEY);
    }
  }, []);

  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    console.log('저장된 리프레시 토큰:', refreshToken);
    try {
      const response = await axios.post(
        'http://localhost:3000/api/auth/refresh-token',
        {},
        {
          headers: { Authorization: `Bearer ${refreshToken}` },
        }
      );

      const newAccessToken = response.data.accessToken;
      console.log('새로 받은 액세스 토큰:', newAccessToken);

      localStorage.setItem('accessToken', newAccessToken);
      return newAccessToken;
    } catch (error) {
      console.error('액세스 토큰 갱신 오류:', error);
      return null;
    }
  };

  const handleKakaoLogin = async () => {
    const storedAccessToken = localStorage.getItem('accessToken');

    if (storedAccessToken && !isTokenExpired(storedAccessToken)) {
      try {
        const userInfoResponse = await axios.get('http://localhost:3000/api/auth/user-info', {
          headers: { Authorization: `Bearer ${storedAccessToken}` },
        });

        sessionStorage.setItem('userData', JSON.stringify(userInfoResponse.data));

        console.log('유저 데이터:', userInfoResponse.data);
        navigate('/main');
      } catch (error) {
        console.error('유저 데이터 가져오기 오류:', error);
      }
      return;
    }

    window.Kakao.Auth.login({
      success: async (authObj) => {
        try {
          const response = await axios.post('http://localhost:3000/api/auth/kakao-login', {
            token: authObj.access_token,
          });

          const { accessToken, refreshToken, userId, exists, userData } = response.data;
          console.log(response.data)
          if (exists) {
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);

            sessionStorage.setItem('userData', JSON.stringify(userData));

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

  const fetchUserData = async () => {
    try {
      const response = await axiosRequestWithRetry('http://localhost:3000/api/auth/user-info');
      console.log('사용자 정보:', response.data);
    } catch (error) {
      console.error('사용자 정보 가져오기 오류:', error);
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
      if (!accessToken) {
        throw new Error('토큰 갱신 실패');
      }
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
      throw error;
    }
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
