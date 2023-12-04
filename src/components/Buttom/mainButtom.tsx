import React, { useState, useRef, FC, ButtonHTMLAttributes } from 'react';

// Define the props based on ButtonHTMLAttributes to include all native button props
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  initialVariant?: 'primary' | 'hover' | 'focused' | 'disabled';
  size?: 'small' | 'medium' | 'large';
}

const Button: FC<ButtonProps> = ({ initialVariant = 'primary', size = 'medium', children, ...props }) => {
  const [variant, setVariant] = useState(initialVariant);
  const buttonRef = useRef<HTMLButtonElement>(null);

  console.log(variant)

  // Define the base styles
  const baseStyles = 'px-4 py-2 rounded focus:outline-none text-white transition-all';
  // Conditional styles for each variant
  const variantStyles = {
    primary: 'bg-blue-500',
    hover: 'bg-blue-600',
    focused: 'bg-blue-700 ring ring-blue-300',
    disabled: 'bg-blue-300',
  };

  // Conditional styles for each size 
  const sizeStyles = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-lg',
  };

  // Compute the appropriate class names
  const classNames = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]}`;

  const mouseLeaveButtom = function(){

    if(variant !== 'disabled' && document.activeElement !== buttonRef.current){
      setVariant('primary')
    }    
  }

  return (
    <button
      {...props}
      className={classNames}
      ref={buttonRef}
      onMouseEnter={() => setVariant('hover')}
      onMouseLeave={() => mouseLeaveButtom}
      onFocus={() => setVariant('focused')}
      onBlur={() => setVariant('primary')}      
      // Disabled prop should be boolean, it's handled separately
      disabled={variant === 'disabled'}
    >
      {children}
    </button>
  );
};

export default Button;
