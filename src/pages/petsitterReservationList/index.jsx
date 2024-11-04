import React, { useEffect, useState } from 'react';
import ReservationCard from '../../components/ReservationCard';
import Modal from '../../components/Modal';
import axios from 'axios';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/userStore';

const index = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [reservationList, setReservationList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState('');
  const [selectedReservation, setSelectedReservation] = useState({
    name: '',
    reservationId: '',
    price: '',
  });
  const { id } = useUserStore();

  const handleReservationList = async () => {
    try {
      const res = await axios.post('http://localhost:3000/api/petsitter/reservation/list', {
        user_id: id,
        user_type: location.state.type,
      });

      const reservationList = res.data.data.map((item) => {
        return {
          name: item.name,
          requestDate: item.requestDate,
          startTime: item.startTime,
          endTime: item.endTime,
          status: item.status,
          price: item.price,
          profile_image: item.profile_image,
          reservationId: item.reservation_id,
        };
      });

      setReservationList(reservationList);
    } catch (error) {}
  };

  const handleReservationUpdate = async (type) => {
    try {
      const res = await axios.post(`http://localhost:3000/api/petsitter/reservation/${type === 'confirm' ? 'confirm' : 'cancel'}`, {
        reservation_id: selectedReservation.reservationId,
      });
      console.log('response:', res.data);
      closeModal();
      if (!type === 'confirm') {
        refundPoint();
      }
      handleReservationList();
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      closeModal();
    }
  };

  const refundPoint = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/members/update-points', {
        userId: id,
        amount: selectedReservation.price,
      });

      console.log('Updated points successfully:', response);
    } catch (error) {
      if (error.response) {
        console.error('Error updating points:', error.response.data.message || error.message);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error in setup:', error.message);
      }
    }
  };

  const openModal = (value, info) => {
    setIsModalOpen(true);
    setSelectedReservation({
      name: info.name,
      reservationId: info.reservationId,
      price: info.price,
    });
    setStatus(value);
  };

  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    handleReservationList();
  }, []);

  return (
    <div className="bg-white pb-10">
      <div className="relative w-full flex items-center pb-4 pt-6">
        <button onClick={() => navigate('/mypage')} className="absolute left-0 ml-1">
          <ChevronLeftIcon className="h-6 w-6 ml-5" />
        </button>
        <h1 className="mx-auto font-bold">예약 / 취소 내역</h1>
      </div>
      <div className="px-10 pt-5 flex flex-col gap-10 ">
        {reservationList.map((item, index) => (
          <ReservationCard key={item.name + index} info={item} openModal={openModal} userType={location.state.type} />
        ))}
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={
            status === 'confirm' ? (
              <div>
                <p className="text-lg font-bold">{selectedReservation.name}</p>님의 요청을 수락하시겠습니까?
              </div>
            ) : status === 'reject' ? (
              <div>
                <p className="text-lg font-bold">{selectedReservation.name}</p>님의 요청을 거절하시겠습니까?
              </div>
            ) : (
              <div>
                <p className="text-lg font-bold">{selectedReservation.name}</p>님에게 예약된 예약건을 취소하시겠습니까?
              </div>
            )
          }
        >
          <div className="my-10 flex justify-center">
            <span className="text-alert font-bold">이 과정은 돌이킬 수 없습니다.</span>
          </div>
          <div className="flex gap-4 mt-3">
            <button onClick={closeModal} className="px-10 py-2 w-full bg-divider text-gray-500 rounded-lg">
              취소
            </button>
            <button
              onClick={() => handleReservationUpdate(status === 'confirm' ? 'confirm' : 'cancel')}
              className="px-8 py-2 w-full bg-delete text-white rounded-lg"
            >
              확인
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default index;
