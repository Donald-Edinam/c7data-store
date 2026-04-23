import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatGHS(amount: number) {
  return `GHS ${amount.toFixed(2)}`;
}

export function validateGhanaPhone(phone: string): boolean {
  const cleaned = phone.replace(/\s/g, "").replace(/^0/, "");
  return /^(20|23|24|25|26|27|28|29|50|54|55|56|57|59)\d{7}$/.test(cleaned);
}

export function normalizePhone(phone: string): string {
  const cleaned = phone.replace(/\s/g, "");
  if (cleaned.startsWith("0")) return "233" + cleaned.slice(1);
  if (cleaned.startsWith("+")) return cleaned.slice(1);
  if (cleaned.startsWith("233")) return cleaned;
  return "233" + cleaned;
}
