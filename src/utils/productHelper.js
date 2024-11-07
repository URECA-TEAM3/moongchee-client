import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { app } from '../../firebase';

export const fetchImgFromFireStorage = async (img) => {
  const storage = getStorage(app);
  try {
    const url = await getDownloadURL(ref(storage, img));
    return url;
  } catch (error) {
    console.error('Error loading image:', error);
    throw new Error('이미지 로드 중 오류가 발생했습니다.');
  }
};

export const generateRandomString = () => {
  return window.btoa(Math.random().toString()).slice(0, 20);
};
