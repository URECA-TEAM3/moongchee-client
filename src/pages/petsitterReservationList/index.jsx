import React, { useEffect, useState } from 'react';
import ReservationCard from '../../components/ReservationCard';
import axios from 'axios';

const index = () => {
  const [reservationList, setReservationList] = useState([]);

  const handleReservationList = async () => {
    try {
      const res = await axios.post('http://localhost:3000/api/petsitter/reservation/list', {
        user_id: 1,
        user_type: 'user',
      });

      const reservationList = res.data.data.map((item) => {
        return {
          name: item.name,
          requestDate: item.requestDate,
          startTime: item.startTime,
          endTime: item.endTime,
          status: item.status,
          reservationId: item.reservation_id,
        };
        // {
        //   endTime: '12:00';
        //   name: '박지훈';
        //   requestDate: '2023-10-20';
        //   reservation_id: 1;
        //   sitter_id: 3;
        //   sitter_profile_image: 'https://example.com/image3.jpg';
        //   startTime: '10:00';
        //   status: 'reserved';
        //   user_id: 1;
        // }
      });

      setReservationList(reservationList);
    } catch (error) {}
  };

  useEffect(() => {
    handleReservationList();
  }, []);

  return (
    <div className="px-10 flex flex-col gap-10">
      {reservationList.map((item, index) => (
        <ReservationCard key={item.name + index} info={item} />
      ))}
    </div>
  );
};

export default index;
