import React, { useEffect, useRef } from 'react';
import Category from '../../components/shop/Category';
import ItemBox from '../../components/shop/ItemBox';
import { CgSearchLoading } from 'react-icons/cg';
import { useProductStore } from '../../store/productsStore';
import ScrollToTop from '../../components/ScrollToTop';
import { useLocation } from 'react-router-dom';

const ShopMain = () => {
  const { products, loadProducts, sortOption, setSortOption, loading, selectedCategory, setSelectedCategory } = useProductStore((state) => state);
  const scrollContainerRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    loadProducts();

    if (location.pathname === '/shoppingmall/category') {
      setSelectedCategory(1);
      setSortOption('latest');
    } else {
      setSelectedCategory(0);
      setSortOption('latest');
    }

    const scrollPosition = sessionStorage.getItem('scrollPosition');
    if (scrollPosition && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = Number(scrollPosition);
      sessionStorage.removeItem('scrollPosition');
    }
  }, []);

  const handleItemClick = () => {
    if (scrollContainerRef.current) {
      sessionStorage.setItem('scrollPosition', scrollContainerRef.current.scrollTop);
    }
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);

    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);

    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const filteredItems = selectedCategory === 0 ? products : products.filter((product) => product.category_id === selectedCategory);

  return (
    <>
      <div className="bg-white container inline-grid h-full py-5 relative">
        <div className="">
          <Category selectedCategory={selectedCategory} setSelectedCategory={handleCategoryClick} />
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

        {/* 전체 상품 목룍 */}
        {loading ? (
          <div className="flex justify-center items-center">
            상품 정보 불러오는 중 ...
            <CgSearchLoading size={20} />
          </div>
        ) : (
          <div ref={scrollContainerRef} className="grid grid-cols-2 gap-x-5 gap-y-5 mx-10 max-h-[73vh] overflow-y-scroll">
            {filteredItems.map((item) => (
              <div key={item.id} className="border rounded-2xl p-3" onClick={handleItemClick}>
                <ItemBox item={item} />
              </div>
            ))}
          </div>
        )}
        <ScrollToTop scrollContainerRef={scrollContainerRef} />
      </div>
    </>
  );
};

export default ShopMain;
