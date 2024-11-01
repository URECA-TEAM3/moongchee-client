import React, { useEffect } from 'react';
import { useCountStore } from './store/count';
import { useUserStore } from './store/user';

const TestCount01 = () => {
  const { id, name, email } = useUserStore((state) => state);

  const count = useCountStore((state) => state.count);
  const increase = useCountStore((state) => state.increase); // 액션 가져오기
  const decrease = useCountStore((state) => state.decrease); // 액션 가져오기

  useEffect(() => {
    console.log('userData: ', id, name, email); // count가 업데이트될 때마다 로그
  }, [count]);

  return (
    <div>
      <div>
        <h2>Count: {count}</h2>
        <button
          className="px-3 border"
          onClick={() => {
            console.log('Increase button clicked');
            increase();
          }}
        >
          +1
        </button>
        <button
          className="px-3 border"
          onClick={() => {
            console.log('Decrease button clicked');
            decrease();
          }}
        >
          -1
        </button>
      </div>
    </div>
  );
};

export default TestCount01;
