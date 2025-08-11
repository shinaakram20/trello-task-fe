import { Loader2 } from 'lucide-react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export function Loading({ size = 'md', text, className = '' }: LoadingProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin text-gray-500`} />
      {text && <span className="ml-2 text-sm text-gray-500">{text}</span>}
    </div>
  );
}

export function LoadingSpinner({ size = 'md', className = '' }: Omit<LoadingProps, 'text'>) {
  return <Loading size={size} className={className} />;
}

export function LoadingPage({ text = 'Loading...' }: Pick<LoadingProps, 'text'>) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loading size="lg" text={text} />
    </div>
  );
}
