import { loadTossPayments } from '@tosspayments/tosspayments-sdk';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

// TODO: 구매자의 고유 아이디를 불러와서 customerKey로 설정하세요. 이메일・전화번호와 같이 유추가 가능한 값은 안전하지 않습니다.
// @docs https://docs.tosspayments.com/sdk/v2/js#토스페이먼츠-초기화
const clientKey = 'test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm';
const customerKey = generateRandomString();

export default function CheckoutPage() {
  const [id, setId] = useState(0);
  const [searchParams] = useSearchParams();
  const [amount, setAmount] = useState({
    currency: 'KRW',
    value: Number(searchParams.get('price')) || 0,
  });
  const [ready, setReady] = useState(false);
  const [widgets, setWidgets] = useState(null);

  useEffect(() => {
    const userData = sessionStorage.getItem('userData');
    if (userData) {
      const parsedData = JSON.parse(userData); // JSON 파싱
      setId(parsedData.id);
      console.log(id);
    }
  }, []);

  useEffect(() => {
    async function fetchPaymentWidgets() {
      try {
        // ------  SDK 초기화 ------
        // @docs https://docs.tosspayments.com/sdk/v2/js#토스페이먼츠-초기화
        const tossPayments = await loadTossPayments(clientKey);

        // 회원 결제
        // @docs https://docs.tosspayments.com/sdk/v2/js#tosspaymentswidgets
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
      // TODO: 위젯의 결제금액을 결제하려는 금액으로 초기화하세요.
      // TODO: renderPaymentMethods, renderAgreement, requestPayment 보다 반드시 선행되어야 합니다.
      await widgets.setAmount(amount);
      // setId(1);

      // ------  결제 UI 렌더링 ------
      // @docs https://docs.tosspayments.com/sdk/v2/js#widgetsrenderpaymentmethods
      await widgets.renderPaymentMethods({
        selector: '#payment-method',
        // 렌더링하고 싶은 결제 UI의 variantKey
        // 결제 수단 및 스타일이 다른 멀티 UI를 직접 만들고 싶다면 계약이 필요해요.
        // @docs https://docs.tosspayments.com/guides/v2/payment-widget/admin#새로운-결제-ui-추가하기
        variantKey: 'DEFAULT',
      });

      // ------  이용약관 UI 렌더링 ------
      // @docs https://docs.tosspayments.com/reference/widget-sdk#renderagreement선택자-옵션
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
          // ------ '결제하기' 버튼 누르면 결제창 띄우기 ------
          // @docs https://docs.tosspayments.com/sdk/v2/js#widgetsrequestpayment
          onClick={async () => {
            try {
              // 결제를 요청하기 전에 orderId, amount를 서버에 저장하세요.
              // 결제 과정에서 악의적으로 결제 금액이 바뀌는 것을 확인하는 용도입니다.
              const orderId = generateRandomString();

              const response = await axios.post('http://localhost:3000/api/payment', {
                orderId,
                userId: id,
                amount: amount.value,
              });

              await widgets.requestPayment({
                orderId: orderId,
                orderName: '뭉치 쇼핑몰 결제',
                successUrl: window.location.origin + '/success',
                failUrl: window.location.origin + '/fail',
                customerEmail: 'customer123@gmail.com',
                customerName: '뭉치',
                customerMobilePhone: '01012341234',
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

function generateRandomString() {
  return window.btoa(Math.random().toString()).slice(0, 20);
}
