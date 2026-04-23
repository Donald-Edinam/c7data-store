import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const phone = req.nextUrl.searchParams.get("phone");

  if (!phone) {
    return NextResponse.json({ error: "Phone required" }, { status: 400 });
  }

  // TODO: Query Prisma DB
  // const orders = await prisma.order.findMany({ where: { phone }, orderBy: { createdAt: 'desc' } })

  // Stub response for now
  return NextResponse.json({ orders: [] });
}
