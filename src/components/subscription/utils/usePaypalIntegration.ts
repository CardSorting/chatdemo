import { useEffect, useState, useCallback } from 'react';

// Declare paypal object on window
declare global {
  interface Window {
    paypal: any;
  }
}

const usePaypalIntegration = (containerRef: React.RefObject<HTMLDivElement>) => {
  const [paypalSdkLoaded, setPaypalSdkLoaded] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState('10.00');

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
    if (!paypalSdkLoaded || !containerRef.current) return;

    // Clear existing buttons
    containerRef.current.innerHTML = '';

    window.paypal
      .Buttons({
        style: {
          shape: "rect",
          layout: "vertical",
        },
        createOrder(data: any, actions: any) {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: selectedAmount
              }
            }]
          });
        },
        onApprove(data: any, actions: any) {
          return actions.order.capture().then(function(details: any) {
            console.log('Payment approved:', details);
            // Handle payment approval
          });
        },
        onError(err: any) {
          console.error('PayPal error:', err);
        }
      })
      .render(containerRef.current);
  }, [paypalSdkLoaded, containerRef, selectedAmount]);

  // Reinitialize button when amount changes
  useEffect(() => {
    if (paypalSdkLoaded) {
      initializePayPalButton();
    }
  }, [paypalSdkLoaded, selectedAmount, initializePayPalButton]);

  const updateSelectedAmount = (amount: string) => {
    setSelectedAmount(amount);
  };

  return { initializePayPalButton, updateSelectedAmount };
};

export default usePaypalIntegration;