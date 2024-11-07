import API from './axiosInstance';

export const updatePoint = async (id, amount) => {
  const response = await API.post('/members/update-points', {
    userId: id,
    amount: amount,
  });
  return response;
};

export const refundPoint = async (id, amount) => {
  try {
    const response = await API.post('/members/update-points', {
      userId: id,
      amount: amount,
    });
    console.log('Updated points successfully:', response);
  } catch (error) {
    console.error('Error updating points:', error);
  }
};
