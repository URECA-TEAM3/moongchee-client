import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BottomSheet from '../BottomSheet';
import API from '../../api/axiosInstance';
import { useUserStore } from '../../store/userStore';
import Modal from '../../components/Modal';

const DetailBottom = ({ product }) => {
  const navigate = useNavigate();
  const { getPoint, id } = useUserStore((state) => state);
  const [points, setPoints] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [disabledBtn, setDisabledBtn] = useState(false);
  const [productItem, setProductItem] = useState(product);
  const [price, setPrice] = useState({
    ProductTotal: 0,
    UserTotal: 0,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => {
    setIsModalOpen(true);
    handleNavigate(1);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const [buyNowData, setBuyNowData] = useState({
    product_id: '',
    name: '',
    image: '',
    price: 0,
    quantity: 1,
    checked: true,
  });

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const userPoints = await getPoint(id); // getPoint 함수 호출
        setPoints(userPoints);
      } catch (error) {
        console.error('Error fetching points:', error); // 에러 처리
      }
    };

    fetchPoints();
  }, [id]); // 의존성 배열에 id 추가

  const toggleBottomSheet = () => {
    setIsVisible(!isVisible);
    if (points - productItem.price * productItem.quantity < 0) {
      setDisabledBtn(true);
    } else {
      setDisabledBtn(false);
    }
  };

  const handleNavigate = async (quantity) => {
    try {
      await API.post('/cart', {
        product_id: product.id,
        user_id: id,
        quantity: quantity,
        checked: true,
      });
    } catch (error) {
      console.error('Error adding product to cart:', error);
      alert('There was an error adding the product to the cart.');
    }
  };

  useEffect(() => {
    if (product && Object.keys(product).length > 0) {
      setProductItem(product);
      setProductItem((prevItem) => ({
        ...prevItem,
        quantity: 1,
      }));

      setBuyNowData((prevData) => ({
        ...prevData,
        product_id: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        total: product.price * product.quantity, // 초기 전체 금액 설정
      }));
    }
  }, [product]);

  return (
    <>
      {/* 바로 구매하기 > 바텀시트 */}
      <div className="fixed bottom-0 flex items-center justify-between w-[600px] bg-white ">
        {isVisible && (
          <BottomSheet
            points={points}
            setBuyNowData={setBuyNowData}
            price={price}
            setPrice={setPrice}
            setDisabledBtn={setDisabledBtn}
            toggleBottomSheet={toggleBottomSheet}
            setProductItem={setProductItem}
            productItem={productItem}
            setIsVisible={setIsVisible}
          />
        )}
      </div>

      {/* 기본 바텀바 */}
      <div className="fixed bottom-0 flex items-center justify-between w-[600px] bg-white z-20">
        <Link to="/shoppingcart">
          <div className="p-3 flex flex-col justify-center items-center">
            <img className="w-8 mb-1" src="/src/assets/images/shoppingCart_gray.svg" alt="" />
            <span className="text-xs">장바구니</span>
          </div>
        </Link>

        {isVisible ? (
          <>
            {disabledBtn ? (
              <div className="flex grow">
                <button className="grow" onClick={() => navigate('/ChargePage')}>
                  <div className="bg-divider text-[gray] p-3 mx-2 rounded-xl text-center">포인트 충전하러 가기</div>
                </button>
              </div>
            ) : (
              <div className="flex grow">
                <button className="grow" onClick={() => navigate('/payment', { state: { buyNowData } })}>
                  <div className="bg-primary text-white p-3 mx-2 rounded-xl text-center">결제하기</div>
                </button>
              </div>
            )}
          </>
        ) : (
          // 기본 바텀바
          <div className="flex grow">
            <button className="grow" onClick={openModal}>
              <div className={`p-3 mx-2 text-primary rounded-2xl text-center border border-primary`}>장바구니에 담기</div>
            </button>
            <button onClick={toggleBottomSheet} className="grow">
              <div className="bg-primary text-white p-3 mx-2 rounded-xl text-center">바로 구매하기</div>
            </button>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={'장바구니'}>
        <div className="my-10 flex justify-center">
          <span className="font-bold text-lg">상품이 장바구니에 담겼습니다.</span>
        </div>
        <div className="flex gap-4 mt-3">
          <button className="text-white bg-divider px-4 py-2 rounded-lg font-normal w-full" onClick={() => closeModal()}>
            계속 쇼핑하기
          </button>
          <button onClick={() => navigate('/shoppingcart')} className="text-white bg-primary px-4 py-2 rounded-lg font-normal w-full">
            장바구니 이동
          </button>
        </div>
      </Modal>
    </>
  );
};

export default DetailBottom;
