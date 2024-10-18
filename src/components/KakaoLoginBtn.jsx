import React, { useEffect } from 'react';
import axios from 'axios';

const KakaoLoginBtn = () => {
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
          const response = await axios.post('http://localhost:3000/api/kakao-login', {
            token: authObj.access_token,
          });

          console.log('서버 응답:', response.data);
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
    <button onClick={handleKakaoLogin} style={{ border: 'none', background: 'transparent' }}>
      <img
        src="/src/assets/images/kakaobtnimg.png"
        alt="카카오 로그인"
        style={{
          cursor: 'pointer',
          width: '200px',
          height: '50px',
        }}
      />
    </button>
  );
};

export default KakaoLoginBtn;
