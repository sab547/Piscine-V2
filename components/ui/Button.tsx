import { ReactNode } from 'react';
import clsx from 'clsx';

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  icon?: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-primary hover:bg-primary-dark text-white disabled:bg-border disabled:cursor-not-allowed',
  secondary: 'bg-surface hover:bg-border text-text disabled:bg-border disabled:cursor-not-allowed',
  success: 'bg-success hover:bg-success/90 text-white disabled:bg-border disabled:cursor-not-allowed',
  danger: 'bg-danger hover:bg-danger/90 text-white disabled:bg-border disabled:cursor-not-allowed',
  outline: 'border-2 border-primary text-primary hover:bg-primary/5 disabled:opacity-50',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'py-2 px-3 text-sm',
  md: 'py-3 px-4 text-base',
  lg: 'py-4 px-6 text-lg',
};

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  fullWidth,
  isLoading,
  icon,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'font-semibold rounded-lg transition-colors inline-flex items-center justify-center gap-2',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Chargement...
        </>
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </button>
  );
}
