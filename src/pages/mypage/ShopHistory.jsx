// ShopHistory.jsx
import { ChevronDownIcon, ChevronLeftIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DogChew from '../../components/DogChew';
import API from '../../api/axiosInstance';
import Modal from '../../components/Modal';
import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../firebase';
import EmptyPage from '../../components/EmptyPage';
import Spinner from '../../components/Spinner';

const ShopHistory = () => {
  const userData = sessionStorage.getItem('userData');
  const parsedData = userData ? JSON.parse(userData) : null;
  const [id, setId] = useState(parsedData?.id || null);
  const [expandedCards, setExpandedCards] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cancelPrice, setCancelPrice] = useState(0);
  const [cancelId, setCancelId] = useState(0);
  const [orderHistory, setOrderHistory] = useState([]);
  const [productMap, setProductMap] = useState({});
  const [loading, setLoading] = useState(true); // 로딩 상태 추가
  const navigate = useNavigate();

  // Fetch order_item
  useEffect(() => {
    const OrderHistory = async () => {
      setLoading(true);
      try {
        const response = await API.get(`/cart/order/${id}`);
        const orderData = response.data.data;

        const groupedData = orderData.reduce((acc, order) => {
          const orderId = order.order_id;
          if (!acc[orderId]) {
            acc[orderId] = [];
          }
          acc[orderId].push(order);
          return acc;
        }, {});
        setOrderHistory(groupedData);

        const productIds = [...new Set(orderData.map((order) => order.product_id))];

        if (productIds.length > 0) {
          const productResponse = await API.post('/products/getByIds', { ids: productIds });
          const products = productResponse.data.data;

          const productMap = products.reduce((map, product) => {
            map[product.id] = { name: product.name, image: product.image };
            return map;
          }, {});

          for (const product of products) {
            const storageRef = ref(storage, product.image);
            const imageUrl = await getDownloadURL(storageRef);
            productMap[product.id] = { name: product.name, image: imageUrl };
          }

          setProductMap(productMap);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      OrderHistory();
    }
  }, [id]);

  const toggleExpand = (orderId) => {
    setExpandedCards((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const refundPoint = async () => {
    try {
      await API.post('members/update-points', {
        userId: id,
        amount: cancelPrice,
      });

      await API.put('/cart/refund-product', {
        orderItemId: cancelId,
        status: 'refund',
      });
      setIsModalOpen(false);
      navigate(0);
    } catch (error) {
      console.error('Error updating points:', error.message);
    }
  };

  const closeModal = () => setIsModalOpen(false);

  if (loading) {
    return <Spinner />;
  }

  if (Object.keys(orderHistory).length === 0) {
    return (
      <div className="bg-white flex flex-col min-h-full">
        <div className="relative w-full flex items-center mb-4 mt-6">
          <button onClick={() => navigate('/mypage')} className="absolute left-0 ml-1">
            <ChevronLeftIcon className="h-6 w-6 ml-5" />
          </button>
          <h1 className="mx-auto font-bold ">구매 / 취소 내역</h1>
        </div>
        <div className="my-auto">
          <EmptyPage message="구매 내역이 없습니다." buttonText="상품 구경하러가기" onButtonClick={() => navigate('/shoppingmall')} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="relative w-full flex items-center mb-4 mt-6">
        <button onClick={() => navigate('/mypage')} className="absolute left-0 ml-1">
          <ChevronLeftIcon className="h-6 w-6 ml-5" />
        </button>
        <h1 className="mx-auto font-bold ">구매 / 취소 내역</h1>
      </div>

      <div className="pt-3 pb-7 pl-10 pr-10">
        {Object.keys(orderHistory).map((orderId) => (
          <div key={orderId} className="w-full bg-white rounded-lg p-5 shadow mb-5">
            <div className="flex justify-between items-center">
              <div className="text-lg font-bold">{new Date(orderHistory[orderId][0].order_date).toLocaleDateString('ko-KR')}</div>
              {orderHistory[orderId].length > 1 && (
                <button onClick={() => toggleExpand(orderId)}>
                  {expandedCards[orderId] ? <ChevronUpIcon className="h-6 w-6" stroke="black" /> : <ChevronDownIcon className="h-6 w-6" stroke="black" />}
                </button>
              )}
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center">
                {productMap[orderHistory[orderId][0].product_id] && (
                  <img src={productMap[orderHistory[orderId][0].product_id].image} className="w-20 h-20 rounded-lg object-cover flex-shrink-0" alt="Product" />
                )}
                <div className="p-2 pl-4">
                  <div className="flex">
                    {orderHistory[orderId].length > 1 ? (
                      <p className="mb-1">
                        {productMap[orderHistory[orderId][0].product_id]?.name}
                        {!expandedCards[orderId] && <span className="pl-1 text-primary">외 {orderHistory[orderId].length - 1}개</span>}
                      </p>
                    ) : (
                      <p className="mb-1">{productMap[orderHistory[orderId][0].product_id]?.name}</p>
                    )}
                  </div>
                  {(orderHistory[orderId].length === 1 || expandedCards[orderId]) && <p className="mb-1">수량: {orderHistory[orderId][0].quantity}개</p>}
                  <div className="flex">
                    <DogChew />
                    <div className="flex items-center">
                      <p className="ml-2 mb-1 font-bold">{orderHistory[orderId][0].price}개</p>
                      {(orderHistory[orderId].length === 1 || expandedCards[orderId]) &&
                        (orderHistory[orderId][0].status === 'paid' ? (
                          <p className="text-primary ml-2 mb-1 text-sm"> 결제완료</p>
                        ) : (
                          <p className="text-alert ml-2 mb-1 text-sm"> 환불완료</p>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
              {orderHistory[orderId][0].status === 'paid' && (expandedCards[orderId] || orderHistory[orderId].length === 1) && (
                <button
                  onClick={() => {
                    setIsModalOpen(true);
                    setCancelPrice(orderHistory[orderId][0].price);
                    setCancelId(orderHistory[orderId][0].id);
                  }}
                  className="border border-primary text-primary text-sm rounded-lg w-16 h-7 hover:bg-primary hover:text-white"
                >
                  취소
                </button>
              )}
            </div>

            {expandedCards[orderId] &&
              orderHistory[orderId].slice(1).map((item) => (
                <div key={item.id} className="flex items-center justify-between mt-4">
                  <div className="flex items-center">
                    <img src={productMap[item.product_id].image} className="w-20 h-20 rounded-lg object-cover flex-shrink-0" alt="Product" />
                    <div className="p-2 pl-4">
                      <p className="mb-1">{productMap[item.product_id]?.name}</p>
                      <p className="mb-1">수량: {item.quantity}개</p>
                      <div className="flex">
                        <DogChew />
                        <div className="flex items-center">
                          <p className="ml-2 mb-1 font-bold">{item.price}개</p>
                          {item.status === 'paid' ? (
                            <p className="text-primary ml-2 mb-1 text-sm"> 결제완료</p>
                          ) : (
                            <p className="text-alert ml-2 mb-1 text-sm"> 환불완료</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  {item.status === 'paid' && (
                    <button
                      onClick={() => {
                        setIsModalOpen(true);
                        setCancelPrice(item.price);
                        setCancelId(item.id);
                      }}
                      className="border border-primary text-primary text-sm rounded-lg w-16 h-7 hover:bg-primary hover:text-white"
                    >
                      취소
                    </button>
                  )}
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
