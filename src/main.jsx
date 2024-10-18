import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { GoogleLogin } from '@react-oauth/google';
import GoogleLoginBtn from './components/GoogleLoginBtn.jsx';
import KakaoLoginBtn from './components/KakaoLoginBtn.jsx';
import LoginPage from './pages/main/LoginPage.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LoginPage />
  </StrictMode>
);
