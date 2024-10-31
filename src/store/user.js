import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const initialUserState = {};

export const useUserStore = create(
  persist(
    (set) => ({
      ...initialUserState,
      login: (userData) => {
        sessionStorage.setItem('userData', JSON.stringify(userData));
        set(set(userData));
      },
      logout: () => {
        sessionStorage.removeItem('userData');
        set({ ...initialUserState });
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
