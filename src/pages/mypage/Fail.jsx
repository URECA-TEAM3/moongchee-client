import { useSearchParams } from 'react-router-dom';

export default function FailPage() {
  const [searchParams] = useSearchParams();
  const errorCode = searchParams.get('code');
  const errorMessage = searchParams.get('message');

  return (
    <div className="w-full h-full bg-white p-5 text-center">
      <div className="">
        <img src="https://static.toss.im/lotties/error-spot-apng.png" width="120" height="120" className="ml-auto mr-auto" />
        <h2 className="mb-5 text-alert">결제를 실패했어요</h2>
        <div className="response-section w-100 mb-5">
          <div>
            <span className="response-label font-bold">code: </span>
            <span id="error-code" className="response-text">
              {errorCode}
            </span>
          </div>
          <div>
            <span className="response-label font-bold">message: </span>
            <span id="error-message" className="response-text">
              {errorMessage}
            </span>
          </div>
        </div>

        <div className="flex flex-col w-100 button-group ">
          <a className="btn w-100 hover:text-primary" href="https://docs.tosspayments.com/reference/error-codes" target="_blank" rel="noreferrer noopener">
            에러코드 문서보기
          </a>
          <a className="btn w-100 hover:text-primary" href="https://techchat.tosspayments.com" target="_blank" rel="noreferrer noopener">
            실시간 문의하기
          </a>
        </div>
      </div>
    </div>
  );
}
