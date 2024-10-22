import React, { useEffect, useState } from 'react';
import Category from '../../components/shop/Category';
import ItemBox from '../../components/shop/ItemBox';
import axios from 'axios';

const ShopMain = () => {
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [products, setProducts] = useState([]);

  // 상품 목록을 가져오는 함수
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/products');
      setProducts(response.data.data);
    } catch (error) {
      console.error('상품 목록 조회 실패:', error);
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
