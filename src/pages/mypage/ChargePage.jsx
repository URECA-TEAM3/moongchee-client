import React, { useState } from 'react';
import backButtonIcon from '/src/assets/icons/backbtn.svg';
import { useNavigate } from 'react-router-dom';
import DogChew from '../../components/DogChew';

const ChargePage = () => {
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [currentBones, setCurrentBones] = useState(100);
  const navigate = useNavigate();

  const additionalBones = {
    1: 0,
    3: 10,
    5: 20,
    7: 50,
    10: 100,
  };

  const amounts = [1, 3, 5, 7, 10];

  const getButtonClass = (amount) => {
    return selectedAmount === amount
      ? 'w-44 py-2 bg-primary text-white border border-primary rounded-lg flex flex-col items-center'
      : 'w-44 py-2 text-primary border border-primary rounded-lg flex flex-col items-center';
  };

  return (
    <div className="p-5 text-center h-full flex flex-col justify-between bg-white">
      <div className="flex items-center">
        <img src={backButtonIcon} alt="Back Button" className="w-6 h-6 cursor-pointer" onClick={() => window.history.back()} />
        <h1 className="flex-grow text-lg text-center">개껌 충전하기</h1>
        <div className="w-6"></div>
      </div>

      <div className="p-5">
        <div className="flex justify-center flex-wrap">
          {amounts.map((price) => (
            <div className="flex items-center py-2 pr-4" key={price}>
              <button className={getButtonClass(price)} onClick={() => setSelectedAmount(price)}>
                <p className="font-bold">{price}만원</p>
                <div className="flex items-center mt-1">
                  <DogChew />
                  <span className="ml-1">{price}00개</span>
                  {price !== 1 && <span className="flex items-center font-bold text-[#f97316] ml-1">+{additionalBones[price]}개</span>}
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="w-[70%] m-auto">
          <div className="flex items-center">
            <span className="mr-1">현재</span>
            <DogChew />
            <span className="flex items-center ml-auto">{currentBones}개</span>
          </div>
          <div className="flex items-center my-2">
            <span className="mr-1">충전할</span>
            <DogChew />
            <span className="flex items-center ml-auto">
              {selectedAmount ? selectedAmount * 100 : 0}개 + {additionalBones[selectedAmount]}개
            </span>
          </div>
          <div className="flex items-center">
            <span className="mr-1">결제 후</span>
            <DogChew />
            <span className="font-bold flex items-center ml-auto">
              {selectedAmount ? currentBones + selectedAmount * 100 + additionalBones[selectedAmount] : 0}개
            </span>
          </div>
          <div className="flex items-center my-5">
            <span className="mr-5">결제 금액</span>
            <span className="text-lg font-bold flex items-center ml-auto">{selectedAmount ? (selectedAmount * 10000).toLocaleString() : 0}원</span>
          </div>
        </div>

        {selectedAmount ? (
          <button onClick={() => navigate(`/checkout?price=${selectedAmount * 10000}`)} className="h-12 w-[70%] bg-primary text-white text-lg rounded-lg">
            결제하기
          </button>
        ) : (
          <button className="h-12 w-[70%] bg-gray-300 text-white text-lg rounded-lg">결제하기</button>
        )}
      </div>
    </div>
  );
};

export default ChargePage;
