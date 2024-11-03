import { ChevronDownIcon, ChevronLeftIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DogChew from '../../components/DogChew';
import API from '../../api/axiosInstance';
import Modal from '../../components/Modal';

const ShopHistory = () => {
  const userData = sessionStorage.getItem('userData');
  const parsedData = userData ? JSON.parse(userData) : null;
  const [id, setId] = useState(parsedData.id);
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cancelPrice, setCancelPrice] = useState(0);
  const [orderHistory, setOrderHistory] = useState([]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Fetch order_item
  useEffect(() => {
    const OrderHistory = async () => {
      try {
        const response = await API.get(`/cart/order/${id}`);
        console.log(response.data.data);

        // Grouping data by date
        const groupedData = response.data.reduce((acc, order) => {
          const date = order.order_date;
          if (!acc[date]) {
            acc[date] = [];
          }
          acc[date].push(order);
          return acc;
        }, {});
        setOrderHistory(groupedData);
      } catch (error) {
        console.error(error);
      }
    };

    if (id) {
      OrderHistory();
    }
  }, [id]);

  const refundPoint = async () => {
    try {
      const response = await API.post('members/update-points', {
        userId: id,
        amount: cancelPrice,
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

  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      <div>
        <div className="relative w-full flex items-center mb-4 mt-6">
          <button onClick={() => navigate('/mypage')} className="absolute left-0 ml-1">
            <ChevronLeftIcon className="h-6 w-6 ml-5" />
          </button>
          <h1 className="mx-auto font-bold ">구매 / 취소 내역</h1>
        </div>
      </div>

      <div className="pt-3 pb-7 pl-10 pr-10">
        {Object.keys(orderHistory).map((date) => (
          <div key={date} className="w-full bg-white rounded-lg p-5 shadow mb-5">
            <div className="flex justify-between items-center">
              <div className="text-lg font-bold mb-1">{date}</div>
              <button onClick={toggleExpand}>
                {isExpanded ? (
                  <ChevronUpIcon className="h-6 w-6" stroke="black" />
                ) : (
                  <ChevronDownIcon className="h-6 w-6" stroke="black" />
                )}
              </button>
            </div>
            {isExpanded &&
              orderHistory[date].map((item) => (
                <div key={item.id} className="flex items-center justify-between mt-4">
                  <div className="flex items-center">
                    <img src="/src/assets/images/dog.jpeg" className="w-20 h-20 rounded-lg" alt="Product" />
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
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={<div className="font-bold">주문을 취소하시겠습니까?</div>}>
        <div className="my-10 flex justify-center">
          <span className="">주문 취소시 포인트가 다시 적립됩니다.</span>
        </div>
        <div className="flex gap-4 mt-3">
          <button onClick={closeModal} className="px-10 py-2 w-full bg-divider text-gray-500 rounded-lg">
            아니요
          </button>
          <button onClick={refundPoint} className="px-8 py-2 w-full bg-delete text-white rounded-lg">
            주문 취소
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ShopHistory;
