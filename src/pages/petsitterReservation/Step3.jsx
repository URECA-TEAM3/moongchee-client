import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DogChew from '../../components/DogChew';
import { toast, Toaster } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import useReservationStore from '../../store/reservationStore';
import { useUserStore } from '../../store/userStore';
import PayInfo from '../../components/shop/PayInfo';
import { AiOutlineMinus } from 'react-icons/ai';
import { GoInfo } from 'react-icons/go';

const Step3 = () => {
  const [points, setPoints] = useState(0);
  const [payment, setPayment] = useState(true);
  const { reservation } = useReservationStore();
  const navigate = useNavigate();
  const { id, name, address, getPoint } = useUserStore();

  // notification에 저장할 데이터

  // console.log(reservation.sitter_id);
  // useEffect(() => {

  // }, []);

  const handleReservationClick = async () => {
    try {
      const pointUpdateResponse = await axios.post('http://localhost:3000/api/members/update-points', {
        userId: id,
        amount: -reservation.price,
      });
      if (pointUpdateResponse.status === 200) {
        try {
          const reservationResponse = await axios.post('http://localhost:3000/api/petsitter/reservation/add', reservation);

          if (reservationResponse.status === 200) {
            // const requestNotification = await axios.post('http;//localhost:3000/api/notifications/save')
            navigate('/petsitter/reservation/list', { state: { type: 'user' } });
          }
        } catch (error) {
          console.error('예약 생성 실패:', error);
          toast.error('예약 생성에 실패했습니다.');
        }
      }
    } catch (error) {
      toast.error('잔액이 부족하여 결제에 실패했습니다.');
      console.error('포인트 업데이트 실패:', error);
    }
  };

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const userPoints = await getPoint(id);
        setPoints(userPoints);
      } catch (error) {
        console.error('Error fetching points:', error);
      }
    };

    fetchPoints();
    setPayment(points - reservation.price >= 0);
  }, []);

  useEffect(() => {
    setPayment(points - reservation.price >= 0);
  }, [points]);

  return (
    <div className="pt-10">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex flex-col">
        <p className="px-10 font-bold text-black">주소</p>
        <div className="px-10">
          <div className="flex mt-3">
            <p className="font-semibold text-gray-600 mr-3">이름:</p>
            <span>{name}</span>
          </div>
          <div className="flex mt-3">
            <p className="font-semibold text-gray-600 mr-3">주소:</p>
            <span>{address}</span>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex w-full justify-between mt-5 bg-paleblue py-4 items-center">
            <div className="flex px-10">
              <p className="mr-2">차감될</p>
              <DogChew />
            </div>
            <span className="px-10 font-bold">{`${reservation.price}개`}</span>
          </div>
          <div className="flex w-full justify-between mt-5 px-10 items-center">
            <div className="flex">
              <p className="mr-2">나의 현재</p>
              <DogChew />
            </div>
            <div className="flex flex-col items-center justify-center">
              <span className="">{`${points}개`}</span>
            </div>
          </div>
          <div className="flex w-full justify-between mt-5 px-10 items-center">
            <div className="flex">
              <p className="mr-2">결제 후</p>
              <DogChew />
            </div>
            <span>{`${points - reservation.price}개`}</span>
          </div>
        </div>
        <div className="flex justify-center p-10">
          <button className="w-full h-12 mb-5 py-2 bg-primary text-white rounded-lg" onClick={handleReservationClick}>
            결제하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step3;
