import React from 'react';

function Header(props) {
  return (
    <div className="flex justify-between bg-white h-16 p-3 items-center border-b border-divider">
      <a href="/main">
        <img src="src/assets/images/black-horizontal.png" alt="logo" className="h-16 p-2" />
      </a>

      <button>
        {' '}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
          />
        </svg>
      </button>
    </div>
  );
}

export default Header;
