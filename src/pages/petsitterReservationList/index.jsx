import React, { useEffect, useState } from 'react';
import ReservationCard from '../../components/ReservationCard';
import Modal from '../../components/Modal';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/userStore';
import EmptyPage from '../../components/EmptyPage';
import Spinner from '../../components/Spinner';
import { getSitterDetailWithSitterId, saveNotifications, updateReservations, getReservationList } from '../../api/petsitter';
import { refundPoint } from '../../api/purchase';

const Index = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isPetsitter, setIsPetSitter] = useState('user');
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
  const [sitterInfo, setSitterInfo] = useState({});

  const fetchSitterInfo = async (sitterId) => {
    setSitterInfo(getSitterDetailWithSitterId(sitterId));
  };

  const handleReservationList = async (target) => {
    setIsLoading(true);
    try {
      const p_id = id;
      const userType = target;
      const reservationList = await getReservationList(p_id, userType);

      if (reservationList.length > 0) {
        setShowItems(true);
      }
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
      const target = type === 'confirm' ? 'confirm' : 'cancel';
      const id = selectedReservation.reservationId;

      await updateReservations(target, id);

      closeModal();

      if (type !== 'confirm') {
        handleRefundPoint();
      }
      handleReservationList(isPetsitter);

      let notiType;
      if (type === 'cancel') {
        notiType = isPetsitter !== 'user' ? 'denied' : 'canceled';
      } else {
        notiType = 'confirmed';
      }

      const notiData = {
        sending_name: name,
        receive_id: isPetsitter === 'petsitter' ? selectedReservation.userId : sitterInfo.userId,
        receive_name: selectedReservation.name,
        type: notiType,
        status: 'unread',
      };

      await saveNotifications(notiData);
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      closeModal();
    }
  };

  const handleRefundPoint = async () => {
    const p_id = id;
    const amount = selectedReservation.price;
    await refundPoint(p_id, amount);
  };

  const openModal = (value, info) => {
    setIsModalOpen(true);
    setSelectedReservation({
      name: info.name,
      reservationId: info.reservationId,
      price: info.price,
      userId: info.userId,
      sitterId: info.sitterId,
    });
    fetchSitterInfo(info.sitterId);
    setStatus(value);
  };

  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    if (location.state.type === 'petsitter') {
      setIsPetSitter('petsitter');
      handleReservationList('petsitter');
    } else {
      setIsPetSitter('user');
      handleReservationList('user');
    }
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
            {isPetsitter === 'petsitter' ? <h1 className="mx-auto font-bold">요청 내역</h1> : <h1 className="mx-auto font-bold">예약 / 취소 내역</h1>}
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
        <div className="flex flex-col items-center justify-center h-full">
          <EmptyPage message="예약내역이 없습니다." buttonText="뒤로가기" onButtonClick={() => navigate(-1)} />
        </div>
      )}
    </div>
  );
};

export default Index;
