import { createContext, useEffect, useState, ReactNode } from 'react';

declare global {
  interface Window {
    paypal?: any;
  }
}

interface PayPalContextType {
  isLoaded: boolean;
}

export const PayPalContext = createContext<PayPalContextType>({
  isLoaded: false,
});

export const PayPalProvider = ({ children }: { children: ReactNode }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
    if (!clientId) {
      console.error('PayPalProvider: Missing VITE_PAYPAL_CLIENT_ID environment variable');
      return;
    }

    // Only load script if it doesn't exist
    if (!document.getElementById('paypal-sdk-script')) {
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&intent=capture`;
      script.id = 'paypal-sdk-script';
      script.async = true;

      script.onload = () => {
        if (window.paypal) {
          setIsLoaded(true);
        }
      };

      script.onerror = () => {
        console.error('Failed to load PayPal SDK');
        setIsLoaded(false);
      };

      document.body.appendChild(script);
    } else if (window.paypal) {
      // If script exists and PayPal is loaded, set state
      setIsLoaded(true);
    }

    // No cleanup needed - let the script persist
  }, []);

  return (
    <PayPalContext.Provider value={{ isLoaded }}>
      {children}
    </PayPalContext.Provider>
  );
};
