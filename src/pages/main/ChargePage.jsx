import React, { useState } from 'react';

import backButtonIcon from '/src/assets/images/backbtn.svg';
import doggumIcon from '/src/assets/images/doggum.svg';

const ChargePage = () => {
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [currentBones, setCurrentBones] = useState(1000);

  const additionalBones = {
    10000: 1,
    30000: 3,
    50000: 5,
    70000: 7,
    100000: 10,
  };
  const dispatch = useDispatch();

  const getButtonClass = (amount) => {
    return selectedAmount === amount
      ? 'w-32 py-1 bg-blue-500 text-white border-2 border-blue-500 rounded-lg flex flex-col items-center'
      : 'w-32 py-1 text-blue-500 border-2 border-blue-500 rounded-lg flex flex-col items-center';
  };

  return (
    <div className="p-6 text-center bg-white">
      <div className="flex items-center mb-6">
        <img src={backButtonIcon} alt="Back Button" className="w-6 h-6 cursor-pointer" onClick={() => window.history.back()} />
        <h1 className="flex-grow text-2xl font-bold text-center">개껌 충전하기</h1>
        <div className="w-6"></div>
      </div>

      <hr className="border-gray-300 mb-6" />

      <div className="mb-4 text-left">
        <p>
          현재 로그인된 유저 ID: <strong>{userId}</strong>
        </p>
      </div>

      <div className="flex justify-between items-center mb-4">
        <button className={getButtonClass(10000)} onClick={() => handleAmountClick(10000)}>
          1만원
          <div className="flex items-center mt-1">
            <img src={doggumIcon} alt="Doggum Icon" className="w-4 h-4 mr-1" />
            <span className="text-xs">10개</span>
          </div>
        </button>
      </div>

      <div className="flex justify-between items-center mb-4">
        <button className={getButtonClass(30000)} onClick={() => handleAmountClick(30000)}>
          3만원
          <div className="flex items-center mt-1">
            <img src={doggumIcon} alt="Doggum Icon" className="w-4 h-4 mr-1" />
            <span className="text-xs">30개</span>
          </div>
        </button>
        <span className="text-gray-500 flex items-center">
          <img src={doggumIcon} alt="Doggum Icon" className="mr-2 w-4 h-4" />+ 3개 추가 지급
        </span>
      </div>

      <div className="flex justify-between items-center mb-4">
        <button className={getButtonClass(50000)} onClick={() => handleAmountClick(50000)}>
          5만원
          <div className="flex items-center mt-1">
            <img src={doggumIcon} alt="Doggum Icon" className="w-4 h-4 mr-1" />
            <span className="text-xs">50개</span>
          </div>
        </button>
        <span className="text-gray-500 flex items-center">
          <img src={doggumIcon} alt="Doggum Icon" className="mr-2 w-4 h-4" />+ 5개 추가 지급
        </span>
      </div>

      <div className="flex justify-between items-center mb-4">
        <button className={getButtonClass(70000)} onClick={() => handleAmountClick(70000)}>
          7만원
          <div className="flex items-center mt-1">
            <img src={doggumIcon} alt="Doggum Icon" className="w-4 h-4 mr-1" />
            <span className="text-xs">70개</span>
          </div>
        </button>
        <span className="text-gray-500 flex items-center">
          <img src={doggumIcon} alt="Doggum Icon" className="mr-2 w-4 h-4" />+ 7개 추가 지급
        </span>
      </div>

      <div className="flex justify-between items-center mb-4">
        <button className={getButtonClass(100000)} onClick={() => handleAmountClick(100000)}>
          10만원
          <div className="flex items-center mt-1">
            <img src={doggumIcon} alt="Doggum Icon" className="w-4 h-4 mr-1" />
            <span className="text-xs">100개</span>
          </div>
        </button>
        <span className="text-gray-500 flex items-center">
          <img src={doggumIcon} alt="Doggum Icon" className="mr-2 w-4 h-4" />+ 10개 추가 지급
        </span>
      </div>

      {/* 현재 보유한 개껌 */}
      <div className="flex items-center justify-between mb-4 py-2 border-b border-gray-200">
        <span className="text-lg">현재 보유한 개껌:</span>
        <span className="text-lg font-bold flex items-center ml-auto">
          <img src={doggumIcon} alt="Doggum Icon" className="mr-2 w-4 h-4" />
          {currentBones}개
        </span>
      </div>

      {/* 충전할 개껌수 */}
      <div className="flex items-center justify-between mb-4 py-2 border-b border-gray-200">
        <span className="text-lg">충전할 개껌수:</span>
        <span className="text-lg font-bold flex items-center ml-auto">
          <img src={doggumIcon} alt="Doggum Icon" className="mr-2 w-4 h-4" />
          {selectedAmount ? selectedAmount / 1000 : 0}개 + {additionalBones[selectedAmount] || 0}개
        </span>
      </div>

      {/* 결제 후 개껌 */}
      <div className="flex items-center justify-between mb-4 py-2 border-b border-gray-200">
        <span className="text-lg">결제 후 개껌:</span>
        <span className="text-lg font-bold flex items-center ml-auto">
          <img src={doggumIcon} alt="Doggum Icon" className="mr-2 w-4 h-4" />
          {currentBones + (selectedAmount ? selectedAmount / 1000 : 0) + (additionalBones[selectedAmount] || 0)}개
        </span>
      </div>

      <button className="mt-6 py-2 px-4 bg-blue-600 text-white text-lg rounded-lg">우선 결제하기</button>
    </div>
  );
};

export default ChargePage;
