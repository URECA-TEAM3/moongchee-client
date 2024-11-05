import React from 'react';
import Notification from './notifications/Notification';



function Header(props) {
  return (
    <div className="flex justify-between bg-white h-16 p-3 items-center border-b border-divider">
      <a href="/main">
        <img src="src/assets/images/black-horizontal.png" alt="logo" className="h-16 p-2" />
      </a>

      <Notification />
    </div>
  );
}

export default Header;