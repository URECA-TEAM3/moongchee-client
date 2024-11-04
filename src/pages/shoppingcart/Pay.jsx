import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';
import PayInfo from '../../components/shop/PayInfo';
import DogChew from '../../components/DogChew';
import API from '../../api/axiosInstance';
import Modal from '../../components/Modal';
import { useUserStore } from '../../store/userStore';

const Pay = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { id, name, phone, address, detailaddress } = useUserStore((state) => state);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const navigate = useNavigate();
  const location = useLocation();
  const [selectedItems, setSelectItems] = useState([]);
  const [orderData, setOrderData] = useState({
    userId: id,
    total: 0,
    productData: [],
    status: 'paid',
  });

  const confirmOrder = async () => {
    try {
      const currentDate = new Date().toISOString().split('T')[0];
      const updatedOrderData = {
        ...orderData,
        date: currentDate,
      };

      const response = await API.post('/cart/pay', updatedOrderData);
      navigate(`/mypage/shophistory/${id}`, { state: { pay: 'done', payId: id } });
    } catch (error) {
      console.error();
    }
  };

  useEffect(() => {
    const cartItems = location.state.cartItems || '';
    const buyNowItems = location.state.buyNowData || '';

    if (Boolean(cartItems)) {
      const filteredItems = cartItems.filter((item) => item.checked);
      setSelectItems(filteredItems);
    } else if (Boolean(buyNowItems)) {
      setSelectItems([buyNowItems]);
    }
  }, []);

  useEffect(() => {
    // selectedItems가 변경될 때마다 orderData 업데이트
    setOrderData((prev) => ({
      ...prev,
      total: selectedItems.reduce((acc, item) => acc + item.quantity * item.price, 0),
      productData: selectedItems.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
      })),
    }));
  }, [selectedItems]);

  return (
    <div className="bg-white flex flex-col min-h-full">
      {/* header */}
      <div className="flex items-center justify-between p-5 border border-b-divider">
        <button onClick={() => navigate('/shoppingcart')}>
          <IoIosArrowBack />
        </button>
        <div>결제하기</div>
        <div></div>
      </div>

      {/* 배송지 정보 */}
      <div className="px-10 border border-b-divider py-8">
        <h1 className="font-bold text-lg">배송지 정보</h1>
        <div className="flex justify-between items-start">
          <div className="w-9/12 break-keep">
            <div>
              <span className="text-[#9c9c9c]">이름 : </span>
              {name}
            </div>
            <div>
              <span className="text-[#9c9c9c]">전화번호 : </span>
              {phone}
            </div>
            <div>
              <span className="text-[#9c9c9c]">주소 : </span>
              {address}
              <span className="ml-2">{detailaddress}</span>
            </div>
          </div>
          <div>
            <button onClick={() => navigate('/changeAddress')} className="text-primary border border-primary px-4 py-1 rounded-lg">
              배송지 변경
            </button>
          </div>
        </div>
      </div>

      {/* 결제할 상품 */}
      <div className="mb-10">
        <ul>
          {selectedItems.map((item) => (
            <li key={item.cart_id || item.product_id} className="cart-item text-lg">
              <div className="flex items-start border-b-[1px] border-divider  w-full mx-auto py-5 px-10">
                <div className="flex grow">
                  <img src={item.image} alt={item.name} className="mr-7 cart-item-image w-[150px]" />
                  <div className="flex flex-col">
                    <span className="my-1">{item.name}</span>
                    <span className="flex items-center mb-1">
                      <DogChew />
                      <div className="ml-2 font-bold">{item.price.toLocaleString()}개</div>
                    </span>
                    <div className="flex items-center">
                      수량 : <span className="mx-2">{item.quantity}</span>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* 결제 금액 */}
      <div className="grow flex flex-col justify-end">
        <PayInfo totalPrice={orderData.total} />

        <div className="text-center">
          <button onClick={openModal} className="w-1/2 mx-auto bg-primary my-10 text-white p-3 mx-2 rounded-xl text-center">
            결제하기
          </button>
        </div>

        <Modal isOpen={isModalOpen} onClose={closeModal} title={'결제하기'}>
          <div className="my-10 flex justify-center">
            <span className="font-bold text-lg">결제하시겠습니까?</span>
          </div>
          <div className="flex gap-4 mt-3">
            <button className="text-white bg-divider px-4 py-2 rounded-lg font-normal w-full" onClick={closeModal}>
              취소
            </button>
            <button onClick={confirmOrder} className="text-white bg-primary px-4 py-2 rounded-lg font-normal w-full">
              확인
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Pay;
