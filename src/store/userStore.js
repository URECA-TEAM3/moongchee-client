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
        set({ ...initialUserState });
        localStorage.removeItem('user-storage');
        sessionStorage.removeItem('userData'); // 세션 스토리지 데이터도 삭제
      },

      // 포인트 얻어오는 함수
      getPoint: async (id) => {
        try {
          const response = await API.get(`/members/point/${id}`);
          const points = response.data.data.point;

          return points;
        } catch (error) {
          console.error('포인트 요청 실패:', error);
        }
      },
      // 프로필 업데이트 함수
      updateProfileToStorage: (newUserInfo) =>
        set((state) => ({
          ...state,
          ...newUserInfo, // 새로운 정보로 필드 업데이트
        })),
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
