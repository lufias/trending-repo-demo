import { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  show: boolean;
  duration?: number;
  position?: 'top' | 'bottom';
  offset?: number;
  variant?: 'default' | 'success' | 'error' | 'warning';
}

const variantStyles = {
  default: 'bg-blue-500/90 border-blue-400/50',
  success: 'bg-green-500/90 border-green-400/50',
  error: 'bg-red-500/90 border-red-400/50',
  warning: 'bg-yellow-500/90 border-yellow-400/50'
};

function Toast({ 
  message, 
  show, 
  duration = 3000,
  position = 'bottom',
  offset = 24,
  variant = 'default'
}: ToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration]);

  if (!visible) return null;

  const positionClass = position === 'top' ? `top-${offset}` : `bottom-${offset}`;

  return (
    <div className={`fixed left-1/2 transform -translate-x-1/2 z-[9999] ${positionClass}`}>
      <div className={`${variantStyles[variant]} backdrop-blur-sm text-white px-4 py-2 rounded-lg shadow-lg border`}>
        {message}
      </div>
    </div>
  );
}

export default Toast; 