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
  type: '',

  setPetsitterData: (data) =>
    set({
      petsitter: { ...data },
    }),
  setType: (data) =>
    set({
      type: data,
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
