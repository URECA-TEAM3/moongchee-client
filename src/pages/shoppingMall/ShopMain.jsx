import React, { useEffect, useState } from 'react';
import Category from '../../components/shop/Category';
import ItemBox from '../../components/shop/ItemBox';
import axios from 'axios';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import firebaseApp from '../../utils/firebaseConfig'; // Firebase 초기화된 앱 불러오기

const ShopMain = () => {
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [products, setProducts] = useState([]);

  // 모든 상품 조회
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/products');
      const productsWithImages = await Promise.all(
        response.data.data.map(async (product) => {
          const imageUrl = await fetchImgFromFireStorage(product.image); // 이미지 URL 가져오기
          return {
            ...product,
            image: imageUrl, // URL로 업데이트
          };
        })
      );
      setProducts(productsWithImages);
    } catch (error) {
      console.error('상품 목록 조회 실패:', error);
    }
  };

  const fetchImgFromFireStorage = async (img) => {
    const storage = getStorage(firebaseApp);
    try {
      const url = await getDownloadURL(ref(storage, img)); // 다운로드 URL 얻기
      return url; // 직접 URL 반환
    } catch (error) {
      console.error('Error loading image:', error);
      throw new Error('이미지 로드 중 오류가 발생했습니다.'); // 사용자에게 에러 메시지 반환
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // selectedCategory와 일치하는 아이템만 필터링
  const filteredItems = selectedCategory === 0 ? products : products.filter((product) => product.category_id === selectedCategory);

  return (
    <div>
      <Category selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />

      <div className="m-5">정렬구현예정</div>

      <div className="grid grid-cols-2 gap-5 mx-10 max-h-[90vh] overflow-y-scroll">
        {filteredItems.map((item) => (
          <ItemBox item={item} key={item.id} />
        ))}
      </div>
    </div>
  );
};

export default ShopMain;
