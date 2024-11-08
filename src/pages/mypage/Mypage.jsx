import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DogChew from '../../components/DogChew';
import petProfileImage from '/assets/images/defaultpet.png';
import { useUserStore } from '../../store/userStore';
import { useProductStore } from '../../store/productsStore';
import usePetSitterStore from '../../store/petsitterStore';
import { getPetList, getPetsitterbyId } from '../../api/petsitter';
import { getPoint } from '../../api/purchase';

function Mypage(props) {
  const { setType } = usePetSitterStore();
  const { logout } = useUserStore((state) => state);
  const { resetProduct } = useProductStore((state) => state);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [pets, setPets] = useState([]);
  const [isPetsitter, setIsPetsitter] = useState(false);
  const [point, setPoint] = useState(0);
  const [logoutModal, setLogoutModal] = useState(false);
  const [nickname, setNickname] = useState('');
  const [userId, setUserId] = useState(0);
  const [petsitter, setPetsitter] = useState({});

  useEffect(() => {
    const userData = sessionStorage.getItem('userData');
    if (userData) {
      const parsedData = JSON.parse(userData); // JSON 파싱
      setUserName(parsedData.name);
      setProfileImageUrl(parsedData.profile_image_url);
      setNickname(parsedData.nickname);
      setUserId(parsedData.id);
      // 반려동물 리스트 출력 함수 호출
      fetchPets(parsedData.id);
      fetchPoints(parsedData.id);
      setIsPetsitter(parsedData.petsitter == 1 ? true : false);
      fetchPetsitter(parsedData.id);
    }
  }, []);

  // 반려동물 데이터 가져오기
  const fetchPets = async (userId) => {
    try {
      const response = await getPetList(userId);
      setPets(response);
    } catch (error) {
      console.error(error);
    }
  };

  // 포인트 조회
  const fetchPoints = async (userId) => {
    try {
      const response = await getPoint(userId);
      setPoint(response.data.data.point);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPetsitter = async (userId) => {
    try {
      const response = await getPetsitterbyId(userId);
      setPetsitter(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    setIsModalOpen(true); // 로그아웃 버튼 클릭 시 모달 open
  };

  const logoutSuccess = () => {
    // 로그아웃 로직
    localStorage.clear();
    sessionStorage.clear();
    logout();
    resetProduct();

    navigate('/');

    setLogoutModal(false);
  };

  const confirmLogout = () => {
    setIsModalOpen(false); // 모달 닫기
    setLogoutModal(true);
  };

  const closeModal = () => {
    setIsModalOpen(false); // 모달 닫기
  };

  const handleEditUserInfoClick = () => {
    navigate('/mypage/edituser');
  };

  const handleShopHistoryClick = (userId) => {
    navigate(`/mypage/shophistory/${userId}`);
  };

  return (
    <div className="container inline-grid h-full">
      <div className="pt-7 pb-7 pl-10 pr-10">
        {/* User Profile */}
        <div className="w-full bg-white rounded-lg p-5 shadow mb-5 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <img src={profileImageUrl} alt="Profile" className="w-12 h-12 rounded-full" />
            <p className="text-lg">{nickname}</p>
          </div>
          <button
            onClick={handleEditUserInfoClick}
            className="border border-primary text-primary text-sm rounded-lg w-16 h-7 hover:bg-primary hover:text-white"
          >
            편집
          </button>
        </div>

        {/* Petsitter Profile - 펫시터일 경우에만 표시 */}
        {isPetsitter && (
          <div className="w-full bg-white rounded-lg p-5 shadow mb-5">
            <p className="mb-2 ">펫시터 프로필</p>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <img src={petsitter.image} alt="Profile" className="w-12 h-12 rounded-full" />
                <p className="text-lg">{petsitter.name}</p>
              </div>
              <button
                onClick={() => {
                  setType('update');
                  navigate('/petsitter/profile');
                }}
                className="border border-primary mb-6 hover:bg-primary hover:text-white text-primary text-sm rounded-lg w-16 h-7"
              >
                편집
              </button>
            </div>
          </div>
        )}

        {/* Pet Profile */}
        <div className="w-full bg-white rounded-lg p-5 rounded-lg shadow mb-5">
          <div className="flex items-center justify-between">
            <p className="">내 반려동물 ({pets.length})</p>
            <button onClick={() => navigate('/mypage/petregister')}>
              <p className="text-lightblue hover:text-primary">⊕ 추가</p>
            </button>
          </div>

          {pets.map((pet) => (
            <div key={pet.id} className="flex justify-between items-center mt-3">
              <div className="flex items-center space-x-4">
                {pet.animal_image_url ? (
                  <img src={pet.animal_image_url} alt="Pet Profile" className="w-12 h-12 rounded-full" />
                ) : (
                  <img src={petProfileImage} alt="Pet Profile" className="w-12 h-12 rounded-full" />
                )}
                <div>
                  <p className="text-lg">{pet.name}</p>
                </div>
              </div>
              <button
                onClick={() => navigate(`/mypage/editpet/${pet.id}`, { state: { petId: pet.id } })}
                className="border border-primary text-primary text-sm rounded-lg w-16 h-7 hover:bg-primary hover:text-white"
              >
                편집
              </button>
            </div>
          ))}
        </div>

        {/* Point Recharge */}
        <div className="w-full bg-white rounded-lg p-5 rounded-lg shadow mb-5">
          <p className="mb-2">개껌 충전하기</p>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <DogChew />
              <p className="text-lg">
                <span className="font-bold">{point}</span> 개
              </p>
            </div>
            <button
              onClick={() => navigate(`/chargepage`)}
              className="border border-primary -mt-8 hover:bg-primary hover:text-white text-primary text-sm rounded-lg w-16 h-7"
            >
              충전
            </button>
          </div>
        </div>

        {/* Purchase History */}
        <div className="w-full bg-white rounded-lg p-5 rounded-lg shadow mb-5 flex justify-between items-center">
          <p className="">구매 / 취소 내역</p>
          <button
            onClick={() => handleShopHistoryClick(1)}
            className="border border-primary hover:bg-primary hover:text-white text-primary text-sm rounded-lg w-16 h-7"
          >
            더보기
          </button>
        </div>

        {/* Petsitter Reservation History */}
        <div className="w-full bg-white rounded-lg p-5 rounded-lg shadow mb-8 flex justify-between items-center">
          <p className="">펫시터 예약 / 취소 내역</p>
          <button
            onClick={() => navigate('/petsitter/reservation/list', { state: { type: 'user' } })}
            className="border border-primary hover:bg-primary hover:text-white text-primary text-sm rounded-lg w-16 h-7"
          >
            더보기
          </button>
        </div>

        {/* Logout */}
        <div className="w-full text-center">
          <button onClick={handleLogout} className="underline hover:text-text">
            로그아웃
          </button>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg text-center w-80 h-auto p-6">
              <h2 className="text-lg font-bold mb-6">로그아웃 하시겠습니까?</h2>
              <div className="flex justify-center space-x-4">
                <button onClick={closeModal} className="px-12 py-2 bg-divider text-gray-500 rounded-lg">
                  취소
                </button>
                <button onClick={confirmLogout} className="px-12 py-2 bg-primary text-white rounded-lg">
                  확인
                </button>
              </div>
            </div>
          </div>
        )}

        {logoutModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg text-center w-80 h-auto p-6">
              <h2 className="text-base font-bold mb-6">로그아웃 되었습니다.</h2>
              <button onClick={logoutSuccess} className="px-12 py-2 bg-primary text-white rounded-lg">
                확인
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Mypage;
