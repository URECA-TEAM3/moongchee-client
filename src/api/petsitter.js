import API from './axiosInstance';

export const getSitterList = async (id, weekdays, startTime, endTime, region) => {
  const params = {
    userId: id,
    weekdays: weekdays,
    startTime: startTime,
    endTime: endTime,
    region: region,
  };

  try {
    const res = await API.get('/petsitter/list', { params });
    const sitterList = res.data.data.map((item) => {
      return {
        id: item.id,
        name: item.name,
        imageUrl: item.image,
        weekdays: item.weekdays,
        startTime: item.startTime,
        endTime: item.endTime,
        description: item.description,
        experience: item.experience,
      };
    });

    return sitterList;
  } catch (error) {
    console.log(error);
  }
};

export const getReservationList = async (id, target) => {
  try {
    const res = await API.post('/petsitter/reservation/list', {
      user_id: id,
      user_type: target,
    });

    const reservationList = res.data.data.map((item) => {
      return {
        name: item.name,
        userId: item.user_id,
        sitterId: item.sitter_id,
        requestDate: item.requestDate,
        startTime: item.startTime,
        endTime: item.endTime,
        status: item.status,
        price: item.price,
        profile_image: item.profile_image,
        reservationId: item.reservation_id,
      };
    });
    return reservationList;
  } catch (error) {
    console.error(error);
  }
};

export const getReservationDetail = async (id) => {
  try {
    const response = await API.get(`/petsitter/reservation/detail/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const applyReservation = async (reservation) => {
  try {
    const response = await API.post('/petsitter/reservation/add', reservation);
    return response;
  } catch (error) {
    console.error('예약 생성 실패:', error);
    toast.error('예약 생성에 실패했습니다.');
  }
};

export const getPetList = async (id) => {
  try {
    const res = await API.get(`/pets/${id}`);
    const list = res.data;
    console.log(list);
    return list;
  } catch (error) {
    console.error(error);
  }
};

export const getSitterDetailWithSitterId = async (sitterId) => {
  try {
    const response = await API.get(`/petsitter/sitter/detail/${sitterId}`);
    const result = response.data.data[0];
    return result;
  } catch (error) {
    console.error(error);
  }
};

export const getPetsitter = async (id) => {
  try {
    const res = await API.get('/petsitter/sitter/detail', { params: { id } });
    const data = res.data.data;
    const region = res.data.data.region.split(' ');

    const list = {
      selectedImage: data.image,
      weekdays: data.weekdays,
      startTime: data.startTime,
      endTime: data.endTime,
      region1: region[0],
      region2: region[1],
      description: data.description,
      experience: data.experience,
    };

    return list;
  } catch (error) {
    console.log(error);
  }
};

export const applyPetsitter = async (params) => {
  try {
    const response = await API.post('/petsitter/apply', params);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const updatePetsitter = async (params) => {
  try {
    const response = await API.put('/petsitter/sitter/update', params);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const updateReservations = async (type, id) => {
  try {
    const response = await API.post(`/petsitter/reservation/${type}`, {
      reservation_id: id,
    });
    console.log(response);
  } catch (error) {
    console.error(error);
  }
};

export const saveNotifications = async (notiData) => {
  console.log(notiData);
  try {
    const response = await API.post('/notifications/save', notiData);
    console.log(response);
  } catch (error) {
    console.error('Notification 정보 저장 실패');
  }
};
