import React from 'react';
import { useNavigate } from 'react-router-dom';
import { convertWeekDay } from '../utils/petSitterHelper';
import usePetSitterStore from '../store/petsitterStore';
import { toast, Toaster } from 'react-hot-toast';

const PetSitterInfo = ({ info, isDisabled }) => {
  const navigate = useNavigate();
  const { setPetsitterData } = usePetSitterStore();

  const handleInfoClick = () => {
    if (!isDisabled) {
      setPetsitterData(info);
      navigate(`/petsitter/detail/${info.name}`);
    } else {
      toast.error('등록된 반려동물이 없습니다.');
    }
  };

  console.log(info);

  return (
    <div
      className="card bg-white rounded-2xl p-6 hover:shadow-lg shadow-black-500/50 cursor-pointer ease-in duration-200"
      onClick={() => handleInfoClick(info.name)}
    >
      <Toaster position="top-center" reverseOrder={false} />
      <div className="profile flex items-center">
        <img src={info.imageUrl} className="object-cover object-center w-16 h-16 rounded-full " />
        <div className="personal ml-5">
          <span className="text-lg font-bold">{info.name}</span>
          <div className="weekday">
            <div className="holiday">{convertWeekDay(info.weekdays)} 근무</div>
            <span className="workTime">{`${info.startTime} ~ ${info.endTime}`}</span>
          </div>
        </div>
      </div>
      <div className="personal-history mt-5 flex flex-col gap-3">
        <div>
          <span className="font-bold text-sm">자기소개</span>
          <div className="w-full overflow-hidden text-ellipsis line-clamp-2">{info.description}</div>
        </div>
        <div>
          <span className="font-bold text-sm">경험</span>
          <div className="w-full overflow-hidden text-ellipsis line-clamp-2">{info.experience}</div>
        </div>
      </div>
    </div>
  );
};

export default PetSitterInfo;
