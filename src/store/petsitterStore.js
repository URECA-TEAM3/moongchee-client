import { create } from 'zustand';

const usePetSitterStore = create((set) => ({
  petsitter: {
    id: '',
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
        id: '',
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
