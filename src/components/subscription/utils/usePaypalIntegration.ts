import { useEffect, useState, useCallback, useRef } from 'react';
import { usePulse } from '../../../hooks/usePulse';
import { useAuth } from '../../../hooks/useAuth';

// Declare paypal object on window
declare global {
  interface Window {
    paypal?: any;
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
  onPaymentError,
}: UsePaypalIntegrationProps) => {
  const [paypalSdkLoaded, setPaypalSdkLoaded] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState('10.00');
  const { user } = useAuth();
  const { addPulse } = usePulse(user?.id || '');

  // Keep a ref to store the PayPal button instance (so we can destroy/clean it up if needed)
  const paypalButtonRef = useRef<any>(null);

  // 1) Load the PayPal SDK once, if not already present
  useEffect(() => {
    // If the PayPal SDK is already on window, assume it’s loaded.
    if (window.paypal) {
      setPaypalSdkLoaded(true);
      return;
    }

    // Otherwise, load the script once
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

    //  NO removal of the script on unmount - let it stay in the DOM
    // return () => {
    //   document.body.removeChild(script);
    // };
  }, []);

  // 2) Initialize the PayPal button when conditions are met
  const initializePayPalButton = useCallback(
    (container: HTMLDivElement | null) => {
      console.log('Attempting to initialize PayPal button...');
      console.log('PayPal SDK loaded:', paypalSdkLoaded);
      console.log('Container:', container);
      console.log('User ID:', user?.id);

      if (!paypalSdkLoaded || !container || !user?.id) {
        console.log('Initialization conditions not met');
        return;
      }

      // If there’s already a PayPal button rendered, optionally destroy it
      if (paypalButtonRef.current) {
        try {
          // Some versions of PayPal JS Buttons support .close() or .remove() / .destroy().
          // This is optional, but helps avoid double-init or memory leaks.
          paypalButtonRef.current.close?.();
        } catch (e) {
          console.warn('Unable to close existing PayPal button instance', e);
        }
        // Clear the ref
        paypalButtonRef.current = null;
      }

      console.log('All conditions met, initializing PayPal button');

      // Clear existing HTML in case it was previously rendered
      container.innerHTML = '';

      // Render a new PayPal button instance
      const buttonInstance = window.paypal
        .Buttons({
          style: {
            shape: 'rect',
            layout: 'vertical',
          },
          createOrder(data: any, actions: any) {
            console.log('Creating PayPal order');
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: selectedAmount,
                  },
                },
              ],
            });
          },
          onApprove(data: any, actions: any) {
            console.log('PayPal payment approved');
            return actions.order.capture().then(async (details: any) => {
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
          },
        })
        .render(container);

      // Store the PayPal button instance in a ref for potential later cleanup
      paypalButtonRef.current = buttonInstance;
    },
    [
      paypalSdkLoaded,
      selectedAmount,
      user,
      addPulse,
      onPaymentSuccess,
      onPaymentError,
    ]
  );

  // 3) Update the selected amount
  const updateSelectedAmount = (amount: string) => {
    console.log('Updating selected amount to:', amount);
    setSelectedAmount(amount);
  };

  // 4) Optional cleanup: if you want to destroy the button when unmounting
  useEffect(() => {
    return () => {
      if (paypalButtonRef.current) {
        try {
          paypalButtonRef.current.close?.();
        } catch (e) {
          console.warn('Unable to close PayPal button on unmount', e);
        }
      }
    };
  }, []);

  return { initializePayPalButton, updateSelectedAmount };
};

export default usePaypalIntegration;