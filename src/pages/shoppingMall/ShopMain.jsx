import React, { useEffect, useState } from 'react';
import Category from '../../components/shop/Category';
import ItemBox from '../../components/shop/ItemBox';
import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../firebase';
import API from '../../api/axiosInstance';
import { CgSearchLoading } from 'react-icons/cg';

const ShopMain = (props) => {
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortOption, setSortOption] = useState('latest'); // 기본값을 최신순으로 설정

  const handleSortChange = (event) => {
    const option = event.target.value;
    setSortOption(option);
    const sortedProducts = sortProducts(products, option);
    setProducts(sortedProducts);
  };

  const sortProducts = (products, option) => {
    const sortedProducts = [...products];

    if (option === 'latest') {
      sortedProducts.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    } else if (option === 'popular') {
      sortedProducts.sort((a, b) => b.sales - a.sales);
    } else if (option === 'high-price') {
      sortedProducts.sort((a, b) => b.price - a.price);
    } else {
      sortedProducts.sort((a, b) => a.price - b.price);
    }

    return sortedProducts;
  };

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
            return product;
          }
        })
      );

      setProducts(productsWithImages);
      const sortedProducts = sortProducts(productsWithImages, sortOption);
      setProducts(sortedProducts);
    } catch (error) {
      console.error('상품 목록 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredItems = selectedCategory === 0 ? products : products.filter((product) => product.category_id === selectedCategory);

  return (
    <div className="bg-white container inline-grid h-full py-5">
      <Category selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
      {/* 카테고리별 조회 */}
      <div className="p-5 flex justify-end mr-10 text-sm">
        <select id="sort-dropdown" value={sortOption} onChange={handleSortChange} className="text-end">
          <option value="latest">최신순</option>
          <option value="popular">인기순</option>
          <option value="high-price">가격 높은순</option>
          <option value="low-price">가격 낮은순</option>
        </select>
      </div>

      {/* 전체 상품 목룍 */}
      {loading ? (
        <div className="flex justify-center items-center">
          상품 정보 불러오는 중 ...
          <CgSearchLoading size={20} />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-5 mx-10 max-h-[71vh] overflow-y-scroll">
          {filteredItems.map((item) => (
            <div className="border rounded-2xl p-3" key={item.id}>
              <ItemBox item={item} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopMain;
