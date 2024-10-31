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
      reservation: {
        user_id: null,
        sitter_id: null,
        requestDate: '',
        startTime: '',
        endTime: '',
        status: 'reserved',
        request: '',
        dogSize: '',
        workingTime: '',
        price: 0,
      },
    }),
}));

export default usePetSitterStore;
