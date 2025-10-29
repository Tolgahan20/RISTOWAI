'use client';

import React from 'react';
import Link from 'next/link';
import styles from './button.module.css';

interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  href?: string;
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  onClick?: () => void;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLAnchorElement | HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'medium',
  href,
  className = '',
  icon,
  iconPosition = 'right',
  onClick,
  children,
}, ref) => {
  const buttonClasses = [
    styles.button,
    styles[variant],
    size !== 'medium' && styles[size],
    icon && styles[`icon${iconPosition.charAt(0).toUpperCase() + iconPosition.slice(1)}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      {iconPosition === 'left' && icon}
      <div className={styles.buttonInner}>
        <span className={styles.buttonText} data-hover={children}>
          {children}
        </span>
      </div>
      {iconPosition === 'right' && icon}
    </>
  );

  if (href) {
    return (
      <Link href={href as any} className={buttonClasses} ref={ref as React.Ref<HTMLAnchorElement>}>
        {content}
      </Link>
    );
  }

  return (
    <button className={buttonClasses} onClick={onClick} ref={ref as React.Ref<HTMLButtonElement>}>
      {content}
    </button>
  );
});

Button.displayName = 'Button';