import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getSettings, updateSettings } from "@/services/setting.service";

export async function GET() {
  const settings = await getSettings();
  return NextResponse.json(settings);
}

export async function PUT(req: Request) {
  const { error } = requireAuth(req as any);
  if (error) return error;

  try {
    const body = await req.json();
    const updated = await updateSettings(body);
    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}