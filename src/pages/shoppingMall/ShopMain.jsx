import React, { useState } from 'react';
import Category from '../../components/shop/Category';
import ItemBox from '../../components/shop/ItemBox';

const ShopMain = () => {
  const [selectedCategory, setSelectedCategory] = useState(0);
  const items = [
    {
      id: 1,
      name: 'Premium Dog Food',
      price: 29900,
      category: 1,
    },
    {
      id: 2,
      name: 'Cat Toy - Feather Wand',
      price: 12000,
      category: 3,
    },
    {
      id: 3,
      name: 'Healthy Cat Snack',
      price: 8000,
      category: 2,
    },
    {
      id: 4,
      name: 'Dog Clothes - Sweater',
      price: 45000,
      category: 5,
    },
    {
      id: 5,
      name: 'Nutritional Supplement for Pets',
      price: 15000,
      category: 6,
    },
    {
      id: 6,
      name: 'Pet Toy - Ball',
      price: 7000,
      category: 3,
    },
    {
      id: 7,
      name: 'Dog Snack - Beef Jerky',
      price: 10000,
      category: 2,
    },
    {
      id: 8,
      name: 'Cat Food - Salmon',
      price: 25000,
      category: 1,
    },
  ];

  // selectedCategory와 일치하는 아이템만 필터링
  const filteredItems = selectedCategory === 0 ? items : items.filter((item) => item.category === selectedCategory);
  return (
    <div>
      <Category selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />

      <div className="grid grid-cols-2 gap-5 m-10">
        {filteredItems.map((item) => (
          <ItemBox key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default ShopMain;
