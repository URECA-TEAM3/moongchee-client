import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import axios from 'axios';

const GoogleLoginBtn = () => {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const handleLoginSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;

    try {
      const response = await axios.post('http://localhost:3000/api/google-login', {
        token,
      });

      console.log('서버 응답:', response.data);
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
          src="/src/assets/images/googlebtn.png"
          alt="Google 로그인"
          style={{
            cursor: 'pointer',
            width: '200px',
            height: '50px',
          }}
          onClick={handleGoogleLogin}
        />
      </div>
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginBtn;
