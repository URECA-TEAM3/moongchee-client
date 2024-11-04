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

  return (
    <div
      className="card bg-white rounded-2xl px-6 py-6 hover:shadow-lg shadow-black-500/50 cursor-pointer ease-in duration-200"
      onClick={() => handleInfoClick(info.name)}
    >
      <Toaster position="top-center" reverseOrder={false} />
      <div className="profile flex items-center">
        <img src={info.imageUrl} className="object-cover object-center w-24 h-24 rounded-full " />
        <div className="personal ml-5">
          <span className="text-xl text-slate-900 font-medium">{info.name}</span>
          <div className="weekday">
            <div className="holiday text-text">{convertWeekDay(info.weekdays)} 근무</div>
            <span className="workTime text-text">{`${info.startTime} ~ ${info.endTime}`}</span>
          </div>
        </div>
      </div>
      <div className="personal-history mt-5 flex flex-col gap-3">
        <div>
          <span className="text-xl font-medium ">자기소개</span>
          <div className="w-[520px] overflow-hidden text-ellipsis line-clamp-2 text-text">{info.description}</div>
        </div>
        <div>
          <span className="text-xl font-medium">경험</span>
          <div className="w-[520px] overflow-hidden text-ellipsis line-clamp-2 text-text">{info.experience}</div>
        </div>
      </div>
    </div>
  );
};

export default PetSitterInfo;
