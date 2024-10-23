import React, { useState } from 'react';
import Modal from '../components/Modal';

const ReservationCard = ({ info }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState('');

  const openModal = (value) => {
    setIsModalOpen(true);
    setStatus(value);
  };

  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="bg-paleblue rounded-lg shadow-sm p-5">
      <div className="profile flex items-center mt-3">
        <img src="/src/assets/images/dog.jpeg" className="object-cover object-center w-24 h-24 rounded-full " />
        <div className="personal ml-5">
          <span className="text-xl text-slate-900 font-bold">{info.name}</span>
        </div>
      </div>
      <div className="flex flex-col mt-3">
        <span className="text-lg text-slate-900 font-medium">요청한 날짜와 시간</span>
        <span>{info.scheduled}</span>
        <span>{`${info.startTime}~${info.endTime}`}</span>
      </div>
      <div className="flex gap-5 mt-3">
        <button className="text-white bg-delete px-4 py-2 rounded-lg font-normal w-full" onClick={() => openModal('reject')}>
          거절
        </button>
        <button className="text-white bg-primary px-4 py-2 rounded-lg font-normal w-full" onClick={() => openModal('confirm')}>
          수락
        </button>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={
          status === 'confirm' ? (
            <div>
              <span className="text-lg font-bold mr-2">{info.name}</span>님의 요청을 수락하시겠습니까?
            </div>
          ) : (
            <div>
              <span className="text-lg font-bold mr-2">{info.name}</span>님의 요청을 거절하시겠습니까?
            </div>
          )
        }
      >
        <div className="my-10 flex justify-center">
          <span className="text-alert font-bold text-lg">* 승인을 하면 취소 할 수 없습니다.</span>
        </div>
        <div className="flex gap-4 mt-3">
          <button className="text-white bg-divider px-4 py-2 rounded-lg font-normal w-full">취소</button>
          <button className="text-white bg-primary px-4 py-2 rounded-lg font-normal w-full">수락</button>
        </div>
      </Modal>
    </div>
  );
};

export default ReservationCard;
