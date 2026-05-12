import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getAlbums } from "@/services/album.service";
import { getPhotosCount, getRecentPhotos } from "@/services/photo.service";

export async function GET(req: Request) {
  const { error } = requireAuth(req as any);
  if (error) return error;

  try {
    const albums = await getAlbums();
    const photosCount = await getPhotosCount();
    const recentPhotos = await getRecentPhotos(6);

    return NextResponse.json({
      albumsCount: albums.length,
      photosCount,
      recentPhotos,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
