import React from 'react';
import { useLocation } from 'react-router-dom';

const index = () => {
  const location = useLocation();
  const { info } = location.state || {};

  console.log(info);

  return <div>hi</div>;
};

export default index;
