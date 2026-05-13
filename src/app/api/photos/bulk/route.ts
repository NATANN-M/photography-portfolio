import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { deletePhotos } from "@/services/photo.service";

export async function DELETE(req: Request) {
  const { error } = requireAuth(req as any);
  if (error) return error;

  try {
    const { ids } = await req.json();
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "No photo IDs provided" }, { status: 400 });
    }

    await deletePhotos(ids);
    return NextResponse.json({ message: `${ids.length} photos deleted successfully` });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete photos" }, { status: 500 });
  }
}
