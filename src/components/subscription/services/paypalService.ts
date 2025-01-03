interface PayPalButtonConfig {
  amount: string;
  onSuccess: (data: any) => void;
  onError: (error: Error) => void;
}

interface PayPalButtonInstance {
  render: (container: HTMLElement) => Promise<void>;
  close: () => void;
  isEligible: () => boolean;
}

export class PayPalService {
  private static validatePayPal(): void {
    if (!window.paypal) {
      throw new Error('PayPal SDK not loaded');
    }
  }

  static createButton({
    amount,
    onSuccess,
    onError
  }: PayPalButtonConfig): PayPalButtonInstance | null {
    try {
      this.validatePayPal();

      const buttons = window.paypal.Buttons({
        style: {
          layout: 'vertical',
          color: 'gold',
          shape: 'rect',
          height: 55
        },
        createOrder: (_data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: amount
              }
            }]
          });
        },
        onApprove: async (_data: any, actions: any) => {
          try {
            const order = await actions.order.capture();
            if (order.status === 'COMPLETED') {
              onSuccess(order);
            }
          } catch (error) {
            onError(error as Error);
          }
        },
        onError: (err: any) => {
          console.error('PayPal error:', err);
          onError(err);
        }
      });

      return buttons;
    } catch (error) {
      console.error('Failed to create PayPal buttons:', error);
      return null;
    }
  }

  static async renderButtons(
    container: HTMLElement,
    buttons: PayPalButtonInstance
  ): Promise<void> {
    if (!buttons.isEligible()) {
      throw new Error('PayPal buttons are not eligible for rendering');
    }

    try {
      await buttons.render(container);
    } catch (error) {
      console.error('Failed to render PayPal buttons:', error);
      throw error;
    }
  }

  static cleanupButtons(buttons: PayPalButtonInstance | null): void {
    if (buttons?.close) {
      try {
        buttons.close();
      } catch (error) {
        console.warn('PayPal cleanup error:', error);
      }
    }
  }
}
