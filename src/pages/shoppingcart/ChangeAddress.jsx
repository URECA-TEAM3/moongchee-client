import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';

const ChangeAddress = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [roadAddress, setRoadAddress] = useState('');
  const [detailedAddress, setDetailedAddress] = useState('');
  const [errors, setErrors] = useState({});

  const openPostcodePopup = () => {
    const popupWidth = 500;
    const popupHeight = 600;
    const popupX = window.screen.width / 2 - popupWidth / 2;
    const popupY = window.screen.height / 2 - popupHeight / 2;

    const popup = window.open('', '우편번호검색', `width=${popupWidth},height=${popupHeight},left=${popupX},top=${popupY}`);

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>주소 검색</title>
        <script src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"></script>
      </head>
      <body>
        <div id="postcode-container"></div>
        <script>
          new daum.Postcode({
            oncomplete: function(data) {
              window.opener.postMessage(data, '*');
              window.close();
            }
          }).embed(document.getElementById('postcode-container'));
        </script>
      </body>
      </html>
    `;

    popup.document.write(htmlContent);
  };

  window.addEventListener('message', (event) => {
    if (event.data && event.data.address) {
      handleComplete(event.data);
    }
  });

  const handleComplete = (data) => {
    let fullAddress = data.address;
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress += extraAddress !== '' ? `, ${extraAddress}` : data.buildingName;
      }
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
    }

    setRoadAddress(fullAddress);
  };

  return (
    <div className="bg-white flex flex-col h-full">
      <div className="flex items-center justify-between p-5 border border-b-divider">
        <button onClick={() => navigate(-1)}>
          <IoIosArrowBack />
        </button>
        <div>배송지 변경</div>
        <div></div>
      </div>

      <form className="p-10 grow">
        <div className="mb-5">
          <label className="block text-sm font-medium mb-1">이름*</label>
          <input
            type="text"
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`block w-full p-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded mb-1`}
          />
        </div>

        <div className="mb-5">
          <label className="block text-sm font-medium mb-1">휴대폰 번호*</label>
          <div className="flex space-x-2 mb-1">
            <input
              type="tel"
              placeholder="휴대폰번호"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={`w-full p-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded`}
            />
          </div>
        </div>

        <div className="mb-5">
          <label className="block text-sm font-medium mb-1">주소*</label>
          <input
            type="text"
            placeholder="도로명 주소 (필수)"
            className={`block w-full p-2 border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded mb-1`}
            value={roadAddress}
            readOnly
            onClick={openPostcodePopup}
          />

          <input
            type="text"
            placeholder="상세 주소 입력 (선택)"
            value={detailedAddress}
            onChange={(e) => setDetailedAddress(e.target.value)}
            className="block w-full p-2 border border-gray-300 rounded mb-6"
          />
        </div>
      </form>

      <Link to="/payment">
        <div className="w-6/12 mx-auto bg-primary my-10 text-white p-3 mx-2 rounded-xl text-center">저장</div>
      </Link>
    </div>
  );
};

export default ChangeAddress;
