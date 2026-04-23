// DataMart Developer API v2
// Base: https://api.datamartgh.shop/api/developer
// Auth: X-API-Key header

const DATAMART_BASE = "https://api.datamartgh.shop/api/developer";

// DataMart network codes
export const DATAMART_NETWORK: Record<string, string> = {
  MTN: "YELLO",
  Telecel: "TELECEL",
  AT: "AT_PREMIUM",
};

export interface DataMartPurchaseResult {
  status: "success" | "error";
  message: string;
  data?: {
    purchaseId: string;
    orderReference: string;
    transactionReference: string;
    network: string;
    capacity: number;
    price: number;
    balanceBefore: number;
    balanceAfter: number;
    orderStatus: string;
    processingMethod: string;
  };
  // error fields
  currentBalance?: number;
  requiredAmount?: number;
}

export interface DataMartBalanceResult {
  status: "success" | "error";
  data?: {
    balance: number;
    currency: string;
  };
}

export interface DataMartOrderStatusResult {
  status: "success" | "error";
  data?: {
    orderReference: string;
    orderStatus: string;
    network: string;
    capacity: number;
    phoneNumber: string;
    createdAt: string;
  };
}

function datamartHeaders() {
  return {
    "Content-Type": "application/json",
    "X-API-Key": process.env.DATAMART_API_KEY!,
  };
}

// Purchase a data bundle from DataMart wallet
export async function datamartPurchase({
  phone,
  network,
  capacityGB,
}: {
  phone: string;
  network: string; // your internal network key e.g. "MTN"
  capacityGB: string; // e.g. "1", "2", "5"
}): Promise<DataMartPurchaseResult> {
  const datamartNetwork = DATAMART_NETWORK[network];
  if (!datamartNetwork) throw new Error(`Unknown network: ${network}`);

  const res = await fetch(`${DATAMART_BASE}/purchase`, {
    method: "POST",
    headers: datamartHeaders(),
    body: JSON.stringify({
      phoneNumber: phone,
      network: datamartNetwork,
      capacity: capacityGB,
      gateway: "wallet",
    }),
  });

  return res.json();
}

// Check wallet balance
export async function datamartBalance(): Promise<DataMartBalanceResult> {
  const res = await fetch(`${DATAMART_BASE}/balance`, {
    headers: datamartHeaders(),
  });
  return res.json();
}

// Check order status by reference
export async function datamartOrderStatus(
  orderReference: string
): Promise<DataMartOrderStatusResult> {
  const res = await fetch(`${DATAMART_BASE}/order-status/${orderReference}`, {
    headers: datamartHeaders(),
  });
  return res.json();
}
