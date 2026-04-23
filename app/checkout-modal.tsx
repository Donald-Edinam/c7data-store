"use client";

import { useState } from "react";
import { NETWORKS, Bundle } from "@/lib/bundles";
import { formatGHS, validateGhanaPhone, normalizePhone, cn } from "@/lib/utils";
import { CheckCircle } from "lucide-react";

export default function CheckoutModal({
  bundle,
  onClose,
}: {
  bundle: Bundle;
  onClose: () => void;
}) {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const network = NETWORKS.find((n) => n.id === bundle.network)!;
  const isValid = validateGhanaPhone(phone);

  const handlePay = async () => {
    if (!isValid) { setError("Enter a valid Ghana phone number."); return; }
    setLoading(true);
    setError("");

    try {
      const PaystackModule = await import("@paystack/inline-js");
      const Paystack = PaystackModule.default || PaystackModule;
      const paystack = new (Paystack as any)();

      paystack.newTransaction({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "pk_test_xxxx",
        email: `${normalizePhone(phone)}@c7data.store`,
        amount: Math.round(bundle.price * 100),
        currency: "GHS",
        reference: `C7-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
        metadata: {
          custom_fields: [{
            display_name: 'Bundle',
            variable_name: 'bundle_id',
            value: bundle.id,
          },
          {
            display_name: 'Phone',
            variable_name: 'phone',
            value: normalizePhone(phone),
          }]
        },
        onSuccess: (response: any) => {
          fetch("/api/orders/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              reference: response.reference,
              bundle_id: bundle.id,
              phone: normalizePhone(phone),
            }),
          }).then(() => {
            setSuccess(true);
            setLoading(false);
          }).catch(() => {
            setError("Payment received but processing failed.");
            setLoading(false);
          });
        },
        onCancel: () => setLoading(false),
      });
    } catch (e: any) {
      setError("Payment system failed to load.");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-ink/10 backdrop-blur-sm p-0 sm:p-4">
        <div className="bg-paper w-full sm:max-w-md p-8 sm:border sm:border-ink flex flex-col items-center justify-center text-center animate-fade-up">
          <CheckCircle className="w-12 h-12 text-accent mb-6" />
          <h3 className="font-display font-[900] text-[24px] tracking-[-0.03em] text-ink mb-2">Order received.</h3>
          <p className="text-[15px] text-ink-muted mb-8">
            {bundle.data} bundle is being delivered to {phone}.
          </p>
          <button
            onClick={onClose}
            className="w-full h-12 bg-ink text-paper font-display font-bold uppercase tracking-[1px] text-[14px] hover:bg-ink-mid transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-ink/10 backdrop-blur-sm p-0 sm:p-4">
      <div className="bg-paper w-full sm:max-w-md p-6 sm:p-8 sm:border sm:border-ink relative animate-fade-up flex flex-col">
        <div className="flex justify-between items-start mb-8">
          <div>
            <p className="text-[12px] font-medium uppercase tracking-[1px] text-ink-muted mb-1">
              {network.label}
            </p>
            <h3 className="font-display font-[900] text-[32px] leading-[1] tracking-[-0.03em] text-ink">
              {bundle.data}
            </h3>
          </div>
          <div className="text-right">
            <button onClick={onClose} className="text-[13px] font-medium text-ink-muted hover:text-ink tracking-[1px] uppercase mb-1">
              Cancel
            </button>
            <p className="text-[18px] font-medium text-ink">
              {formatGHS(bundle.price)}
            </p>
          </div>
        </div>

        <div className="relative mb-8">
          <input
            type="tel"
            placeholder="Recipient phone (e.g. 0244 123 456)"
            value={phone}
            onChange={(e) => { setPhone(e.target.value); setError(""); }}
            className={cn(
              "w-full px-0 py-4 text-[16px] text-ink bg-transparent border-b outline-none transition-colors placeholder:text-ink-muted",
               error ? "border-red" : (isValid ? "border-accent focus:border-accent" : "border-ink-faint focus:border-ink")
            )}
          />
          {phone && isValid && !error && (
            <CheckCircle className="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-5 text-accent" />
          )}
          {error && <p className="text-[13px] text-red mt-2">{error}</p>}
        </div>

        <button
          onClick={handlePay}
          disabled={loading || !phone}
          className="w-full h-[52px] bg-accent hover:opacity-90 transition-opacity text-paper font-display font-bold text-[14px] uppercase tracking-[1px] flex items-center justify-center disabled:bg-ink-faint disabled:text-ink-muted disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="w-5 h-5 border-2 border-paper/30 border-t-paper rounded-full animate-spin" />
          ) : (
             <>PAY {formatGHS(bundle.price)}</>
          )}
        </button>
      </div>
    </div>
  );
}
