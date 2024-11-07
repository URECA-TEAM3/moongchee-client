import API from './axiosInstance';

export const registerPet = async (userId, name, age, weight, species, gender, surgery, animalImageUrl) => {
  try {
    const response = await API.post('/pets/animal-register', {
      userId,
      name,
      age,
      weight,
      species,
      gender,
      surgery,
      animalImageUrl,
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const deletePet = async (petId) => {
  try {
    const response = await API.delete(`/pets/${petId}`);
    return response;
  } catch (error) {
    console.error(error);
    toast.error('반려동물 정보 삭제에 실패했습니다.');
  }
};

export const updateProfile = async (params) => {
  try {
    const response = await API.put('/pets/update-profile', params);
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const getPetDetail = async (petId) => {
  try {
    const response = await API.get(`/pets/detail/${petId}`);
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const signUp = async (params) => {
  try {
    const response = await API.post('http://localhost:3000/api/members/signup', params);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    return null;
  }

  try {
    const response = await API.post(
      '/auth/refresh-token',
      {},
      {
        headers: { Authorization: `Bearer ${refreshToken}` },
      }
    );

    const newAccessToken = response.data.accessToken;
    if (newAccessToken) {
      sessionStorage.setItem('accessToken', newAccessToken);
      return newAccessToken;
    } else {
      console.error('서버로부터 유효한 액세스 토큰을 받지 못했습니다.');
      return null;
    }
  } catch (error) {
    console.error('액세스 토큰 갱신 오류:', error);
    return null;
  }
};
