import React, { useEffect, useState } from 'react';

const Step2 = ({ handleNextStep }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  useEffect(() => {
    const element = document.getElementById('step2-top');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return (
    <div id="step2-top" className="flex flex-col p-10">
      <div className="required">
        <span className="font-bold">필수 용품 준비</span>
        <ul className="list-disc px-5 mt-2 text-gray-400">
          <li>필요한 물품을 한 곳에 모아놓아 주시면 펫시터님의 빠른 케어 진행에 많은 도움이 됩니다.</li>
          <li>한 곳에 모을 수 없는 용품의 경우에는 펫시터님께 미리 정확한 위치를 안내해주세요.</li>
        </ul>
      </div>
      <div className="mt-10">
        <span className="font-bold">유의사항</span>
        <div>
          <ul className="list-disc px-5 mt-2 text-gray-400">
            <li className="leading-7">
              돌봄 외 특수 서비스는 요청 불가
              <br />
              1) 목욕 / 미용 및 주사를 맞히는 의료 행위
              <br />
              2) 애견호텔, 동물병원 등의 픽업/드랍 서비스
              <br />
              3) 세탁/청소 및 쓰레기 배출 등 청소 유사 서비스
            </li>
            <li className="leading-7 mt-1">
              고객 본인 소유 용품(장난감, 산책줄 등)이 파손되거나 파손으로 인한 반려동물의 삼킴, 상처 등 사고에 관해서는 펫시터 또는 당사에 책임을 물을 수
              없습니다.
            </li>
            <li className="leading-7 mt-1">
              위급 상황 발생 시 보호자와 연락이 불가능한 경우, 반려견의 건강/안전을 위해 담당 펫시터님의 인도로 동물병원으로 우선 이송될 수 있습니다. (펫시터
              과실이 아닌 경우, 병원비와 돌봄 비용은 보호자님께 부과됩니다) 펫시터 부주의가 아닌, 반려동물의 돌발적 공격으로 인한 상해 발생 시, 치료비가
              보호자께 부과될 수 있습니다.
            </li>
            <li className="leading-7 mt-1">
              반려동물 프로필에 대한 허위 사실 기재 시 추가비용이 발생 할 수 있으며, 향후 펫시터 서비스 이용에 패널티가 작용할 수 있습니다.
            </li>
            <li className="leading-7 mt-1"> 예약 내용에 따라 펫시터가 요청을 거절할 수 있습니다.</li>
          </ul>
        </div>
      </div>
      <div className="mt-10">
        <span className="font-bold">돌봄이 불가한 경우</span>
        <ul className="list-disc px-5 mt-2 text-gray-400">
          <li className="leading-7">펫시터님을 무는 등의 심한 공격성을 보이는 경우</li>
          <li className="leading-7 mt-1">링웜 등 전염성이 강한 질병이 있는 반려동물</li>
          <li className="leading-7 mt-1">등록하신 반려동물 프로필이 실제와 다른 경우</li>
          <li className="leading-7 mt-1">소유자가 분명하지 않은 경우</li>
          <li className="leading-7 mt-1">맹견에 해당하는 경우 돌발 상황 및 안전상의 이유로 돌봄 예약 요청 불가</li>
        </ul>
      </div>
      <div className="flex flex-col items-center justify-center mt-12">
        <label>
          <input type="checkbox" checked={isChecked} onChange={handleCheckboxChange} />
          <span className="ml-4">모두 확인, 동의하였습니다.</span>
        </label>
        <button
          className={`text-white w-full h-12 px-4 py-2 rounded-lg mt-5 ${!isChecked ? 'bg-gray-300' : 'bg-primary'}`}
          onClick={isChecked ? handleNextStep : null}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default Step2;
