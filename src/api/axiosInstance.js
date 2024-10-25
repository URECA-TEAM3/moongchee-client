import axios from 'axios';

// Axios 인스턴스 생성
const API = axios.create({
  baseURL: 'http://localhost:3000', // 공통 기본 URL 설정
});

export default API;
