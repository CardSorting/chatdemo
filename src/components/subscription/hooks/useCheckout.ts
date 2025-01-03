import { useState } from 'react';
import { usePulse } from '../../../hooks/usePulse';
import { useAuth } from '../../../hooks/useAuth';

interface CheckoutState {
  isProcessing: boolean;
  error: string | null;
  showSuccess: boolean;
}

interface UseCheckoutProps {
  pulseAmount: number;
  onSuccess: (amount: number) => void;
}

export const useCheckout = ({ pulseAmount, onSuccess }: UseCheckoutProps) => {
  const [state, setState] = useState<CheckoutState>({
    isProcessing: false,
    error: null,
    showSuccess: false
  });

  const { user } = useAuth();
  const { addPulse } = usePulse(user?.id || '');

  const handlePaymentSuccess = async (order: any) => {
    setState(prev => ({ ...prev, isProcessing: true, error: null }));
    
    try {
      await addPulse(pulseAmount);
      setState(prev => ({ ...prev, showSuccess: true }));
      onSuccess(pulseAmount);
      
      // Reset success state after delay
      setTimeout(() => {
        setState(prev => ({ ...prev, showSuccess: false }));
      }, 5000);
    } catch (error) {
      console.error('Failed to process payment:', error);
      setState(prev => ({ 
        ...prev, 
        error: 'Failed to process payment. Please try again.' 
      }));
    } finally {
      setState(prev => ({ ...prev, isProcessing: false }));
    }
  };

  const handlePaymentError = (error: Error) => {
    console.error('Payment error:', error);
    setState(prev => ({ 
      ...prev,
      error: error.message || 'Payment processing error',
      isProcessing: false
    }));
  };

  const resetError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  return {
    ...state,
    handlePaymentSuccess,
    handlePaymentError,
    resetError
  };
};
