import React, { useEffect, useState } from 'react';
import Category from '../../components/shop/Category';
import ItemBox from '../../components/shop/ItemBox';
import { CgSearchLoading } from 'react-icons/cg';
import { useProductStore } from '../../store/products';

const ShopMain = () => {
  const { logout, products, loadProducts, sortOption, setSortOption, loading, selectedCategory, setSelectedCategory } = useProductStore((state) => state);

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  const filteredItems = selectedCategory === 0 ? products : products.filter((product) => product.category_id === selectedCategory);

  return (
    <div className="bg-white container inline-grid h-full py-5">
      <div className="">
        <Category selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
      </div>

      {/* 카테고리별 조회 */}
      <div className="p-5 flex justify-end mr-10 text-sm">
        <select id="sort-dropdown" value={sortOption} onChange={handleSortChange} className="text-end">
          <option value="latest">최신순</option>
          <option value="popular">인기순</option>
          <option value="high-price">가격 높은순</option>
          <option value="low-price">가격 낮은순</option>
        </select>
      </div>

      <button onClick={logout}>상품 초기화</button>

      {/* 전체 상품 목룍 */}
      {loading ? (
        <div className="flex justify-center items-center">
          상품 정보 불러오는 중 ...
          <CgSearchLoading size={20} />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-5 gap-y-5 mx-10 max-h-[73vh] overflow-y-scroll">
          {filteredItems.map((item) => (
            <div key={item.id} className="border rounded-2xl p-3">
              <ItemBox item={item} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopMain;
