import React, { useState } from 'react';
import DaumPostcode from 'react-daum-postcode';

const AddressSearch = ({ onComplete, errors }) => {
  const [roadAddress, setRoadAddress] = useState('');

  const handleComplete = (data) => {
    let fullAddress = data.address;
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
    }

    setRoadAddress(fullAddress);
    onComplete(fullAddress);
  };

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

  return (
    <div className="mt-4">
      <label className="block text-sm font-medium mb-1">주소*</label>
      <input
        type="text"
        placeholder="도로명 주소 (필수)"
        className={`block w-full p-2 border ${errors.address ? 'border-red-500' : 'border-divider'} rounded-lg mb-1`}
        value={roadAddress}
        readOnly
        onClick={openPostcodePopup}
      />
    </div>
  );
};

export default AddressSearch;
