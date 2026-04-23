"use client";

import { useState, useMemo, useEffect } from "react";
import { BUNDLES, NETWORKS, Bundle, Network } from "@/lib/bundles";
import { formatGHS, validateGhanaPhone, normalizePhone, cn } from "@/lib/utils";
import { CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

// Load Paystack's inline script on demand. The npm @paystack/inline-js touches
// `window` at module top level, which breaks SSR, so we load the CDN script
// at runtime instead.
const PAYSTACK_SRC = "https://js.paystack.co/v2/inline.js";
let paystackLoader: Promise<any> | null = null;
function loadPaystack(): Promise<any> {
  if (typeof window === "undefined") return Promise.reject(new Error("no window"));
  if ((window as any).PaystackPop) return Promise.resolve((window as any).PaystackPop);
  if (paystackLoader) return paystackLoader;
  paystackLoader = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${PAYSTACK_SRC}"]`) as HTMLScriptElement | null;
    const script = existing ?? document.createElement("script");
    if (!existing) {
      script.src = PAYSTACK_SRC;
      script.async = true;
      document.head.appendChild(script);
    }
    script.addEventListener("load", () => resolve((window as any).PaystackPop));
    script.addEventListener("error", () => { paystackLoader = null; reject(new Error("paystack load failed")); });
    if ((window as any).PaystackPop) resolve((window as any).PaystackPop);
  });
  return paystackLoader;
}

// ─── CHECKOUT MODAL ─────────────────────────────────────────────────────────

function CheckoutModal({
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

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) onClose();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [loading, onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !loading) onClose();
  };

  const handlePay = async () => {
    if (!isValid) { setError("Enter a valid Ghana phone number."); return; }
    setLoading(true);
    setError("");

    try {
      const PaystackPop = await loadPaystack();
      const paystack = new PaystackPop();

      paystack.newTransaction({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "pk_test_xxxx",
        email: `${normalizePhone(phone)}@c7data.store`,
        amount: Math.round(bundle.price * 100),
        currency: "GHS",
        reference: `C7-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
        metadata: {
          custom_fields: [
            { display_name: "Bundle", variable_name: "bundle_id", value: bundle.id },
            { display_name: "Phone", variable_name: "phone", value: normalizePhone(phone) },
          ],
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
          })
            .then(() => { setSuccess(true); setLoading(false); })
            .catch(() => { setError("Payment received but processing failed."); setLoading(false); });
        },
        onCancel: () => setLoading(false),
      });
    } catch {
      setError("Payment system failed to load.");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div
        onClick={handleBackdropClick}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-ink/10 backdrop-blur-sm p-0 sm:p-4"
      >
        <div className="bg-paper w-full sm:max-w-md p-8 sm:border sm:border-ink flex flex-col items-center justify-center text-center">
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
      <div className="bg-paper w-full sm:max-w-md p-6 sm:p-8 sm:border sm:border-ink relative flex flex-col">
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
              "w-full px-4 py-4 text-[16px] text-ink bg-transparent border outline-none transition-colors placeholder:text-ink-muted",
              error ? "border-red" : (isValid ? "border-accent focus:border-accent" : "border-ink-faint focus:border-ink")
            )}
          />
          {phone && isValid && !error && (
            <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-accent" />
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

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

const NETWORK_ACTIVE_STYLES: Record<Network, { border: string; color: string; bg: string }> = {
  MTN: { border: "#FFCC00", color: "#8A6200", bg: "rgba(255, 204, 0, 0.08)" },
  Telecel: { border: "#E30613", color: "#C0000F", bg: "rgba(227, 6, 19, 0.06)" },
  AT: { border: "#0073BE", color: "#005A96", bg: "rgba(0, 115, 190, 0.06)" },
};

export default function HomePage() {
  const [activeNetwork, setActiveNetwork] = useState<Network>("MTN");
  const [selectedBundle, setSelectedBundle] = useState<Bundle | null>(null);

  useEffect(() => {
    console.log("[c7] HomePage hydrated");
  }, []);

  const filtered = useMemo(
    () => BUNDLES.filter((b) => b.network === activeNetwork),
    [activeNetwork]
  );

  return (
    <>
      <div className="min-h-screen flex flex-col bg-paper font-body text-ink selection:bg-ink selection:text-paper">
        <header className="h-[52px] sticky top-0 bg-paper/90 backdrop-blur z-40 border-b border-ink-faint">
          <div className="max-w-[720px] mx-auto px-6 h-full flex items-center justify-between">
            <Link href="/" className="font-display font-[900] text-[18px] tracking-[-0.03em] text-ink">
              C7 DATA
            </Link>
            <Link href="/orders" className="text-[12px] font-medium uppercase tracking-[1.5px] text-ink hover:text-ink-muted transition-colors">
              ORDERS
            </Link>
          </div>
        </header>

        <main className="max-w-[720px] mx-auto w-full px-6 flex-1">
          <section className="pt-20 sm:pt-24 pb-16 flex flex-col items-start text-left">
            <h1 className="font-display font-[900] text-[clamp(44px,8vw,64px)] leading-[1.05] tracking-[-0.03em] text-ink">
              Data bundles,<br className="sm:hidden" /> delivered.
            </h1>
            <p className="mt-4 sm:mt-6 text-[15px] sm:text-[16px] font-normal text-ink-muted max-w-md">
              MTN, Telecel, and AirtelTigo. Instant fulfillment straight to your device.
            </p>
          </section>

          <div className="flex justify-start gap-8 mb-8">
            {NETWORKS.map((net) => {
              const isActive = activeNetwork === net.id;
              const activeStyle = isActive ? NETWORK_ACTIVE_STYLES[net.id] : undefined;

              return (
                <button
                  key={net.id}
                  onClick={() => setActiveNetwork(net.id)}
                  className={cn(
                    "px-4 py-2 text-[12px] tracking-[1.5px] uppercase transition-colors outline-none border-b-[2.5px]",
                    isActive
                      ? "font-[700]"
                      : "text-ink-muted hover:text-ink border-transparent font-medium bg-transparent"
                  )}
                  style={isActive ? {
                    color: activeStyle!.color,
                    borderBottomColor: activeStyle!.border,
                    backgroundColor: activeStyle!.bg,
                  } : undefined}
                >
                  {net.label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col border-t border-ink-faint">
            {filtered.map((bundle) => (
              <button
                type="button"
                key={bundle.id}
                onClick={() => setSelectedBundle(bundle)}
                className="group grid grid-cols-[1fr_auto_32px] items-center gap-4 py-5 sm:py-6 min-h-[64px] cursor-pointer border-b border-ink-faint hover:bg-paper-off transition-colors px-0 sm:px-4 sm:-mx-4 text-left w-full bg-transparent"
              >
                <div className="flex flex-col text-left justify-center">
                  {bundle.popular && (
                    <span className="self-start text-[9px] font-bold leading-[1] uppercase tracking-[1px] border border-accent text-accent px-1.5 py-0.5 mb-2 rounded-none">
                      Popular
                    </span>
                  )}
                  <div className="font-display font-[900] text-[28px] sm:text-[32px] tracking-[-0.03em] leading-[1] text-ink">
                    {bundle.data}
                  </div>
                </div>

                <div className="text-right font-display font-[700] text-[16px] text-ink">
                  {formatGHS(bundle.price)}
                </div>

                <div className="w-8 h-8 flex items-center justify-center transition-colors border border-ink-faint group-hover:bg-accent group-hover:border-accent text-ink group-hover:text-paper">
                  <ArrowRight className="w-4 h-4 transition-colors" />
                </div>
              </button>
            ))}
          </div>

          <div className="border-t border-ink-faint mt-2 py-6 text-center">
            <p className="text-[11px] text-ink-muted tracking-[0.06em]">
              Instant delivery · MoMo & card accepted · Secured by Paystack
            </p>
          </div>
        </main>

        <footer className="py-12 mt-12 text-center text-[11px] font-medium uppercase tracking-[1px] text-ink-muted">
          &copy; C7 Data, All rights reserved
        </footer>
      </div>

      {selectedBundle && (
        <CheckoutModal
          bundle={selectedBundle}
          onClose={() => setSelectedBundle(null)}
        />
      )}
    </>
  );
}
