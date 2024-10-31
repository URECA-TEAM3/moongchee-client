import { create } from 'zustand';

const useReservationStore = create((set) => ({
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

  setReservationData: (data) =>
    set({
      reservation: { ...data },
    }),

  resetReservation: () =>
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

export default useReservationStore;
