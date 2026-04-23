import { NextResponse } from "next/server";
import { datamartBalance } from "@/lib/datamart";

// GET /api/balance — for your admin dashboard wallet widget
export async function GET() {
  try {
    const result = await datamartBalance();
    if (result.status !== "success") {
      return NextResponse.json({ error: "Could not fetch balance" }, { status: 500 });
    }
    return NextResponse.json({ balance: result.data!.balance, currency: result.data!.currency });
  } catch (err) {
    console.error("Balance fetch error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
