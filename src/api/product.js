import API from './axiosInstance';
import { fetchImgFromFireStorage } from '../utils/productHelper';

export const getPopularProducts = async () => {
  try {
    const response = await API.get('/products/popular-products');
    const productsWithImages = await Promise.all(
      response.data.data.map(async (product) => {
        const imageUrl = await fetchImgFromFireStorage(product.image);
        return {
          ...product,
          image: imageUrl,
        };
      })
    );
    return productsWithImages;
  } catch (error) {
    console.error('상품 목록 조회 실패:', error);
  }
};

export const getNewProducts = async () => {
  try {
    const response = await API.get('/products/new-products');
    const productsWithImages = await Promise.all(
      response.data.data.map(async (product) => {
        const imageUrl = await fetchImgFromFireStorage(product.image);
        return {
          ...product,
          image: imageUrl,
        };
      })
    );
    return productsWithImages;
  } catch (error) {
    console.error('새로운 상품 조회 실패:', error);
  }
};
