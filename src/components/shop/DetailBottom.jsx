import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BottomSheet from '../BottomSheet';
import API from '../../api/axiosInstance';
import { useUserStore } from '../../store/userStore';

const DetailBottom = ({ product }) => {
  const navigate = useNavigate();
  const { id, getPoint } = useUserStore((state) => state);
  const [isVisible, setIsVisible] = useState(false);
  const [disabledBtn, setDisabledBtn] = useState(false);
  const [productItem, setProductItem] = useState(product);
  const [price, setPrice] = useState({
    ProductTotal: 0,
    UserTotal: 0,
  });

  const [buyNowData, setBuyNowData] = useState({
    product_id: '',
    name: '',
    image: '',
    price: 0,
    quantity: 1,
    checked: true,
  });
  const toggleBottomSheet = () => {
    setIsVisible(!isVisible);
    getPoint(id);
  };

  const handleNavigate = async (quantity) => {
    try {
      await API.post('/cart', {
        product_id: product.id,
        user_id: id,
        quantity: quantity,
        checked: true,
      });

      navigate('/shoppingcart');
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
            {!disabledBtn ? (
              <div className="flex grow">
                <button className="grow" onClick={() => navigate('/payment', { state: { buyNowData } })}>
                  <div className="bg-primary text-white p-3 mx-2 rounded-xl text-center">결제하기</div>
                </button>
              </div>
            ) : (
              <div className="flex grow">
                <button className="grow" onClick={() => navigate('/chargepage')}>
                  <div className="bg-divider text-[gray] p-3 mx-2 rounded-xl text-center">포인트 충전하러 가기</div>
                </button>
              </div>
            )}
          </>
        ) : (
          // 기본 바텀바
          <div className="flex grow">
            <button className="grow" onClick={() => handleNavigate(1)}>
              <div className={`p-3 mx-2 text-primary rounded-2xl text-center border border-primary`}>장바구니에 담기</div>
            </button>
            <button onClick={toggleBottomSheet} className="grow">
              <div className="bg-primary text-white p-3 mx-2 rounded-xl text-center">바로 구매하기</div>
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default DetailBottom;
