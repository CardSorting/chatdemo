import { useEffect, useState, useCallback, useRef, useContext } from 'react';
import { usePulse } from '../../../hooks/usePulse';
import { useAuth } from '../../../hooks/useAuth';
import { PayPalContext } from '../../providers/PayPalProvider';

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
  const [selectedAmount, setSelectedAmount] = useState('10.00');
  const { user } = useAuth();
  const { addPulse } = usePulse(user?.id || '');
  const { isLoaded } = useContext(PayPalContext);
  const paypalButtonRef = useRef<any>(null);

  const initializePayPalButton = useCallback(
    (container: HTMLDivElement | null) => {
      if (!container || !user?.id || !isLoaded) {
        console.log('Initialization conditions not met');
        return;
      }

      // If there's already a PayPal button rendered, destroy it
      if (paypalButtonRef.current) {
        try {
          paypalButtonRef.current.close?.();
        } catch (e) {
          console.warn('Unable to close existing PayPal button instance', e);
        }
        paypalButtonRef.current = null;
      }

      // Clear existing HTML
      if (container.firstChild) {
        while (container.firstChild) {
          container.removeChild(container.firstChild);
        }
      }

      // Render new PayPal button instance
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

      paypalButtonRef.current = buttonInstance;
    },
    [selectedAmount, user, addPulse, onPaymentSuccess, onPaymentError, isLoaded]
  );

  const updateSelectedAmount = (amount: string) => {
    console.log('Updating selected amount to:', amount);
    setSelectedAmount(amount);
  };

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