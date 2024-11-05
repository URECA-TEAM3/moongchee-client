import React, { useEffect, useState } from 'react';
import DogChew from '../../components/DogChew';
import { Link, useNavigate } from 'react-router-dom';
import { CiCircleMinus, CiCirclePlus } from 'react-icons/ci';
import { AiOutlineMinus } from 'react-icons/ai';
import { GoInfo } from 'react-icons/go';
import PayInfo from '../../components/shop/PayInfo';
import API from '../../api/axiosInstance';
import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../firebase';
import { IoMdClose } from 'react-icons/io';
import { useUserStore } from '../../store/userStore';
import toast, { Toaster } from 'react-hot-toast';
import EmptyPage from '../../components/EmptyPage';

function ShoppingCart() {
  const navigate = useNavigate();
  const { id, getPoint } = useUserStore((state) => state);
  const [totalPrice, setTotalPrice] = useState();
  const [afterPayment, setAfterPayment] = useState();
  const [payment, setPayment] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [showItems, setShowItems] = useState(true);
  const [points, setPoints] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const getCartItemsList = async () => {
    setIsLoading(true);
    try {
      const response = await API.get(`/cart/${id}`);

      const productsWithImages = await Promise.all(
        response.data.data.map(async (product) => {
          try {
            const storageRef = ref(storage, product.image);
            const imageUrl = await getDownloadURL(storageRef);
            return {
              ...product,
              image: imageUrl,
            };
          } catch (error) {
            console.error('상품 이미지 로드 실패:', error);
            return product;
          }
        })
      );
      setCartItems(productsWithImages);
    } catch (error) {
      console.error();
    } finally {
      setIsLoading(false);
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
    getCartItemsList();
  }, [id]);

  // 최종 결제 금액 계산
  const calculateTotal = () => {
    return cartItems
      .filter((item) => item.checked) // 체크된 아이템만 필터링
      .reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // 체크박스 핸들러
  const handleCheckboxChange = (id) => {
    updateCartItem(id, 'checkbox');
  };

  // 수량 변경 핸들러
  const handleQuantityChange = (id, delta) => {
    updateCartItem(id, 'quantity', delta);
  };

  // 장바구니 아이템 업데이트 핸들러
  const updateCartItem = (id, updateType, delta = 0) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.map((item) => {
        if (item.cart_id === id) {
          if (updateType === 'checkbox') {
            return { ...item, checked: !item.checked };
          } else if (updateType === 'quantity') {
            return { ...item, quantity: Math.max(1, item.quantity + delta) };
          }
        }
        return item;
      });

      // 필요한 속성만 추출하여 로컬스토리지에 저장
      const storageData = updatedItems.map(({ cart_id, checked, quantity }) => ({ cart_id, checked, quantity }));
      localStorage.setItem('cart', JSON.stringify(storageData));

      return updatedItems;
    });
  };

  // 결제하기 btn
  const handleCheckout = async () => {
    await uploadLocalCart();
    console.log(cartItems);

    const hasCheckedItems = cartItems.some((item) => item.checked);
    if (!hasCheckedItems) {
      toast.error('구매할 상품을 선택해주세요');
    } else {
      navigate('/payment', { state: { cartItems } });
    }
  };

  // 장바구니 상품 삭제
  const handleDelete = async (id) => {
    try {
      const response = await API.delete(`/cart/${id}`);

      if (response.status === 200) {
        setCartItems((prevItems) => prevItems.filter((item) => item.cart_id !== id));
      }
    } catch (error) {
      console.error('삭제 오류:', error);
    }
  };

  // 업데이트된 결제 금액을 계산 후 상태 업데이트
  useEffect(() => {
    const total = calculateTotal();
    setTotalPrice(total);
    setAfterPayment(points - total);

    setPayment(points - total >= 0);
    setShowItems(cartItems.length > 0);
  }, [cartItems]);

  const uploadLocalCart = async () => {
    const cartToSend = JSON.parse(localStorage.getItem('cart')) || [];
    const user_id = id;

    await API.post(
      '/cart/save',
      { cartData: { cartToSend, user_id } },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  };

  useEffect(() => {
    // 페이지 떠날 때 로컬스토리지에 있는 데이터 서버로 넘김
    window.addEventListener('beforeunload', uploadLocalCart);

    return () => {
      window.removeEventListener('beforeunload', uploadLocalCart);
    };
  }, []);

  return (
    <div className="bg-white flex flex-col min-h-full">
      <Toaster />
      <div className="text-center px-10 py-6 font-bold">장바구니</div>

      {isLoading ? (
        <div className="flex justify-center items-center h-60">
          <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        // 장바구니 내용
        <div>
          {/* 장바구니 담긴 상품 조회 */}
          <div className="mb-5">
            <ul>
              {cartItems.map((item) => (
                <li key={item.cart_id} className="cart-item text-lg">
                  <div className="flex items-start w-full mx-auto py-5 px-10">
                    <input className="block mt-2 scale-125" type="checkbox" checked={item.checked} onChange={() => handleCheckboxChange(item.cart_id)} />
                    <div className="flex grow mr-2">
                      <img src={item.image} alt={item.name} className="mx-7 cart-item-image w-[150px]" />
                      <div className="flex flex-col">
                        <span className="my-1">{item.name}</span>
                        <span className="flex items-center mb-1">
                          <DogChew />
                          <div className="ml-2 font-bold">{item.price.toLocaleString()}개</div>
                        </span>
                        <div className="flex items-center">
                          <button onClick={() => handleQuantityChange(item.cart_id, -1)}>
                            <CiCircleMinus size={25} color={'#2589E7'} />
                          </button>
                          <span className="mx-2">{item.quantity}</span>
                          <button onClick={() => handleQuantityChange(item.cart_id, 1)}>
                            <CiCirclePlus size={25} color={'#2589E7'} />
                          </button>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => handleDelete(item.cart_id)}>
                      <IoMdClose className="mt-2" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* 결제 섹션 */}
          {showItems && !isLoading ? (
            <div className="grow flex flex-col justify-end">
              <PayInfo totalPrice={totalPrice} />

              {/* 결제 금액 및 포인트 확인 */}
              <div className="flex justify-between items-start pt-3 px-10">
                <div className="flex">
                  <span className="mr-2">나의 현재 </span> <DogChew />
                </div>
                {payment ? (
                  <div className="w-24 flex flex-col items-end gap-1">
                    <div>{points}개</div>
                    <div className="flex justify-between w-full pl-2">
                      <AiOutlineMinus />
                      <div>{totalPrice}개</div>
                    </div>
                    <div className="border border-text w-full" />
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-[red] text-sm mr-2">
                      잔액이 부족합니다.
                      <GoInfo className="ml-1" />
                    </div>
                    <div>{points - totalPrice}개</div>
                  </div>
                )}
              </div>

              {payment && (
                <div className="flex justify-between items-center pb-3 mt-[0.25rem] px-10">
                  <div className="flex">
                    <span className="mr-2">결제 후 </span> <DogChew />
                  </div>
                  <div className="font-bold">{afterPayment}개</div>
                </div>
              )}

              {payment ? (
                <div className="text-center my-5 px-10">
                  <button onClick={handleCheckout} className="w-full h-12 mb-5 py-2 bg-primary text-white rounded-lg">
                    결제하기
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center m-10">
                  <Link to="/chargepage" className="text-sm underline underline-offset-2">
                    지금 바로 충전하기
                  </Link>
                  <Link to="#" className="grow w-1/2 mt-2">
                    <div className="mx-auto bg-[#acacac] text-white p-3 mx-2 rounded-lg text-center">결제하기</div>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <EmptyPage message="장바구니가 비었습니다." buttonText="상품 구경하러가기" onButtonClick={() => navigate('/shoppingmall')} />
          )}
        </div>
      )}
    </div>
  );
}

export default ShoppingCart;
