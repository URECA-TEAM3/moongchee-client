import React, { useState } from 'react';
import Modal from '../components/Modal';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ReservationCard = ({ info }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState('');
  const [isPetSitter, setIsPetSitter] = useState(true);

  const navigate = useNavigate();

  const openModal = (value) => {
    setIsModalOpen(true);
    setStatus(value);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleStatusCode = () => {
    if (info.status === 'reserved') return '예약 완료';
    else if (info.status === 'cancelled') return '취소 완료';
    else if (info.status === 'completed') return '펫시팅 완료';
    else return '';
  };

  const handleReservationCancel = async () => {
    try {
      const res = await axios.post('http://localhost:3000/api/petsitter/reservation/cancel', { reservation_id: info.reservationId });
      console.log('Cancellation response:', res.data);
      alert('예약이 취소되었습니다.');
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      alert('예약 취소에 실패했습니다.');
    }
  };

  const handleDetailClick = () => navigate('/petsitter/reservation/detail');

  return (
    <div className={`bg-paleblue rounded-lg shadow-sm p-5 ${info.status === 'reserved' ? 'grayscale-0' : 'grayscale'}`}>
      <div className="profile flex items-center mt-3">
        <img src="/src/assets/images/dog.jpeg" className="object-cover object-center w-24 h-24 rounded-full " />
        <div className="personal ml-5">
          <span className="text-xl text-slate-900 font-bold">{info.name}</span>
        </div>
        {isPetSitter && (
          <span className={`${info.status === 'cancelled' ? 'text-white bg-gray-500' : 'text-black bg-secondary'} rounded-md px-2 py-1 text-sm ml-auto`}>
            {handleStatusCode()}
          </span>
        )}
      </div>
      <div className="flex mt-3 justify-between items-center">
        <div className="flex flex-col">
          <span className="text-lg text-slate-900 font-medium">요청한 날짜와 시간</span>
          <span>{info.scheduled}</span>
          <span>{`${info.startTime}~${info.endTime}`}</span>
        </div>
        {isPetSitter && info.status === 'reserved' && (
          <span className="text-gray-500 text-2xl cursor-pointer" onClick={handleDetailClick}>
            &gt;
          </span>
        )}
      </div>
      <div className="flex gap-5 mt-3">
        {!isPetSitter ? (
          <div className="flex gap-5 mt-3 w-full">
            <button className="text-white bg-delete px-4 py-2 rounded-lg font-normal w-full" onClick={() => openModal('reject')}>
              거절
            </button>
            <button className="text-white bg-primary px-4 py-2 rounded-lg font-normal w-full" onClick={() => openModal('confirm')}>
              수락
            </button>
          </div>
        ) : info.status === 'reserved' ? (
          <button className="text-white bg-primary px-4 py-2 rounded-lg font-normal w-full" onClick={() => openModal('cancel')}>
            예약 취소하기
          </button>
        ) : (
          ''
        )}
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={
          status === 'confirm' ? (
            <div>
              <span className="text-lg font-bold mr-2">{info.name}</span>님의 요청을 수락하시겠습니까?
            </div>
          ) : status === 'reject' ? (
            <div>
              <span className="text-lg font-bold mr-2">{info.name}</span>님의 요청을 거절하시겠습니까?
            </div>
          ) : (
            <div>
              <span className="text-lg font-bold mr-2">{info.name}</span>님에게 예약된 예약건을 취소하시겠습니까?
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
          <button className="text-white bg-primary px-4 py-2 rounded-lg font-normal w-full">수락</button>
        </div>
      </Modal>
    </div>
  );
};

export default ReservationCard;
