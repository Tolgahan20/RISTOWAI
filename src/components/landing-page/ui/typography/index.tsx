'use client';

import React from 'react';
import styles from './typography.module.css';

interface TypographyProps {
  variant?: 'display' | 'h1' | 'h2' | 'subtitle1' | 'subtitle2' | 'body1' | 'body2';
  component?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  className?: string;
  children: React.ReactNode;
}

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body1',
  component: Component = 'p',
  className = '',
  children,
}) => {
  return (
    <Component className={`${styles[variant]} ${className}`}>
      {children}
    </Component>
  );
};
