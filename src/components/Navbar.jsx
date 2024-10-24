import React from 'react';
import { useLocation } from 'react-router-dom';
import { ShoppingCartIcon, IdentificationIcon, HomeIcon, ChatBubbleLeftEllipsisIcon, UserIcon } from '@heroicons/react/24/outline';

function Navbar(props) {
  const location = useLocation();
  const curr = location.pathname;

  return (
    <div className="bg-white border-t border-divider p-5">
      <div className="flex justify-between items-center text-sm font-medium text-text">
        <a href="/shoppingcart">
          <button type="button" href="/" className="inline-flex flex-col items-center justify-center px-5 group">
            <ShoppingCartIcon className="size-6" color={curr == '/shoppingcart' ? '#404040' : '#D9D9D9'} />
            <span>장바구니</span>
          </button>
        </a>

        <a href="/petsitter">
          <button type="button" className="inline-flex flex-col items-center justify-center px-5 group">
            <IdentificationIcon className="size-6" color={curr == '/petsitter' ? '#404040' : '#D9D9D9'} />
            <span>펫시팅</span>
          </button>
        </a>

        <a href="/main">
          <button type="button" className="inline-flex flex-col items-center justify-center px-5 group">
            <HomeIcon className="size-6" color={curr == '/main' ? '#404040' : '#D9D9D9'} />
            <span>홈</span>
          </button>
        </a>

        <a href="/chat">
          <button type="button" className="inline-flex flex-col items-center justify-center px-5 group">
            <ChatBubbleLeftEllipsisIcon className="size-6" color={curr == '/chat' ? '#404040' : '#D9D9D9'} />
            <span>채팅</span>
          </button>
        </a>

        <a href="/mypage">
          <button type="button" className="inline-flex flex-col items-center justify-center pr-5 group">
            <UserIcon className="size-6" color={curr == '/mypage' ? '#404040' : '#D9D9D9'} />
            <span>마이페이지</span>
          </button>
        </a>
      </div>
    </div>
  );
}

export default Navbar;
