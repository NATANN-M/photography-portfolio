import { NextResponse } from "next/server";
import { getAllPhotos } from "@/services/photo.service";

export async function GET() {
  try {
    const photos = await getAllPhotos();
    return NextResponse.json(photos);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch photos" }, { status: 500 });
  }
}
