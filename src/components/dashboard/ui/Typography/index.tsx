import styles from './typography.module.css';

interface TypographyProps {
  variant: 'h1' | 'h2' | 'h3' | 'body' | 'small' | 'caption';
  children: React.ReactNode;
  className?: string;
  color?: 'primary' | 'secondary' | 'muted';
}

export function Typography({ 
  variant, 
  children, 
  className = '',
  color = 'primary'
}: TypographyProps) {
  const Tag = variant.startsWith('h') ? variant : 'p';
  
  return (
    <Tag className={`${styles[variant]} ${styles[color]} ${className}`}>
      {children}
    </Tag>
  );
}

