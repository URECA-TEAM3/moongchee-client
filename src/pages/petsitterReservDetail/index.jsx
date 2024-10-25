import React, { useState } from 'react';

const index = () => {
  const [isPetSitter, setIsPetSitter] = useState(true);
  const info = {
    name: '박주광',
    scheduled: '2024-11-01',
    startTime: '10:00 AM',
    endTime: '14:00 PM',
    request:
      '안녕하세요! 저희 미츄를 잘 부탁드립니다. \n 🐶하루 두 번 산책 (아침 8시쯤, 저녁 6시쯤) 부탁드려요.  \n 산책은 30분 정도가 적당해요. \n 식사는 아침 9시와 저녁 7시에 줘야 해요. \n사료는 1컵씩 준비해놨어요.간식은 너무 자주 주지 말아주세요. 산책 후에만 하나씩 주세요.물은 항상 깨끗하게 채워주시고, 식사 후 10분 정도는 물을 먹을 수 있게 해주세요.집에서 혼자 있을 때는 [장난감 이름]으로 놀게 해주시면 좋아요. \n 혹시 낯선 환경에서 불안해하면 좋아하는 담요가 있으니 그걸 꺼내주시면 안심할 거예요. \n비상 연락처저의 전화번호: [전화번호]가까운 동물병원: [병원 이름], [병원 전화번호]',
    pet: {
      name: '미츄',
      breed: '말티즈',
      age: '10',
      gender: 'female',
      weight: '12.5kg',
      neutuering: true,
    },
  };

  const handleGenderCode = (value) => {
    if (value === 'male') {
      return '남아';
    } else {
      return '여아';
    }
  };

  const handleNeutuerStatusCode = (value) => {
    if (value === true) {
      return '중성화 수술 완료';
    } else {
      return '중성화 수술 미완료';
    }
  };

  return (
    <div>
      <div className="profile flex items-center mt-3">
        <img src="/src/assets/images/dog.jpeg" className="object-cover object-center w-24 h-24 rounded-full " />
        <div className="personal ml-5">
          <span className="text-xl text-slate-900 font-bold">{info.name}</span>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="flex flex-col mt-5">
          <span className="text-black text-base font-semibold">요청한 날짜</span>
          <span className="text-gray-700 text-base font-medium">{info.scheduled}</span>
        </div>
        <div className="flex flex-col mt-5">
          <span className="text-black text-base font-semibold">요청한 시간</span>
          <span className="text-gray-700 text-base font-medium">{`${info.startTime} ~ ${info.endTime}`}</span>
        </div>
        <div className="mt-5">
          <span className="text-black text-base font-semibold">반려동물 정보</span>
          <div className="flex flex-col bg-paleblue px-5 py-3 rounded-lg shadow-sm mt-3">
            <span>{info.pet.name}</span>
            <span>{`${info.pet.breed} | ${info.pet.age}살 | ${handleGenderCode(info.pet.gender)} | ${info.pet.weight}`}</span>
            <span>{handleNeutuerStatusCode(info.pet.neutuering)}</span>
          </div>
        </div>
        <div className="mt-5">
          <span className="text-black text-base font-semibold">요청 사항</span>
          <div className="whitespace-pre-line mt-3 leading-9">{info.request}</div>
        </div>
        <div className="mt-10">
          {isPetSitter ? (
            <div className="flex gap-5 mt-3 w-full">
              <button className="text-white bg-delete px-4 py-2 rounded-lg font-normal w-full">거절</button>
              <button className="text-white bg-primary px-4 py-2 rounded-lg font-normal w-full">수락</button>
            </div>
          ) : (
            <button className="text-white bg-primary px-4 py-2 rounded-lg font-normal w-full">예약 취소하기</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default index;
