import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import API from '../api/axiosInstance';

const initialUserState = {};

export const useUserStore = create(
  persist(
    (set) => ({
      ...initialUserState,
      login: (userData) => {
        set(userData);
      },
      logout: () => {
        sessionStorage.removeItem('userData');
        set({ ...initialUserState });
      },
      getPoint: async (id) => {
        try {
          const response = await API.get(`/api/members/point/${id}`);
          const points = response.data.data.point;

          set({ points }); // Zustand 상태에 포인트 값 저장
          console.log('포인트 요청 성공:', points);
        } catch (error) {
          console.error('포인트 요청 실패:', error);
        }
      },
    }),
    {
      name: 'user-storage',
      getStorage: () => localStorage,
      onRehydrateStorage: (state) => {
        const sessionData = JSON.parse(sessionStorage.getItem('userData')) || {};

        // 모든 값을 상태에 설정
        Object.keys(sessionData).forEach((key) => {
          state[key] = sessionData[key];
        });
      },
    }
  )
);
