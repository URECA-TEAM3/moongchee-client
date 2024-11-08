import { loadTossPayments } from '@tosspayments/tosspayments-sdk';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { generateRandomString } from '../../utils/productHelper';
import { requestPayments } from '../../api/payment';

// TODO: 구매자의 고유 아이디를 불러와서 customerKey로 설정하세요. 이메일・전화번호와 같이 유추가 가능한 값은 안전하지 않습니다.
const clientKey = 'test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm';
const customerKey = generateRandomString();

export default function CheckoutPage() {
  const userData = sessionStorage.getItem('userData');
  const parsedData = userData ? JSON.parse(userData) : null;
  const [id, setId] = useState(parsedData.id);
  const [name, setname] = useState(parsedData.name);
  const [phone, setPhone] = useState(parsedData.phone);
  const [email, setEmail] = useState(parsedData.email);
  const [searchParams] = useSearchParams();
  const [amount, setAmount] = useState({
    currency: 'KRW',
    value: Number(searchParams.get('price')) || 0,
  });
  const [ready, setReady] = useState(false);
  const [widgets, setWidgets] = useState(null);

  useEffect(() => {
    async function fetchPaymentWidgets() {
      try {
        // ------  SDK 초기화 ------
        const tossPayments = await loadTossPayments(clientKey);

        // 회원 결제
        const widgets = tossPayments.widgets({
          customerKey,
        });

        setWidgets(widgets);
      } catch (error) {
        console.error('Error fetching payment widget:', error);
      }
    }

    fetchPaymentWidgets();
  }, [clientKey, customerKey]);

  useEffect(() => {
    async function renderPaymentWidgets() {
      if (widgets == null) {
        return;
      }

      // ------  주문서의 결제 금액 설정 ------
      await widgets.setAmount(amount);

      // ------  결제 UI 렌더링 ------
      await widgets.renderPaymentMethods({
        selector: '#payment-method',
        variantKey: 'DEFAULT',
      });

      // ------  이용약관 UI 렌더링 ------
      await widgets.renderAgreement({
        selector: '#agreement',
        variantKey: 'AGREEMENT',
      });

      setReady(true);
    }

    renderPaymentWidgets();
  }, [widgets]);

  return (
    <div className="wrapper text-center m-auto bg-white h-full">
      <div className="box_section bg-white p-5">
        {/* 결제 UI */}
        <div id="payment-method" />
        {/* 이용약관 UI */}
        <div id="agreement" />

        {/* 결제하기 버튼 */}
        <button
          className="button h-12 w-[70%] bg-primary text-white text-lg rounded-lg"
          style={{ marginTop: '30px' }}
          disabled={!ready}
          onClick={async () => {
            try {
              const orderId = generateRandomString();
              const response = requestPayments(orderId, id, amount.value);

              await widgets.requestPayment({
                orderId: orderId,
                orderName: '뭉치 포인트 충전',
                successUrl: window.location.origin + '/success',
                failUrl: window.location.origin + '/fail',
                customerEmail: email,
                customerName: name,
                customerMobilePhone: phone,
              });
            } catch (error) {
              console.error(error);
            }
          }}
        >
          결제하기
        </button>
      </div>
    </div>
  );
}
