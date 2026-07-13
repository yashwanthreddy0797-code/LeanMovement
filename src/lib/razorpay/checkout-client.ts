/** Shared Razorpay Checkout.js helpers (browser only). */

export type RazorpayHandlerResponse = {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_subscription_id?: string;
  razorpay_signature: string;
};

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, handler: (response: { error: { description: string } }) => void) => void;
    };
  }
}

export async function loadRazorpayScript() {
  if (typeof window === "undefined") return false;
  if (window.Razorpay) return true;
  await new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Could not load Razorpay"));
    document.body.appendChild(script);
  });
  return Boolean(window.Razorpay);
}

export async function openRazorpayCheckout(options: {
  key: string;
  amount?: number;
  currency?: string;
  name: string;
  description: string;
  order_id?: string;
  subscription_id?: string;
  prefill?: { email?: string; name?: string; contact?: string };
  theme?: { color?: string };
  onSuccess: (response: RazorpayHandlerResponse) => void | Promise<void>;
  onDismiss?: () => void;
}) {
  const loaded = await loadRazorpayScript();
  if (!loaded || !window.Razorpay) throw new Error("Could not load Razorpay checkout");

  const { onSuccess, onDismiss, ...rest } = options;

  return new Promise<void>((resolve, reject) => {
    const rzp = new window.Razorpay!({
      ...rest,
      handler: async (response: RazorpayHandlerResponse) => {
        try {
          await onSuccess(response);
          resolve();
        } catch (err) {
          reject(err);
        }
      },
      modal: {
        ondismiss: () => {
          onDismiss?.();
          reject(new Error("Payment cancelled"));
        },
      },
    });

    rzp.on("payment.failed", (response) => {
      reject(new Error(response.error.description || "Payment failed"));
    });

    rzp.open();
  });
}
