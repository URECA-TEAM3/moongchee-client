import { create } from 'zustand';

const usePetSitterStore = create((set) => ({
  petsitter: {
    name: '',
    imageUrl: '',
    weekdays: '',
    startTime: '',
    endTime: '',
    description: '',
    experience: '',
  },

  setPetsitterData: (data) =>
    set({
      petsitter: { ...data },
    }),

  resetPetsitter: () =>
    set({
      petsitter: {
        name: '',
        imageUrl: '',
        weekdays: '',
        startTime: '',
        endTime: '',
        description: '',
        experience: '',
      },
    }),
}));

export default usePetSitterStore;
