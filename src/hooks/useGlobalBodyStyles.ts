import { useEffect } from 'react';

export const useGlobalBodyStyles = () => {
  useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.backgroundColor = '#000E1C';
    document.body.style.color = '#FAFAFA';
    document.body.style.fontFamily =
      '"Space Grotesk", "Inter", "Helvetica Neue", Arial, sans-serif';
    document.body.style.minHeight = '100vh';

    return () => {
      document.body.removeAttribute('style');
    };
  }, []);
};
