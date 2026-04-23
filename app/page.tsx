"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { BUNDLES, NETWORKS, Bundle, Network } from "@/lib/bundles";
import { formatGHS, cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

// Paystack's inline-js touches `window` at module top level, so keep the modal
// out of the server bundle.
const CheckoutModal = dynamic(() => import("./checkout-modal"), { ssr: false });

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

const NETWORK_ACTIVE_STYLES: Record<Network, { border: string; color: string; bg: string }> = {
  MTN: { border: "#FFCC00", color: "#8A6200", bg: "rgba(255, 204, 0, 0.08)" },
  Telecel: { border: "#E30613", color: "#C0000F", bg: "rgba(227, 6, 19, 0.06)" },
  AT: { border: "#0073BE", color: "#005A96", bg: "rgba(0, 115, 190, 0.06)" },
};

export default function HomePage() {
  const [activeNetwork, setActiveNetwork] = useState<Network>("MTN");
  const [selectedBundle, setSelectedBundle] = useState<Bundle | null>(null);

  const filtered = useMemo(
    () => BUNDLES.filter((b) => b.network === activeNetwork),
    [activeNetwork]
  );

  return (
    <>
      <div className="min-h-screen flex flex-col bg-paper font-body text-ink selection:bg-ink selection:text-paper">
        {/* ── HEADER ── */}
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
          {/* ── HERO ── */}
          <section className="pt-20 sm:pt-24 pb-16 flex flex-col items-start text-left">
            <h1 className="font-display font-[900] text-[clamp(44px,8vw,64px)] leading-[1.05] tracking-[-0.03em] text-ink animate-fade-up">
              Data bundles,<br className="sm:hidden" /> delivered.
            </h1>
            <p className="mt-4 sm:mt-6 text-[15px] sm:text-[16px] font-normal text-ink-muted max-w-md animate-fade-up stagger-1">
              MTN, Telecel, and AirtelTigo. Instant fulfillment straight to your device.
            </p>
          </section>

          {/* ── NETWORK TABS ── */}
          <div className="flex justify-start gap-8 mb-8 animate-fade-up stagger-2">
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

          {/* ── BUNDLE LIST ROWS ── */}
          <div className="flex flex-col border-t border-ink-faint">
            {filtered.map((bundle, i) => {
              return (
                <div
                  key={bundle.id}
                  onClick={() => setSelectedBundle(bundle)}
                  className={cn(
                    "group grid grid-cols-[1fr_auto_32px] items-center gap-4 py-5 sm:py-6 min-h-[64px] cursor-pointer border-b border-ink-faint hover:bg-paper-off transition-colors animate-fade-up px-0 sm:px-4 sm:-mx-4",
                    `stagger-${(i % 6) + 1}`
                  )}
                >
                  {/* Col 1: Size + Popular Badge */}
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

                  {/* Col 2: Price */}
                  <div className="text-right font-display font-[700] text-[16px] text-ink">
                    {formatGHS(bundle.price)}
                  </div>

                  {/* Col 3: Arrow */}
                  <div className="w-8 h-8 flex items-center justify-center transition-colors border border-ink-faint group-hover:bg-accent group-hover:border-accent text-ink group-hover:text-paper">
                    <ArrowRight className="w-4 h-4 transition-colors" />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-ink-faint mt-2 py-6 text-center animate-fade-up stagger-6">
            <p className="text-[11px] text-ink-muted tracking-[0.06em]">
              Instant delivery · MoMo & card accepted · Secured by Paystack
            </p>
          </div>
        </main>

        {/* ── FOOTER ── */}
        <footer className="py-12 mt-12 text-center text-[11px] font-medium uppercase tracking-[1px] text-ink-muted">
          C7 Empire · Accra, Ghana
        </footer>
      </div>

      {/* ── MODAL ── */}
      {selectedBundle && (
        <CheckoutModal
          bundle={selectedBundle}
          onClose={() => setSelectedBundle(null)}
        />
      )}
    </>
  );
}
