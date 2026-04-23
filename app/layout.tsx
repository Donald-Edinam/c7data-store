import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "C7 Data Store - Instant Data Bundles in Ghana",
  description: "Buy MTN, Telecel, and AirtelTigo data bundles instantly. Delivered straight to your phone.",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
