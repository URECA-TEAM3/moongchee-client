import React, { useEffect, useState } from 'react';

const index = () => {
  const [sitterList, setSitterList] = useState([]);

  useEffect(() => {
    setSitterList([
      {
        name: '박주광',
        profile: '/src/assets/images/dog.jpeg',
        weekday: '월, 화, 수, 목, 금',
        startTime: '10:00',
        endTime: '17:00',
        introduction:
          '안녕하세요! 믿고 맡길 수 있는 펫시터 김예원입니다. 저는 동물을 진심으로 사랑하며, 오랜 시간 동안 반려견과 함께한 경험이 있습니다. 어린 시절부터 반려동물을 키우며 책임감과 배려심을 배웠고',
        experience:
          '현재도 반려견과 함께 생활하고 있습니다! 강아지들과 시간을 보내는 게 저에게는 큰 행복이에요. 산책도 자주 하고, 집에서도 재밌게 놀아주고, 강아지가 필요로 하는 것들을 잘 챙겨주는 편이에요.',
      },
      {
        name: '박주광',
        profile: '/src/assets/images/dog.jpeg',
        weekday: '월, 화, 수, 목, 금',
        startTime: '10:00',
        endTime: '17:00',
        introduction:
          '안녕하세요! 믿고 맡길 수 있는 펫시터 김예원입니다. 저는 동물을 진심으로 사랑하며, 오랜 시간 동안 반려견과 함께한 경험이 있습니다. 어린 시절부터 반려동물을 키우며 책임감과 배려심을 배웠고',
        experience:
          '현재도 반려견과 함께 생활하고 있습니다! 강아지들과 시간을 보내는 게 저에게는 큰 행복이에요. 산책도 자주 하고, 집에서도 재밌게 놀아주고, 강아지가 필요로 하는 것들을 잘 챙겨주는 편이에요.',
      },
      {
        name: '박주광',
        profile: '/src/assets/images/dog.jpeg',
        weekday: '월, 화, 수, 목, 금',
        startTime: '10:00',
        endTime: '17:00',
        introduction:
          '안녕하세요! 믿고 맡길 수 있는 펫시터 김예원입니다. 저는 동물을 진심으로 사랑하며, 오랜 시간 동안 반려견과 함께한 경험이 있습니다. 어린 시절부터 반려동물을 키우며 책임감과 배려심을 배웠고',
        experience:
          '현재도 반려견과 함께 생활하고 있습니다! 강아지들과 시간을 보내는 게 저에게는 큰 행복이에요. 산책도 자주 하고, 집에서도 재밌게 놀아주고, 강아지가 필요로 하는 것들을 잘 챙겨주는 편이에요.',
      },
      {
        name: '박주광',
        profile: '/src/assets/images/dog.jpeg',
        weekday: '월, 화, 수, 목, 금',
        startTime: '10:00',
        endTime: '17:00',
        introduction:
          '안녕하세요! 믿고 맡길 수 있는 펫시터 김예원입니다. 저는 동물을 진심으로 사랑하며, 오랜 시간 동안 반려견과 함께한 경험이 있습니다. 어린 시절부터 반려동물을 키우며 책임감과 배려심을 배웠고',
        experience:
          '현재도 반려견과 함께 생활하고 있습니다! 강아지들과 시간을 보내는 게 저에게는 큰 행복이에요. 산책도 자주 하고, 집에서도 재밌게 놀아주고, 강아지가 필요로 하는 것들을 잘 챙겨주는 편이에요.',
      },
    ]);
  }, []);

  const handleApplyClick = () => {};

  const handleReservationClick = () => {};

  return (
    <div className="container inline-grid px-4 py-5 gap-y-5 h-full overflow-y-scroll">
      <h1 className="text-2xl subpixel-antialiased ">펫시터</h1>
      <div className="flex items-center container gap-5">
        <button className="text-white bg-primary px-4 py-2 rounded-lg font-normal">펫시터 지원하기</button>
        <button className="text-white bg-primary px-4 py-2 rounded-lg font-normal">예약 / 취소 내역</button>
      </div>
      <div className="search"></div>
      {sitterList.map((item, index) => (
        <div key={'item' + index} className="card bg-white rounded-2xl px-6 py-6 hover:shadow-lg shadow-black-500/50 cursor-pointer ease-in duration-200">
          <div className="profile flex items-center">
            <img src="/src/assets/images/dog.jpeg" className="object-cover object-center w-24 h-24 rounded-full " />
            <div className="personal ml-5">
              <span className="text-xl text-slate-900 font-medium">{item.name}</span>
              <div className="weekday">
                <div className="holiday">{item.weekday} 근무</div>
                <span className="workTime">{`${item.startTime} ~ ${item.endTime}`}</span>
              </div>
            </div>
          </div>
          <div className="personal-history mt-5 flex flex-col gap-3">
            <div>
              <span className="text-xl font-medium ">자기소개</span>
              <div className="w-[520px] overflow-hidden text-ellipsis line-clamp-2">{item.introduction}</div>
            </div>
            <div>
              <span className="text-xl font-medium">경험</span>
              <div className="w-[520px] overflow-hidden text-ellipsis line-clamp-2">{item.experience}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default index;
