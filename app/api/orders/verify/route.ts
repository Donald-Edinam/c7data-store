import { NextRequest, NextResponse } from "next/server";
import { BUNDLES } from "@/lib/bundles";
import { datamartPurchase } from "@/lib/datamart";

// ── Paystack: verify transaction ─────────────────────────────────────────────
async function verifyPaystackPayment(reference: string) {
  const res = await fetch(
    `https://api.paystack.co/transaction/verify/${reference}`,
    { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` } }
  );
  return res.json();
}

// ── WhatsApp: send order confirmation ────────────────────────────────────────
async function sendWhatsAppConfirmation({
  phone,
  network,
  data,
  reference,
}: {
  phone: string;
  network: string;
  data: string;
  reference: string;
}) {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  if (!phoneNumberId || !token) return;

  await fetch(
    `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: phone,
        type: "text",
        text: {
          body: `✅ *C7 Data Store*\n\nYour ${network} ${data} bundle has been delivered!\n\nRef: ${reference}\n\nThank you for shopping with us 🇬🇭`,
        },
      }),
    }
  );
}

// ── POST /api/orders/verify ──────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const { reference, bundle_id, phone } = await req.json();

    if (!reference || !bundle_id || !phone) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // 1. Verify payment with Paystack
    const paystack = await verifyPaystackPayment(reference);
    if (paystack.data?.status !== "success") {
      return NextResponse.json({ error: "Payment not confirmed" }, { status: 402 });
    }

    // 2. Idempotency check — ensure same reference isn't processed twice
    // TODO: await prisma.order.findUnique({ where: { reference } }) → return early if exists

    // 3. Find bundle
    const bundle = BUNDLES.find((b) => b.id === bundle_id);
    if (!bundle) {
      return NextResponse.json({ error: "Bundle not found" }, { status: 404 });
    }

    // 4. Sanity check: Paystack amount matches bundle price (pesewas)
    const paidAmount = paystack.data.amount / 100; // convert pesewas → GHS
    if (paidAmount < bundle.price) {
      return NextResponse.json({ error: "Amount mismatch" }, { status: 402 });
    }

    // 5. Fulfill via DataMart API
    const fulfillment = await datamartPurchase({
      phone,
      network: bundle.network,
      capacityGB: bundle.capacityGB,
    });

    if (fulfillment.status !== "success") {
      // Log the failure — don't leave customer hanging
      console.error("DataMart fulfillment failed:", fulfillment);
      // TODO: save order as "failed" in DB, trigger manual review alert
      return NextResponse.json(
        {
          error: "Fulfillment failed",
          detail: fulfillment.message,
          // Return enough info so you can manually fulfill
          reference,
          bundle_id,
          phone,
        },
        { status: 500 }
      );
    }

    // 6. Save order to DB
    // TODO:
    // await prisma.order.create({
    //   data: {
    //     reference,
    //     datamartRef: fulfillment.data!.orderReference,
    //     bundleId: bundle_id,
    //     network: bundle.network,
    //     data: bundle.data,
    //     phone,
    //     amount: bundle.price,
    //     status: "delivered",
    //   },
    // });

    // 7. Send WhatsApp confirmation
    await sendWhatsAppConfirmation({
      phone,
      network: bundle.network,
      data: bundle.data,
      reference: fulfillment.data!.orderReference,
    });

    return NextResponse.json({
      success: true,
      order: {
        reference,
        datamartRef: fulfillment.data!.orderReference,
        bundle: bundle.label,
        network: bundle.network,
        data: bundle.data,
        phone,
        amount: bundle.price,
        balanceAfter: fulfillment.data!.balanceAfter,
      },
    });
  } catch (err) {
    console.error("Order verify error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
