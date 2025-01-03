import { createContext, useEffect, useRef, ReactNode } from 'react';

// Declare paypal object on window
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
  const isLoaded = useRef(false);
  const script = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    // If the PayPal SDK is already on window, assume it's loaded
    if (window.paypal) {
      isLoaded.current = true;
      return;
    }

    // Check if the SDK has already been loaded
    if (isLoaded.current) {
      return;
    }

    // Create script element
    const scriptElement = document.createElement('script');
    scriptElement.src = `https://www.paypal.com/sdk/js?client-id=${import.meta.env.VITE_PAYPAL_CLIENT_ID}`;
    scriptElement.async = true;
    scriptElement.id = 'paypal-sdk-script';
    
    // Handle script load
    const handleLoad = () => {
      isLoaded.current = true;
      console.log('PayPal SDK loaded successfully');
    };

    // Handle script error
    const handleError = () => {
      console.error('Failed to load PayPal SDK');
      if (script.current) {
        document.body.removeChild(script.current);
        script.current = null;
      }
    };

    scriptElement.addEventListener('load', handleLoad);
    scriptElement.addEventListener('error', handleError);

    // Add script to document
    document.body.appendChild(scriptElement);
    script.current = scriptElement;

    // Cleanup function
    return () => {
      // Only remove script if it hasn't loaded yet
      if (script.current && !isLoaded.current) {
        console.log('Removing unloaded PayPal SDK script');
        document.body.removeChild(script.current);
        script.current = null;
      }
    };
  }, []);

  return (
    <PayPalContext.Provider value={{ isLoaded: isLoaded.current }}>
      {children}
    </PayPalContext.Provider>
  );
};