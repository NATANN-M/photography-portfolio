import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getSettings, updateSettings } from "@/services/setting.service";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const settings = await getSettings();

  return NextResponse.json(settings, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

export async function PUT(req: Request) {
  const { error } = requireAuth(req as any);
  if (error) return error;

  try {
    const body = await req.json();

    const updated = await updateSettings(body);

    return NextResponse.json(updated, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}