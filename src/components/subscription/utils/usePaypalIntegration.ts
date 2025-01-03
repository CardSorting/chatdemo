import { useEffect, useState, useCallback } from 'react';
import { usePulse } from '../../../hooks/usePulse';
import { useAuth } from '../../../hooks/useAuth';

// Declare paypal object on window
declare global {
  interface Window {
    paypal: any;
  }
}

interface UsePaypalIntegrationProps {
  onPaymentSuccess: (pulseAmount: number) => void;
  onPaymentError: () => void;
}

interface AddPulseResponse {
  success: boolean;
  error?: string;
  newBalance?: number;
}

const usePaypalIntegration = ({ 
  onPaymentSuccess,
  onPaymentError
}: UsePaypalIntegrationProps) => {
  const [paypalSdkLoaded, setPaypalSdkLoaded] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState('10.00');
  const { user } = useAuth();
  const { addPulse } = usePulse(user?.id || '');

  // Load PayPal SDK
  useEffect(() => {
    console.log('Loading PayPal SDK...');
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${import.meta.env.VITE_PAYPAL_CLIENT_ID}`;
    script.async = true;
    script.onload = () => {
      console.log('PayPal SDK loaded successfully');
      setPaypalSdkLoaded(true);
    };
    script.onerror = () => {
      console.error('Failed to load PayPal SDK');
      setPaypalSdkLoaded(false);
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const initializePayPalButton = useCallback((container: HTMLDivElement | null) => {
    console.log('Attempting to initialize PayPal button...');
    console.log('PayPal SDK loaded:', paypalSdkLoaded);
    console.log('Container:', container);
    console.log('User ID:', user?.id);

    if (!paypalSdkLoaded || !container || !user?.id) {
      console.log('Initialization conditions not met');
      return;
    }

    console.log('All conditions met, initializing PayPal button');
    
    // Clear existing buttons
    container.innerHTML = '';

    window.paypal
      .Buttons({
        style: {
          shape: "rect",
          layout: "vertical",
        },
        createOrder(data: any, actions: any) {
          console.log('Creating PayPal order');
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: selectedAmount
              }
            }]
          });
        },
        onApprove(data: any, actions: any) {
          console.log('PayPal payment approved');
          return actions.order.capture().then(async function(details: any) {
            console.log('Payment captured:', details);
            
            try {
              // Add Pulse credits based on payment amount
              const pulseAmount = parseFloat(selectedAmount) * 100;
              console.log('Attempting to add pulse:', pulseAmount, 'to user:', user.id);
              
              const result: AddPulseResponse = await addPulse(pulseAmount);
              console.log('Pulse addition result:', result);
              
              if (!result.success) {
                throw new Error(result.error || 'Failed to add pulse');
              }

              console.log('Calling onPaymentSuccess with amount:', pulseAmount);
              onPaymentSuccess(pulseAmount);
            } catch (error) {
              console.error('Payment processing error:', error);
              onPaymentError();
            }
          });
        },
        onError(err: any) {
          console.error('PayPal error:', err);
          onPaymentError();
        }
      })
      .render(container);
  }, [paypalSdkLoaded, selectedAmount, addPulse, user, onPaymentSuccess, onPaymentError]);

  const updateSelectedAmount = (amount: string) => {
    console.log('Updating selected amount to:', amount);
    setSelectedAmount(amount);
  };

  return { initializePayPalButton, updateSelectedAmount };
};

export default usePaypalIntegration;