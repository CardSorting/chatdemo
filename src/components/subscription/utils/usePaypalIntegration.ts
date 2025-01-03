import { useEffect, useRef, useState } from 'react';

// Declare paypal object on window
declare global {
  interface Window {
    paypal: any;
  }
}

const usePaypalIntegration = () => {
  const [paypalSdkLoaded, setPaypalSdkLoaded] = useState(false);
  const paypalButtonContainer = useRef(null);

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

  // Initialize PayPal buttons when SDK is loaded
  useEffect(() => {
    if (paypalSdkLoaded && paypalButtonContainer.current) {
      window.paypal
        .Buttons({
          style: {
            shape: "rect",
            layout: "vertical",
          },
          createOrder(data, actions) {
            return actions.order.create({
              purchase_units: [{
                amount: {
                  value: '10.00' // Set your desired amount here
                }
              }]
            });
          },
          onApprove(data, actions) {
            return actions.order.capture().then(function(details) {
              console.log('Payment approved:', details);
              // Handle payment approval
            });
          },
          onError(err) {
            console.error('PayPal error:', err);
          }
        })
        .render(paypalButtonContainer.current);
    }
  }, [paypalSdkLoaded]);

  return { paypalButtonContainer };
};

export default usePaypalIntegration;