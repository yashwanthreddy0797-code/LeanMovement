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

let scriptPromise: Promise<boolean> | null = null;

/** Prefetch Checkout.js as soon as the join/pay page mounts. */
export function preloadRazorpayScript() {
  if (typeof window === "undefined") return;
  void loadRazorpayScript();
}

export async function loadRazorpayScript() {
  if (typeof window === "undefined") return false;
  if (window.Razorpay) return true;
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<boolean>((resolve) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]',
    );
    if (existing) {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      existing.addEventListener("load", () => resolve(Boolean(window.Razorpay)));
      existing.addEventListener("error", () => {
        scriptPromise = null;
        resolve(false);
      });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(Boolean(window.Razorpay));
    script.onerror = () => {
      scriptPromise = null;
      resolve(false);
    };
    document.body.appendChild(script);
  });

  return scriptPromise;
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
