import { NextResponse } from "next/server";
import { featureFlagsService } from "@/lib/features/featureFlagsService";

export async function GET() {
  try {
    const flags = await featureFlagsService.getFlags();
    return NextResponse.json(flags);
  } catch (error) {
    console.error("Error fetching feature flags:", error);
    return NextResponse.json({ error: "Failed to fetch feature flags" }, { status: 500 });
  }
}
