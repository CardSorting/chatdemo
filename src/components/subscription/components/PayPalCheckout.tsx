import React, { useEffect, useRef } from 'react';
import { usePayPalButton } from '../contexts/PayPalButtonContext';

interface PayPalCheckoutProps {
  amount: string;
  onSuccess: (data: any) => void;
  onError?: (error: any) => void;
}

export const PayPalCheckout: React.FC<PayPalCheckoutProps> = ({
  amount,
  onSuccess,
  onError
}) => {
  const { renderButton, isReady, error } = usePayPalButton();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isReady || !containerRef.current) return;

    renderButton(containerRef.current, {
      amount,
      onSuccess,
      onError: (error) => {
        console.error('PayPal error:', error);
        onError?.(error);
      }
    });
  }, [isReady, amount, onSuccess, onError, renderButton]);

  if (!isReady || error) {
    return (
      <div className="flex items-center justify-center h-[150px] bg-white/5 rounded-lg">
        {error ? (
          <div className="text-red-500 text-sm text-center px-4">
            {error.message}
          </div>
        ) : (
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        )}
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="min-h-[150px] bg-white/5 rounded-lg p-4"
    />
  );
};
