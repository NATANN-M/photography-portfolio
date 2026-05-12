import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { createAlbum, getAlbums } from "@/services/album.service";

export async function GET() {
  const albums = await getAlbums();
  return NextResponse.json(albums);
}

export async function POST(req: Request) {
  const { error, user } = requireAuth(req as any);
  if (error) return error;

  const body = await req.json();

  const album = await createAlbum({
    name: body.name,
    slug: body.slug,
    description: body.description,
    coverImage: body.coverImage,
    createdById: (user as any).id,
  });

  return NextResponse.json(album);
}