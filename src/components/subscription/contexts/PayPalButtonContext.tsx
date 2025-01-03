import React, { createContext, useContext, useRef, useReducer, useEffect } from 'react';
import { PayPalService } from '../services/paypalService';

interface PayPalButtonState {
  isReady: boolean;
  error: Error | null;
}

type PayPalButtonAction =
  | { type: 'SET_READY' }
  | { type: 'SET_ERROR'; error: Error }
  | { type: 'RESET_ERROR' };

const initialState: PayPalButtonState = {
  isReady: false,
  error: null
};

function paypalButtonReducer(state: PayPalButtonState, action: PayPalButtonAction): PayPalButtonState {
  switch (action.type) {
    case 'SET_READY':
      return { ...state, isReady: true };
    case 'SET_ERROR':
      return { ...state, error: action.error };
    case 'RESET_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}

interface PayPalButtonContextType {
  isReady: boolean;
  error: Error | null;
  renderButton: (container: HTMLElement, config: {
    amount: string;
    onSuccess: (data: any) => void;
    onError: (error: Error) => void;
  }) => void;
}

const PayPalButtonContext = createContext<PayPalButtonContextType | null>(null);

export const usePayPalButton = () => {
  const context = useContext(PayPalButtonContext);
  if (!context) {
    throw new Error('usePayPalButton must be used within a PayPalButtonProvider');
  }
  return context;
};

interface PayPalButtonProviderProps {
  children: React.ReactNode;
}

export const PayPalButtonProvider: React.FC<PayPalButtonProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(paypalButtonReducer, initialState);
  const buttonInstanceRef = useRef<any>(null);
  const renderCycleRef = useRef<number>(0);

  // Initialize PayPal
  useEffect(() => {
    const checkPayPal = () => {
      if (window.paypal) {
        dispatch({ type: 'SET_READY' });
        return true;
      }
      return false;
    };

    if (!checkPayPal()) {
      const interval = setInterval(() => {
        if (checkPayPal()) {
          clearInterval(interval);
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, []);

  const renderButton = (container: HTMLElement, config: {
    amount: string;
    onSuccess: (data: any) => void;
    onError: (error: Error) => void;
  }) => {
    if (!window.paypal) return;

    const currentRenderCycle = ++renderCycleRef.current;

    // Clean up existing button if it exists
    if (buttonInstanceRef.current?.close) {
      try {
        buttonInstanceRef.current.close();
      } catch (error) {
        console.warn('PayPal cleanup warning:', error);
      }
      buttonInstanceRef.current = null;
    }

    try {
      // Create new button instance
      const buttons = PayPalService.createButton({
        ...config,
        onError: (error) => {
          if (currentRenderCycle === renderCycleRef.current) {
            dispatch({ type: 'SET_ERROR', error });
            config.onError(error);
          }
        }
      });

      if (!buttons || !buttons.isEligible()) {
        const error = new Error('PayPal buttons are not eligible for rendering');
        dispatch({ type: 'SET_ERROR', error });
        config.onError(error);
        return;
      }

      // Store button reference
      buttonInstanceRef.current = buttons;

      // Clear container and render
      container.innerHTML = '';
      buttons.render(container).catch((error: Error) => {
        if (currentRenderCycle === renderCycleRef.current) {
          dispatch({ type: 'SET_ERROR', error });
          config.onError(error);
        }
      });
    } catch (error) {
      if (currentRenderCycle === renderCycleRef.current) {
        const err = error instanceof Error ? error : new Error('Failed to create PayPal button');
        dispatch({ type: 'SET_ERROR', error: err });
        config.onError(error as Error);
      }
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (buttonInstanceRef.current?.close) {
        try {
          buttonInstanceRef.current.close();
        } catch (error) {
          console.warn('PayPal cleanup warning:', error);
        }
        buttonInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <PayPalButtonContext.Provider value={{ 
      isReady: state.isReady,
      error: state.error,
      renderButton
    }}>
      {children}
    </PayPalButtonContext.Provider>
  );
};
