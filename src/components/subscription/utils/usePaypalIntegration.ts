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
  containerRef: React.RefObject<HTMLDivElement>;
  onPaymentSuccess: (pulseAmount: number) => void;
  onPaymentError: () => void;
}

const usePaypalIntegration = ({ 
  containerRef,
  onPaymentSuccess,
  onPaymentError
}: UsePaypalIntegrationProps) => {
  const [paypalSdkLoaded, setPaypalSdkLoaded] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState('10.00');
  const { user } = useAuth();
  const { addPulse } = usePulse(user?.id || '');

  // Load PayPal SDK
  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${import.meta.env.VITE_PAYPAL_CLIENT_ID}`;
    script.async = true;
    script.onload = () => setPaypalSdkLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Initialize or update PayPal button
  const initializePayPalButton = useCallback(() => {
    if (!paypalSdkLoaded || !containerRef.current || !user?.id) {
      console.log('PayPal initialization conditions not met');
      return;
    }

    // Clear existing buttons
    containerRef.current.innerHTML = '';

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
              
              const result = await addPulse(pulseAmount);
              console.log('Pulse addition result:', result);
              
              if (result.success) {
                console.log('Calling onPaymentSuccess with amount:', pulseAmount);
                onPaymentSuccess(pulseAmount);
              } else {
                throw new Error('Failed to add pulse: ' + result.error);
              }
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
      .render(containerRef.current);
  }, [paypalSdkLoaded, containerRef, selectedAmount, addPulse, user, onPaymentSuccess, onPaymentError]);

  // Reinitialize button when amount changes
  useEffect(() => {
    if (paypalSdkLoaded && user?.id) {
      console.log('Reinitializing PayPal button');
      initializePayPalButton();
    }
  }, [paypalSdkLoaded, selectedAmount, initializePayPalButton, user]);

  const updateSelectedAmount = (amount: string) => {
    console.log('Updating selected amount to:', amount);
    setSelectedAmount(amount);
  };

  return { initializePayPalButton, updateSelectedAmount };
};

export default usePaypalIntegration;