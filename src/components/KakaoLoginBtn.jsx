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

  const handleKakaoLogin = () => {
    window.Kakao.Auth.login({
      success: async (authObj) => {
        console.log('로그인 성공:', authObj);

        try {
          const response = await axios.post('http://localhost:3306/api/auth/kakao-login', {
            token: authObj.access_token,
          });

          const { userId, exists } = response.data;
          console.log('서버 응답으로 받은 유저 아이디:', userId);

          if (exists) {
            navigate('/main');
          } else {
            navigate('/signup', { state: { provider: 'kakao', userId } });
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
