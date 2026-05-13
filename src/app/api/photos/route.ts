import { NextResponse } from "next/server";
import { getAllPhotos, getRecentPhotos } from "@/services/photo.service";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = searchParams.get("limit");
    
    let photos;
    if (limit) {
      photos = await getRecentPhotos(parseInt(limit));
    } else {
      photos = await getAllPhotos();
    }
    
    return NextResponse.json(photos);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch photos" }, { status: 500 });
  }
}
