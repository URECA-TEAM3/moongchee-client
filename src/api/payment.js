import API from './axiosInstance';

export const requestPayments = async (orderId, id, amount) => {
  try {
    const response = await API.post('/payments', {
      orderId,
      userId: id,
      amount: amount,
    });

    return response;
  } catch (error) {
    console.error(error);
  }
};

export const confirmOrder = async (params) => {
  try {
    const response = await API.post('/cart/pay', params);
    return response;
  } catch (error) {
    console.error();
  }
};

export const confirmPayments = async (requestData) => {
  try {
    const response = await API.post('/payments/confirm', requestData);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const approvePayments = async (orderId, amount, paymentKey) => {
  try {
    const response = await API.post('/payments/approve', {
      orderId,
      amount,
      paymentKey,
    });
    return response;
  } catch (error) {
    console.log('Error handling payment_approved table:', error.message);
  }
};
