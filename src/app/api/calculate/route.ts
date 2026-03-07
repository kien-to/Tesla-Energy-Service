import { NextRequest, NextResponse } from "next/server";
import { validateConfig, computeTotals } from "@/lib/calculations";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = validateConfig(body);

    if (!result.valid) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const totals = computeTotals(result.config);
    return NextResponse.json(totals);
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON in request body" },
      { status: 400 }
    );
  }
}
