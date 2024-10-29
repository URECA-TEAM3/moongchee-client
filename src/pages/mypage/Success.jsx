import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import successImage from '../../assets/images/white-curve.png';
import axios from 'axios';

export default function SuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // 쿼리 파라미터 값이 결제 요청할 때 보낸 데이터와 동일한지 반드시 확인하세요.
    // 클라이언트에서 결제 금액을 조작하는 행위를 방지할 수 있습니다.
    const requestData = {
      orderId: searchParams.get('orderId'),
      amount: searchParams.get('amount'),
      paymentKey: searchParams.get('paymentKey'),
    };

    async function confirm() {
      const response = await fetch('http://localhost:3000/api/payment/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const json = await response.json();

      if (!response.ok) {
        // 결제 실패 비즈니스 로직을 구현하세요.
        console.log(json);
        navigate(`/fail?message=${json.message}&code=${json.code}`);
        return;
      }

      // 결제 성공 비즈니스 로직을 구현하세요.
      console.log(json);
    }
    confirm();
  }, []);

  return (
    <div className="flex flex-col justify-start items-center min-h-screen bg-white pt-12">
      <img src={successImage} alt="회원가입 성공" className="w-[300px] h-[300px] mb-3" />
      <h2 className="text-lg font-bold text-gray-800">결제 완료</h2>
      <button onClick={() => navigate(`/mypage`)} className="mt-6 py-2 px-4 bg-primary text-white rounded-lg hover:bg-blue-600 focus:outline-none">
        마이페이지로 돌아가기
      </button>
    </div>
  );
}
