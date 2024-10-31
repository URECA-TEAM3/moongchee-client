import React, { useEffect, useState } from 'react';
import ReservationCard from '../../components/ReservationCard';
import Modal from '../../components/Modal';
import axios from 'axios';

const index = () => {
  const [reservationList, setReservationList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState('');
  const [selectedReservation, setSelectedReservation] = useState({
    name: '',
    reservationId: '',
  });

  const handleReservationList = async () => {
    try {
      const res = await axios.post('http://localhost:3000/api/petsitter/reservation/list', {
        user_id: 1, // 나중에 user 에서 가져옴
        user_type: 'user', // 마찬가지
      });

      const reservationList = res.data.data.map((item) => {
        return {
          name: item.name,
          requestDate: item.requestDate,
          startTime: item.startTime,
          endTime: item.endTime,
          status: item.status,
          reservationId: item.reservation_id,
        };
      });

      setReservationList(reservationList);
    } catch (error) {}
  };

  const handleReservationCancel = async () => {
    try {
      const res = await axios.post('http://localhost:3000/api/petsitter/reservation/cancel', { reservation_id: selectedReservation.reservationId });
      console.log('Cancellation response:', res.data);
      alert('예약이 취소되었습니다.');
      closeModal();
      handleReservationList();
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      alert('예약 취소에 실패했습니다.');
      closeModal();
    }
  };

  const openModal = (value, info) => {
    setIsModalOpen(true);
    setSelectedReservation({
      name: info.name,
      reservationId: info.reservationId,
    });
    setStatus(value);
  };

  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    handleReservationList();
  }, []);

  return (
    <div className="px-10 flex flex-col gap-10">
      {reservationList.map((item, index) => (
        <ReservationCard key={item.name + index} info={item} openModal={openModal} />
      ))}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={
          status === 'confirm' ? (
            <div>
              <span className="text-lg font-bold mr-2">{selectedReservation.name}</span>님의 요청을 수락하시겠습니까?
            </div>
          ) : status === 'reject' ? (
            <div>
              <span className="text-lg font-bold mr-2">{selectedReservation.name}</span>님의 요청을 거절하시겠습니까?
            </div>
          ) : (
            <div>
              <span className="text-lg font-bold mr-2">{selectedReservation.name}</span>님에게 예약된 예약건을 취소하시겠습니까?
            </div>
          )
        }
      >
        <div className="my-10 flex justify-center">
          <span className="text-alert font-bold text-lg">* 승인을 하면 취소 할 수 없습니다.</span>
        </div>
        <div className="flex gap-4 mt-3">
          <button className="text-white bg-divider px-4 py-2 rounded-lg font-normal w-full" onClick={closeModal}>
            취소
          </button>
          <button className="text-white bg-primary px-4 py-2 rounded-lg font-normal w-full" onClick={handleReservationCancel}>
            수락
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default index;
