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
import API from '../../api/axiosInstance';

const Step3 = () => {
  const [points, setPoints] = useState(0);
  const [payment, setPayment] = useState(true);
  const { reservation } = useReservationStore();
  const navigate = useNavigate();
  const { id, name, address, getPoint } = useUserStore();
  const [sitterInfo, setSitterInfo] = useState({});

  useEffect(() => {
    const sitterId = reservation.sitter_id;
    fetchSitterInfo(sitterId);
  }, []);

  const fetchSitterInfo = async (sitterId) => {
    try {
      const response = await API.get(`/petsitter/detail/${reservation.sitter_id}`);
      setSitterInfo(response.data.data[0]);
    } catch (error) {
      console.error(error);
    }
  };

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
            const notiData = {
              sending_name: name,
              receive_id: sitterInfo.userId,
              receive_name: sitterInfo.name,
              type: 'request',
              status: 'unread',
            };

            try {
              const requestNotification = await axios.post('http://localhost:3000/api/notifications/save', notiData);
              navigate('/petsitter/reservation/list', { state: { type: 'user' } });
            } catch (error) {
              console.error('Notification 정보 저장 실패');
            }
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
        <div className="grow flex flex-col justify-end mt-5">
          <PayInfo totalPrice={reservation.price} disabled={true} />

          <div className="flex justify-between items-start pt-3 px-10">
            <div className="flex">
              <span className="mr-2">나의 현재 </span> <DogChew />
            </div>
            {payment ? (
              <div className="w-24 flex flex-col items-end gap-1">
                <div>{points}개</div>
                <div className="flex justify-between w-full pl-2">
                  <AiOutlineMinus />
                  <div>{reservation.price}개</div>
                </div>
                <div className="border border-text w-full" />
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center text-[red] text-sm mr-2">
                  잔액이 부족합니다.
                  <GoInfo className="ml-1" />
                </div>
                <div>{points - reservation.price}개</div>
              </div>
            )}
          </div>

          {payment && (
            <div className="flex justify-between items-center pb-3 mt-[0.25rem] px-10">
              <div className="flex">
                <span className="mr-2">결제 후 </span> <DogChew />
              </div>
              <div className="font-bold">{points - reservation.price}개</div>
            </div>
          )}

          {payment ? (
            <div className="text-center my-5 px-10">
              <button onClick={handleReservationClick} className="w-full h-12 mb-5 py-2 bg-primary text-white rounded-lg">
                결제하기
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center m-10">
              <Link to="/chargepage" className="text-sm underline underline-offset-2">
                지금 바로 충전하기
              </Link>
              <button className="w-full h-12 py-2 bg-gray-300 text-white rounded-lg mt-2">결제하기</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Step3;
