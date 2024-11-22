import { useEffect, useRef } from 'react'

export const usePreventSwipe = () => {
  const tapRef = useRef<HTMLDivElement>(null);

  function stopAllEventsPropagation(event: Event) {
    event.stopPropagation();
    event.preventDefault();
  }

  useEffect(() => {
    const element = tapRef.current;

    if (element) {
      element.addEventListener('touchmove', stopAllEventsPropagation);
    }

    return () => {
      if (element) {
         element.removeEventListener('touchmove', stopAllEventsPropagation);
      }
    };
  }, []);

  return tapRef;
};
