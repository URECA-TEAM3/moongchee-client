import React from 'react';
import axios from 'axios';
import DogChew from '../../components/DogChew';
import { toast, Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import useReservationStore from '../../store/reservationStore';
import { useUserStore } from '../../store/userStore';

const Step3 = () => {
  const { reservation } = useReservationStore();
  const navigate = useNavigate();
  const { id, name, address, point } = useUserStore();

  const handleReservationClick = async () => {
    if (reservation.price > point) {
      toast.error('잔액이 부족하여 결제에 실패했습니다.');
      return;
    }

    try {
      const pointUpdateResponse = await axios.post('http://localhost:3000/api/members/update-points', {
        userId: id,
        amount: -reservation.price,
      });
      if (pointUpdateResponse.status === 200) {
        try {
          const reservationResponse = await axios.post('http://localhost:3000/api/petsitter/reservation/add', reservation);

          if (reservationResponse.status === 200) {
            navigate('/petsitter/reservation/list', { state: { type: 'user' } });
          }
        } catch (error) {
          console.error('예약 생성 실패:', error);
          toast.error('예약 생성에 실패했습니다.');
        }
      }
    } catch (error) {
      console.error('포인트 업데이트 실패:', error);
    }
  };

  return (
    <div className="mt-5">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex flex-col">
        <p className="px-5 mt-5 font-bold text-black">주소</p>
        <div className="px-5">
          <div className="flex mt-3">
            <p className="font-semibold text-gray-600">이름:</p>
            <span>{name}</span>
          </div>
          <div className="flex mt-3">
            <p className="font-semibold text-gray-600">주소:</p>
            <span>{address}</span>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex w-full justify-between mt-5 bg-lightblue h-[50px] items-center">
            <div className="flex px-5 font-bold text-black">
              <p className="mr-2">차감될</p>
              <DogChew />
            </div>
            <span className="px-5">{`${reservation.price}개`}</span>
          </div>
          <div className="flex w-full justify-between mt-5 px-5 h-[50px] items-center">
            <div className="flex">
              <p className="mr-2">나의 현재</p>
              <DogChew />
            </div>
            <div className="flex flex-col items-center justify-center">
              <span className="text-gray-500">{`${point}개`}</span>
              <span className="text-gray-500">{`- ${reservation.price}개`}</span>
            </div>
          </div>
          <div className="flex w-full justify-between mt-5 px-5 h-[50px] items-center">
            <div className="flex">
              <p className="mr-2">결제 후</p>
              <DogChew />
            </div>
            <span>{`${point - reservation.price}개`}</span>
          </div>
        </div>
        <div className="flex justify-center mt-10">
          <button className="text-white bg-primary px-4 py-2 rounded-lg font-normal w-[150px]" onClick={handleReservationClick}>
            결제하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step3;
