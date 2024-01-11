import { useState, useEffect } from 'react';

// eslint-disable-next-line react/prop-types
const Text = ({ size, strong, children }) => {
  const [fontSize, setFontSize] = useState('');
  const [fontWeight, setFontWeight] = useState('');

  useEffect(() => {
    const updateStyles = () => {
      setFontSize(size);
      switch (strong) {
        case 'normal':
          setFontWeight('font-normal');
          break;
        case 'medium':
          setFontWeight('font-medium');
          break;

        case 'semibold':
          setFontWeight('font-semibold');
          break;

        case 'bold':
          setFontWeight('font-bold');
          break;

        default:
          break;
      }
    };

    updateStyles();
  }, [size, strong]);

  return <p className={`${fontSize} ${fontWeight}`}>{children}</p>;
};

export default Text;
