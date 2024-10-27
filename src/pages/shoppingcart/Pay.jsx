import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';
import PayInfo from '../../components/shop/PayInfo';

const Pay = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-white flex flex-col h-full">
      <div className="flex items-center justify-between p-5 border border-b-divider">
        <button onClick={() => navigate(-1)}>
          <IoIosArrowBack />
        </button>
        <div>결제하기</div>
        <div></div>
      </div>

      <div className="px-10">
        <h1 className="font-bold text-lg mt-10">배송지 정보</h1>
        <div className="flex justify-between items-start">
          <div>
            <div>
              <span className="text-[#9c9c9c]">이름 :</span> 홍길동
            </div>
            <div>
              <span className="text-[#9c9c9c]">주소 :</span> 울산광역시 북구 연암동
            </div>
          </div>
          <div>
            <button className="text-primary border border-primary px-4 py-1 rounded-lg">배송지 변경</button>
          </div>
        </div>
      </div>

      <div className="grow">
        <PayInfo />
      </div>

      <Link to="/payment">
        <div className="w-6/12 mx-auto bg-primary my-10 text-white p-3 mx-2 rounded-xl text-center">결제완료</div>
      </Link>
    </div>
  );
};

export default Pay;
