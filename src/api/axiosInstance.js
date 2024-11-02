import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api',
});

axiosInstance.interceptors.request.use((config) => {
  const accessToken = sessionStorage.getItem('accessToken');
  if (accessToken) {
    console.log('여기들어오냐');
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newAccessToken = await refreshAccessToken();

      if (newAccessToken) {
        sessionStorage.setItem('accessToken', newAccessToken);
        console.log('여기들어오냐');
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

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

export default axiosInstance;
