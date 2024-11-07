import API from './axiosInstance';
import { generateRandomString } from '../utils/productHelper';

export const requestPayments = async (id, amount) => {
  try {
    const orderId = generateRandomString();

    const response = await axios.post('/payments', {
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
