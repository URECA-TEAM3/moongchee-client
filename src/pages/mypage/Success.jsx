import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import successImage from '../../assets/images/white-curve.png';
import axios from 'axios';
import { useUserStore } from '../../store/userStore';

export default function SuccessPage() {
  const { getPoint } = useUserStore((state) => state);
  const userData = sessionStorage.getItem('userData');
  const parsedData = userData ? JSON.parse(userData) : null;
  const [id, setId] = useState(parsedData.id);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // 쿼리 파라미터 값이 결제 요청할 때 보낸 데이터와 동일한지 반드시 확인하세요.
  // 클라이언트에서 결제 금액을 조작하는 행위를 방지할 수 있습니다.
  const requestData = {
    orderId: searchParams.get('orderId'),
    amount: searchParams.get('amount'),
    paymentKey: searchParams.get('paymentKey'),
  };

  async function confirm() {
    try {
      const response = await axios.post('http://localhost:3000/api/payments/confirm', requestData);

      if (response.status !== 200) {
        navigate(`/fail?message=${response.data.message}&code=${response.data.code}`);
        return;
      }

      approve();
    } catch (error) {
      if (error.response) {
        navigate(`/fail?message=${error.response.data.message}&code=${error.response.data.code}`);
      } else {
        console.error('Request error:', error);
      }
    }
  }

  async function approve() {
    //결제 성공 로직 - 포인트 추가 & add to payment-approved table
    try {
      const response = await axios.post('http://localhost:3000/api/members/update-points', {
        userId: id,
        amount: requestData.amount,
      });

      console.log('Updated points successfully:', response);
      addToPaymentApprovedTable(requestData.orderId, requestData.amount, requestData.paymentKey);
    } catch (error) {
      if (error.response) {
        console.error('Error updating points:', error.response.data.message || error.message);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error in setup:', error.message);
      }
    }
  }

  const addToPaymentApprovedTable = (orderId, amount, paymentKey) => {
    try {
      const response = axios.post('http://localhost:3000/api/payments/approve', {
        orderId,
        amount,
        paymentKey,
      });
      console.log('Payment completed / approved:', response);
    } catch (error) {
      console.log('Error handling payment_approved table:', error.message);
    }
  };

  useEffect(() => {
    confirm();
  }, []);

  return (
    <div className="flex flex-col justify-start items-center h-full bg-white pt-12">
      <img src={successImage} alt="회원가입 성공" className="w-[300px] h-[300px] mb-3" />
      <h2 className="text-lg font-bold text-gray-800">결제 완료</h2>
      <button onClick={() => navigate(`/mypage`)} className="mt-6 py-2 px-4 bg-primary text-white rounded-lg hover:bg-blue-600 focus:outline-none">
        마이페이지로 돌아가기
      </button>
    </div>
  );
}
