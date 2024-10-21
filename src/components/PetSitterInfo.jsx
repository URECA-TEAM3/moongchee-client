import React from 'react';
import { useNavigate } from 'react-router-dom';

const PetSitterInfo = ({ info }) => {
  const navigate = useNavigate();

  const handleInfoClick = () => {
    navigate(`/petsitter/detail/${info.name}`, { state: { info: info } });
  };
  return (
    <div
      className="card bg-white rounded-2xl px-6 py-6 hover:shadow-lg shadow-black-500/50 cursor-pointer ease-in duration-200"
      onClick={() => handleInfoClick(info.name)}
    >
      <div className="profile flex items-center">
        <img src="/src/assets/images/dog.jpeg" className="object-cover object-center w-24 h-24 rounded-full " />
        <div className="personal ml-5">
          <span className="text-xl text-slate-900 font-medium">{info.name}</span>
          <div className="weekday">
            <div className="holiday text-text">{info.weekday} 근무</div>
            <span className="workTime text-text">{`${info.startTime} ~ ${info.endTime}`}</span>
          </div>
        </div>
      </div>
      <div className="personal-history mt-5 flex flex-col gap-3">
        <div>
          <span className="text-xl font-medium ">자기소개</span>
          <div className="w-[520px] overflow-hidden text-ellipsis line-clamp-2 text-text">{info.introduction}</div>
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
