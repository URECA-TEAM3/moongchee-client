import React from 'react';
import ReservationCard from '../../components/ReservationCard';

const index = () => {
  const reservationList = [
    {
      name: '박주광',
      scheduled: '2024-11-01',
      startTime: '10:00 AM',
      endTime: '14:00 PM',
      status: 'reserved',
    },
    {
      name: '박주광',
      scheduled: '2024-11-01',
      startTime: '10:00 AM',
      endTime: '14:00 PM',
      status: 'cancel',
    },
    {
      name: '박주광',
      scheduled: '2024-11-01',
      startTime: '10:00 AM',
      endTime: '14:00 PM',
      status: 'sitted',
    },
  ];
  return (
    <div className="px-10 flex flex-col gap-10">
      {reservationList.map((item, index) => (
        <ReservationCard key={item.name + index} info={item} />
      ))}
    </div>
  );
};

export default index;
