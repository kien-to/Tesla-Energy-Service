import { NextRequest, NextResponse } from "next/server";
import { validateConfig } from "@/lib/calculations";
import { packLayout } from "@/lib/engine";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = validateConfig(body);

    if (!result.valid) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const layout = packLayout(result.config);
    return NextResponse.json(layout);
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON in request body" },
      { status: 400 }
    );
  }
}
