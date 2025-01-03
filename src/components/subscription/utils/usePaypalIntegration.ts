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
    script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.VITE_PAYPAL_CLIENT_ID}`;
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
          async createSubscription() {
            try {
              const response = await fetch("/api/paypal/create-subscription", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ userAction: "SUBSCRIBE_NOW" }),
              });
              const data = await response.json();
              if (data?.id) {
                resultMessage(`Successful subscription...<br><br>`);
                return data.id;
              } else {
                console.error(
                  { callback: "createSubscription", serverResponse: data },
                  JSON.stringify(data, null, 2),
                );
                const errorDetail = data?.details?.[0];
                resultMessage(
                  `Could not initiate PayPal Subscription...<br><br>${
                    errorDetail?.issue || ""
                  } ${errorDetail?.description || data?.message || ""} ` +
                    (data?.debug_id ? `(${data.debug_id})` : ""),
                );
              }
            } catch (error) {
              console.error(error);
              resultMessage(
                `Could not initiate PayPal Subscription...<br><br>${error}`,
              );
            }
          },
          onApprove(data) {
            if (data.orderID) {
              resultMessage(
                `You have successfully subscribed to the plan. Your subscription id is: ${data.subscriptionID}`,
              );
            } else {
              resultMessage(
                `Failed to activate the subscription: ${data.subscriptionID}`,
              );
            }
          },
        })
        .render(paypalButtonContainer.current);
    }
  }, [paypalSdkLoaded]);

  const resultMessage = (message: string) => {
    const container = document.querySelector("#result-message");
    if (container) {
      container.innerHTML = message;
    }
  };

  return { paypalButtonContainer };
};

export default usePaypalIntegration;