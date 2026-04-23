"use client";

import { useState } from "react";
import { validateGhanaPhone, normalizePhone, cn } from "@/lib/utils";
import { Search, ArrowLeft } from "lucide-react";
import Link from "next/link";

type OrderStatus = "pending" | "processing" | "delivered" | "failed";

interface Order {
  id: string;
  bundle: string;
  network: string;
  phone: string;
  amount: number;
  status: OrderStatus;
  createdAt: string;
}

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "text-amber",
  processing: "text-blue",
  delivered: "text-accent",
  failed: "text-red",
};

export default function OrdersPage() {
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!validateGhanaPhone(phone)) { setError("Enter a valid Ghana phone number"); return; }
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/orders?phone=${normalizePhone(phone)}`);
      const data = await res.json();
      setOrders(data.orders || []);
    } catch {
      setError("Could not fetch orders. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper font-body text-ink selection:bg-ink selection:text-paper">
      {/* ── HEADER ── */}
      <header className="h-[52px] sticky top-0 bg-paper/90 backdrop-blur z-40 border-b border-ink-faint">
        <div className="max-w-[1200px] mx-auto px-6 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-[12px] font-medium uppercase tracking-[1.5px] text-ink-muted hover:text-ink transition-colors flex-1">
            <ArrowLeft className="w-4 h-4" /> BACK
          </Link>
          <div className="font-display font-[900] text-[18px] tracking-[-0.03em] text-ink flex-none text-center">
            C7 DATA
          </div>
          <div className="flex-1"></div>
        </div>
      </header>

      <main className="max-w-[720px] mx-auto px-6 pt-24 pb-24">
        {/* ── HEADER ── */}
        <div className="text-center mb-16 animate-fade-up">
          <h1 className="font-display font-[900] text-[48px] leading-[1.05] tracking-[-0.03em] text-ink mb-4">
            Track order.
          </h1>
          <p className="text-[15px] font-normal text-ink-muted">
            Enter the phone number used at checkout.
          </p>
        </div>

        {/* ── SEARCH BAR ── */}
        <div className="mb-16 max-w-lg mx-auto animate-fade-up stagger-1">
          <div className="flex w-full">
            <input
              type="tel"
              placeholder="e.g. 0244 123 456"
              value={phone}
              onChange={(e) => { setPhone(e.target.value); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1 px-4 py-4 text-[16px] text-ink bg-paper border border-ink border-r-0 focus:outline-none placeholder:text-ink-muted rounded-none"
            />
            <button
              onClick={handleSearch}
              disabled={loading || !phone}
              className="px-6 bg-ink border border-ink text-paper font-display font-bold text-[13px] uppercase tracking-[1px] hover:bg-ink-mid hover:border-ink-mid transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-none flex items-center justify-center min-w-[120px]"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-paper/30 border-t-paper rounded-full animate-spin" />
              ) : (
                "Search"
              )}
            </button>
          </div>
          {error && <p className="text-[13px] text-red mt-3">{error}</p>}
        </div>

        {/* ── RESULTS ── */}
        {orders !== null && (
          <div className="animate-fade-up stagger-2 border-t border-ink-faint">
            {orders.length === 0 ? (
              <div className="py-12 text-center text-ink-muted text-[15px]">
                No orders found for this number.
              </div>
            ) : (
              <div className="flex flex-col">
                {orders.map((order) => (
                  <div key={order.id} className="py-6 border-b border-ink-faint flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="font-display font-[900] text-[20px] text-ink tracking-[-0.02em]">
                        {order.network} {bundleSize(order.bundle)}
                      </div>
                      <div className="text-[13px] text-ink-muted mt-1 uppercase tracking-[0.5px]">
                        {new Date(order.createdAt).toLocaleDateString(undefined, {
                          month: 'short', day: 'numeric', year: 'numeric'
                        })} · #{order.id}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-auto w-full border-t border-ink-faint sm:border-0 pt-4 sm:pt-0 mt-2 sm:mt-0">
                      <div className="text-[15px] text-ink">
                        GHS {order.amount.toFixed(2)}
                      </div>
                      <div className={cn("text-[11px] font-[900] uppercase tracking-[1.5px]", STATUS_COLORS[order.status])}>
                        {order.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

// Optional helper to just ensure the UI matches the clean list row formatting.
function bundleSize(bundleName: string) {
  return bundleName.replace('Bundle', '').trim();
}
