import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';
import PayInfo from '../../components/shop/PayInfo';
import DogChew from '../../components/DogChew';
import API from '../../api/axiosInstance';
import Modal from '../../components/Modal';

const Pay = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
    console.log('모달 오픈');
  };

  const closeModal = () => setIsModalOpen(false);

  const navigate = useNavigate();
  const location = useLocation();
  const [selectedItems, setSelectItems] = useState([]);
  const [orderData, setOrderData] = useState({
    userId: 1,
    status: 'paid',
    total: 0,
    productData: [],
  });

  const confirmOrder = async () => {
    try {
      const response = await API.post('/api/cart/pay', orderData);
      console.log(response);
      navigate('/main');
    } catch (error) {
      console.error();
    }
  };

  useEffect(() => {
    const cartItems = location.state.cartItems || {};
    const filteredItems = cartItems.filter((item) => item.checked);
    setSelectItems(filteredItems);
    setOrderData((prev) => ({
      ...prev,
      total: filteredItems.reduce((acc, item) => acc + item.quantity * item.price, 0),
      productData: filteredItems.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
      })),
    }));
  }, []);

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
          <div>
            <div>
              <span className="text-[#9c9c9c]">이름 :</span> 홍길동
            </div>
            <div>
              <span className="text-[#9c9c9c]">전화번호 :</span> 010-2937-2333
            </div>
            <div>
              <span className="text-[#9c9c9c]">주소 :</span> 울산광역시 북구 연암동
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
            <li key={item.cart_id} className="cart-item text-lg">
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
          <button onClick={openModal} className="w-6/12 mx-auto bg-primary my-10 text-white p-3 mx-2 rounded-xl text-center">
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
