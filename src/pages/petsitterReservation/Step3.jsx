import React from 'react';
import axios from 'axios';
import DogChew from '../../components/DogChew';
import { useNavigate } from 'react-router-dom';
import useReservationStore from '../../store/reservationStore';
import { useUserStore } from '../../store/user';

const Step3 = () => {
  const { reservation } = useReservationStore();
  const navigate = useNavigate();
  const { name, address, point } = useUserStore();

  const handleReservationClick = async () => {
    if (reservation.price > point) {
      alert('결제 실패');
      return;
    } else {
      try {
        const res = await axios.post('http://localhost:3000/api/petsitter/reservation/add', reservation);
        if (res) {
          navigate('/petsitter/reservation/list');
        }
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="mt-5">
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
