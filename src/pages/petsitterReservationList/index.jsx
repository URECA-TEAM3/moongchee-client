import React, { useEffect, useState } from 'react';
import ReservationCard from '../../components/ReservationCard';
import Modal from '../../components/Modal';
import axios from 'axios';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/userStore';
import EmptyPage from '../../components/EmptyPage';
import API from '../../api/axiosInstance';
import Spinner from '../../components/Spinner';

const Index = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [reservationList, setReservationList] = useState([]);
  const [showItems, setShowItems] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReservation, setSelectedReservation] = useState({
    name: '',
    reservationId: '',
    price: '',
  });
  const { id, name } = useUserStore();
  const isPetsitter = location.state.type;
  const [sitterInfo, setSitterInfo] = useState({});

  const fetchSitterInfo = async (sitterId) => {
    try {
      const response = await API.get(`/petsitter/detail/${sitterId}`);
      setSitterInfo(response.data.data[0]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleReservationList = async () => {
    setIsLoading(true);
    try {
      const res = await axios.post('http://localhost:3000/api/petsitter/reservation/list', {
        user_id: id,
        user_type: isPetsitter,
      });

      const reservationList = res.data.data.map((item) => ({
        name: item.name,
        sitterId: item.sitter_id,
        requestDate: item.requestDate,
        startTime: item.startTime,
        endTime: item.endTime,
        status: item.status,
        price: item.price,
        profile_image: item.profile_image,
        reservationId: item.reservation_id,
      }));

      setShowItems(reservationList.length > 0);
      setReservationList(reservationList);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReservationUpdate = async (type) => {
    try {
      const res = await axios.post(`http://localhost:3000/api/petsitter/reservation/${type === 'confirm' ? 'confirm' : 'cancel'}`, {
        reservation_id: selectedReservation.reservationId,
      });
      console.log('response:', res.data);
      closeModal();
      if (type !== 'confirm') {
        refundPoint();
      }
      handleReservationList();

      try {
        let notiType;
        if (type === 'cancel') {
          notiType = isPetsitter !== 'user' ? 'denied' : 'canceled';
        } else {
          notiType = 'confirmed';
        }

        const notiData = {
          sending_name: name,
          receive_id: sitterInfo.userId,
          receive_name: selectedReservation.name,
          type: notiType,
          status: 'unread',
        };

        await axios.post('http://localhost:3000/api/notifications/save', notiData);
      } catch (error) {
        console.error('Notification 정보 저장 실패:', error);
      }
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
      console.error('Error updating points:', error);
    }
  };

  const openModal = (value, info) => {
    setIsModalOpen(true);
    setSelectedReservation({
      name: info.name,
      reservationId: info.reservationId,
      price: info.price,
      sitterId: info.sitterId,
    });
    fetchSitterInfo(info.sitterId);
    setStatus(value);
  };

  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    handleReservationList();
  }, []);

  return (
    <div className="bg-white pb-10 h-full overflow-y-auto">
      {isLoading ? (
        <Spinner />
      ) : showItems ? (
        <div>
          <div className="relative w-full flex items-center pb-4 pt-6">
            <button onClick={() => navigate(-1)} className="absolute left-0 ml-1">
              <ChevronLeftIcon className="h-6 w-6 ml-5" />
            </button>
            {isPetsitter ? <h1 className="mx-auto font-bold">요청 내역</h1> : <h1 className="mx-auto font-bold">예약 / 취소 내역</h1>}
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
      ) : (
        <EmptyPage message="예약내역이 없습니다." buttonText="뒤로가기" onButtonClick={() => navigate(-1)} />
      )}
    </div>
  );
};

export default Index;
