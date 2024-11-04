import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';
import { useUserStore } from '../../store/userStore';
import API from '../../api/axiosInstance';
import toast, { Toaster } from 'react-hot-toast';
import Modal from '../../components/Modal';

const ChangeAddress = () => {
  const navigate = useNavigate();
  const { id, name, phone, address, detailaddress, updateProfile } = useUserStore((state) => state);
  const nameRef = useRef(null);
  const phoneRef = useRef(null);
  const addressRef = useRef(null);
  const [errors, setErrors] = useState({});

  const [changeInfo, setChangeInfo] = useState({
    id: id,
    name: name,
    phone: phone,
    address: address,
    detailaddress: detailaddress,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const validateFields = (change) => {
    let newErrors = {};

    if (!changeInfo.name) {
      newErrors.name = '이름을 입력해주세요.';
      if (!change) toast.error('이름을 입력해주세요.');
    }

    if (!changeInfo.phone) {
      newErrors.phone = '휴대폰 번호를 입력해주세요.';
      if (!change) toast.error('휴대폰 번호를 입력해주세요.');
    }

    if (!changeInfo.detailaddress) {
      newErrors.address = '주소를 입력해주세요.';
      if (!change) toast.error('주소를 입력해주세요.');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

    setChangeInfo((prev) => ({
      ...prev,
      address: fullAddress,
    }));
  };

  const handleChangeInfo = async (event) => {
    validateFields();

    if (!nameRef.current.value) {
      nameRef.current.focus();
      return;
    }

    if (!phoneRef.current.value) {
      phoneRef.current.focus();
      return;
    }

    if (!addressRef.current.value) {
      addressRef.current.focus();
      return;
    }

    try {
      const response = await API.put('/members/update-profile-in-cart', changeInfo);
      updateProfile(response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error();
    }
  };

  return (
    <>
      <div className="bg-white flex flex-col h-full">
        <Toaster />
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
              ref={nameRef}
              type="text"
              placeholder="이름"
              value={changeInfo.name}
              onChange={(e) => {
                validateFields(true);
                setChangeInfo((prev) => ({
                  ...prev,
                  name: e.target.value,
                }));
              }}
              className={`block w-full p-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded mb-1`}
            />
            {errors.name && <span className="text-red-500 text-xs mt-1 ml-1">{errors.name}</span>}
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium mb-1">휴대폰 번호*</label>
            <div className="flex space-x-2 mb-1">
              <input
                ref={phoneRef}
                type="tel"
                placeholder="휴대폰번호"
                value={changeInfo.phone}
                onChange={(e) => {
                  validateFields(true);
                  setChangeInfo((prev) => ({
                    ...prev,
                    phone: e.target.value,
                  }));
                }}
                className={`w-full p-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded`}
              />
            </div>
            {errors.phone && <span className="text-red-500 text-xs mt-1 ml-1">{errors.phone}</span>}
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium mb-1">주소*</label>
            <input
              type="text"
              placeholder="도로명 주소 (필수)"
              className={`block w-full p-2 border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded mb-1`}
              value={changeInfo.address}
              readOnly
              onClick={openPostcodePopup}
            />

            <input
              ref={addressRef}
              type="text"
              placeholder="상세 주소 입력 (선택)"
              value={changeInfo.detailaddress}
              onChange={(e) => {
                validateFields(true);
                setChangeInfo((prev) => ({
                  ...prev,
                  detailaddress: e.target.value,
                }));
              }}
              className="block w-full p-2 border border-gray-300 rounded mb-1"
            />
            {errors.address && <span className="text-red-500 text-xs mt-1 ml-1">{errors.address}</span>}
          </div>
        </form>

        <button
          onClick={() => {
            handleChangeInfo();
          }}
        >
          <div className="w-6/12 mx-auto bg-primary my-10 text-white p-3 mx-2 rounded-xl text-center">저장</div>
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={'배송지 변경'}>
        <div className="my-10 flex justify-center">
          <span className="font-bold text-lg">개인정보가 수정되었습니다.</span>
        </div>
        <div className="flex gap-4 mt-3">
          <button className="text-white bg-divider px-4 py-2 rounded-lg font-normal w-full" onClick={() => navigate('/mypage/edituser')}>
            내 정보 보기
          </button>
          <button onClick={() => navigate(-1)} className="text-white bg-primary px-4 py-2 rounded-lg font-normal w-full">
            확인
          </button>
        </div>
      </Modal>
    </>
  );
};

export default ChangeAddress;
