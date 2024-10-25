import React, { useEffect, useState } from 'react';
import Category from '../../components/shop/Category';
import ItemBox from '../../components/shop/ItemBox';
import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../firebase';
import API from '../../api/axiosInstance';

const ShopMain = () => {
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // 모든 상품 조회
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await API.get('/api/products');

      const productsWithImages = await Promise.all(
        response.data.data.map(async (product) => {
          try {
            const storageRef = ref(storage, product.image);
            const imageUrl = await getDownloadURL(storageRef);
            return {
              ...product,
              image: imageUrl, // URL로 업데이트
            };
          } catch (error) {
            console.error('상품 이미지 로드 실패:', error);
            return {
              ...product,
              image: '/default-image.png', // 기본 이미지 경로
            };
          }
        })
      );

      setProducts(productsWithImages);
    } catch (error) {
      console.error('상품 목록 조회 실패:', error);
      alert('상품 목록을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false); // 로딩 상태 해제
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
