import { useEffect, useState } from 'react';
import { useIsElementInViewport } from './useIsElementInViewport';

export const useIsImgLoaded = (lazy) => {
  const { elementRef, isVisible } = useIsElementInViewport({
    rootMargin: '0px 0px 600px 0px',
    threshold: 0.1,
  });
  const [isLoaded, setIsLoaded] = useState(!lazy);

  useEffect(() => {
    if (isLoaded || !isVisible) {
      return;
    }

    setIsLoaded(true);
  }, [isVisible, isLoaded]);

  return { elementRef, isLoaded };
};
