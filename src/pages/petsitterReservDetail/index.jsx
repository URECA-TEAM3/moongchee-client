import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from '../../components/Modal';
import { useUserStore } from '../../store/userStore';
import { useNavigate, useLocation } from 'react-router-dom';

const index = () => {
  const { id } = useUserStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState('');
  const [detailData, setDetailData] = useState({
    name: '',
    scheduled: '',
    startTime: '',
    endTime: '',
    request: '',
    animal_image_url: '',
    pet: {},
  });
  const location = useLocation();
  const navigate = useNavigate();
  const userInfo = location.state.info;
  const userType = location.state.userType;

  const handleGenderCode = (value) => {
    if (value === 'male') {
      return '남아';
    } else {
      return '여아';
    }
  };

  const handleNeutuerStatusCode = (value) => {
    if (value) {
      return '중성화 수술 완료';
    } else {
      return '중성화 수술 미완료';
    }
  };

  const fetchDetailList = async () => {
    console.log(userInfo);
    console.log(userType);
    try {
      const res = await axios.get(`http://localhost:3000/api/petsitter/reservation/detail/${userInfo.reservationId}`);
      const res2 = await axios.get(`http://localhost:3000/api/pets/${id}`);
      const petList = res2.data;
      const petData = petList.map((pet) => (pet.name === res.data.data.pet ? pet : ''));
      const data = {
        ...res.data.data,
        name: userInfo.name,
        profile: userInfo.profile_image,
        pet: petData[0],
      };
      setDetailData(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleReservationUpdate = async (type) => {
    try {
      const res = await axios.post(`http://localhost:3000/api/petsitter/reservation/${type === 'confirm' ? 'confirm' : 'cancel'}`, {
        reservation_id: userInfo.reservationId,
      });
      console.log('response:', res.data);
      closeModal();
      if (!type === 'confirm') {
        refundPoint();
      }
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      closeModal();
    }
  };

  const openModal = (value, info) => {
    setIsModalOpen(true);
    setStatus(value);
  };

  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    fetchDetailList();
  }, []);

  return (
    <div className="p-10 h-full bg-white overflow-y-auto">
      <div className="profile flex items-center mt-3">
        <img src={detailData.profile} className="object-cover object-center w-24 h-24 rounded-full " />
        <div className="personal ml-5">
          <span className="text-xl text-slate-900 font-bold">{detailData.name}</span>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="flex flex-col mt-5">
          <span className="text-sm font-bold">요청한 날짜</span>
          <span className="text-lg">{detailData.requestDate}</span>
        </div>
        <div className="flex flex-col mt-5">
          <span className="text-sm font-bold">요청한 시간</span>
          <span className="text-lg">{`${detailData.startTime} ~ ${detailData.endTime}`}</span>
        </div>
        <div className="mt-5">
          <span className="text-sm font-bold">반려동물 정보</span>
          <div className="flex flex-col bg-paleblue px-5 py-3 rounded-lg mt-1">
            <span className="font-bold">{detailData.pet.name}</span>
            <span>{`${detailData.pet.species} | ${detailData.pet.age}살 | ${handleGenderCode(detailData.pet.gender)} | ${detailData.pet.weight}`}</span>
            <span>{handleNeutuerStatusCode(detailData.pet.surgery)}</span>
          </div>
        </div>
        <div className="mt-5">
          <span className="text-sm font-bold">요청 사항</span>
          <div className="whitespace-pre-line leading-7">{detailData.request}</div>
        </div>
        <div className="mt-10">
          {userType ? (
            detailData.status === 'confirmed' ? (
              <div className="flex gap-5 w-full">
                <button className="text-white bg-delete px-4 py-2 rounded-lg h-12 w-full" onClick={() => openModal('reject')}>
                  거절
                </button>
                <button className="text-white bg-primary px-4 py-2 rounded-lg h-12 w-full" onClick={() => openModal('confirm')}>
                  수락
                </button>
              </div>
            ) : (
              <button className="text-white bg-primary px-4 py-2 rounded-lg h-12 w-full" onClick={() => openModal('cancel')}>
                예약 취소하기
              </button>
            )
          ) : (
            <button className="text-white bg-primary px-4 py-2 rounded-lg h-12 w-full" onClick={() => openModal('cancel')}>
              예약 취소하기
            </button>
          )}
        </div>
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={
            status === 'confirm' ? (
              <div>
                <p className="text-lg font-bold">{detailData.name}</p>님의 요청을 수락하시겠습니까?
              </div>
            ) : status === 'reject' ? (
              <div>
                <p className="text-lg font-bold">{detailData.name}</p>님의 요청을 거절하시겠습니까?
              </div>
            ) : (
              <div>
                <p className="text-lg font-bold">{detailData.name}</p>님에게 예약된 예약건을 취소하시겠습니까?
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
              onClick={() => {
                handleReservationUpdate(status === 'confirm' ? 'confirm' : 'cancel');
                navigate(-1);
              }}
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
