import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Category = ({ selectedCategory, setSelectedCategory }) => {
  const location = useLocation();
  let showCategory = location.pathname.includes('/category');
  const categories = [
    { id: 0, name: '전체' },
    { id: 1, name: '사료' },
    { id: 2, name: '간식' },
    { id: 3, name: '장난감' },
    { id: 4, name: '용품' },
    { id: 5, name: '의류' },
    { id: 6, name: '영양제' },
  ];

  useEffect(() => {
    if (showCategory) setSelectedCategory(1);
    showCategory = false;
  }, []);

  const handleClick = (id) => {
    setSelectedCategory(id);
  };

  return (
    <div className="flex w-10/12 mx-auto items-center justify-between text-sm border-b">
      {categories.map((category) => (
        <div
          key={category.id}
          className={`w-[70px] py-2 px-2 text-center mx-auto ${selectedCategory === category.id ? 'border-b-2 border-b-primary font-bold text-primary' : ''}`}
        >
          <button onClick={() => handleClick(category.id)}>{category.name}</button>
        </div>
      ))}
    </div>
  );
};

export default Category;
