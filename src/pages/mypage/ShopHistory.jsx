import { ChevronDownIcon, ChevronLeftIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DogChew from '../../components/DogChew';
import axios from 'axios';

const ShopHistory = () => {
  const userData = sessionStorage.getItem('userData');
  const parsedData = userData ? JSON.parse(userData) : null;
  const [id, setId] = useState(parsedData.id);
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cancelPrice, setCancelPrice] = useState(0);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // 구매 내역 데이터 (예시)
  const items = [
    { id: 1, name: '순우리 국산 개껌 (4개입)', quantity: 1, price: 50 },
    { id: 2, name: '슈퍼포우 오메가3 120ml', quantity: 1, price: 50 },
    { id: 3, name: '순우리 국산 개껌 (4개입)', quantity: 1, price: 50 },
  ];

  const refundPoint = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/members/update-points', {
        userId: id,
        amount: cancelPrice, //neg value
      });

      console.log('Updated points successfully:', response);
      setIsModalOpen(false);
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

  return (
    <div>
      <div>
        <div className="relative w-full flex items-center mb-4 mt-6">
          <button onClick={() => navigate('/mypage')} className="absolute left-0 ml-1">
            <ChevronLeftIcon className="h-6 w-6 ml-5" />
          </button>
          <h1 className="mx-auto text-lg font-bold ">구매 / 취소 내역</h1>
        </div>
      </div>

      <div className="pt-3 pb-7 pl-10 pr-10">
        <div className="w-full bg-white rounded-lg p-5 shadow mb-5 flex justify-between items-center">
          <div className="w-full flex flex-col justify-between">
            <div className="flex w-full justify-between items-center">
              <div className="flex items-center">
                <span className="text-lg font-bold mb-1">2024.09.18</span>
              </div>
              <div>
                <button onClick={toggleExpand}>
                  {isExpanded ? (
                    <div className="flex">
                      <span className="mr-1">순우리 국산 개껌 (4개입)</span>
                      <span className="text-primary mr-1"> 외 2개</span>
                      <ChevronUpIcon className="h-6 w-6" stroke="black" />
                    </div>
                  ) : (
                    <ChevronDownIcon className="h-6 w-6" stroke="black" />
                  )}
                </button>
              </div>
            </div>
            {!isExpanded && (
              <div className="flex mt-2">
                <img src="/src/assets/images/dog.jpeg" className="w-20 h-20 rounded-lg" />
                <div className="p-4">
                  <span>순우리 국산 개껌 (4개입)</span>
                  <span className="text-primary"> 외 2개</span>
                  <div className="p-1 flex">
                    <DogChew />
                    <p className="ml-2 font-bold">150개</p>
                  </div>
                </div>
              </div>
            )}

            {/* History detail */}
            {isExpanded && (
              <div>
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img src="/src/assets/images/dog.jpeg" className="w-20 h-20 rounded-lg" />
                      <div className="p-4">
                        <p>{item.name}</p>
                        <p>수량 : {item.quantity}개</p>
                        <div className="flex">
                          <DogChew />
                          <p className="ml-2 font-bold">{item.price}개</p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setIsModalOpen(true);
                        setCancelPrice(item.price);
                      }}
                      className="border border-primary text-primary text-sm rounded-lg w-16 h-7 hover:bg-primary hover:text-white"
                    >
                      취소
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg text-center w-80 h-auto p-6">
            <h2 className="text-base font-extrabold mb-6">주문을 취소하시겠습니까?</h2>
            <h3 className="text m-10 p-2">주문 취소시 포인트가 다시 적립됩니다.</h3>
            <div className="flex justify-center space-x-4">
              <button onClick={() => setIsModalOpen(false)} className="px-10 py-2 bg-divider text-gray-500 rounded-lg">
                아니요
              </button>
              <button onClick={refundPoint} className="px-8 py-2 bg-delete text-white rounded-lg">
                주문 취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopHistory;
