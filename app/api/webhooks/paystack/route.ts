import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("x-paystack-signature");

  // Verify webhook signature
  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
    .update(body)
    .digest("hex");

  if (hash !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(body);

  if (event.event === "charge.success") {
    const { reference, metadata } = event.data;
    const { bundle_id, phone } = metadata;

    // Re-use the verify logic or trigger a background job
    // This handles cases where the client closed before callback fired
    console.log("Webhook: charge.success", { reference, bundle_id, phone });

    // TODO: Check if order already processed (idempotency), if not → fulfill
  }

  return NextResponse.json({ received: true });
}
