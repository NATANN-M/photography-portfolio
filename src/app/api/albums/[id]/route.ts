import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import {
  getAlbumById,
  getAlbumBySlug,
  updateAlbum,
  deleteAlbum,
} from "@/services/album.service";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = requireAuth(req as any);
  if (error) return error;

  const { id } = await params;
  const body = await req.json();

  const updated = await updateAlbum(id, body);

  return NextResponse.json(updated);
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  // Try getting by ID first, then by slug
  let album = await getAlbumById(id);
  if (!album) {
      album = await getAlbumBySlug(id);
  }

  return NextResponse.json(album);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = requireAuth(req as any);
  if (error) return error;

  const { id } = await params;
  await deleteAlbum(id);

  return NextResponse.json({ message: "Deleted successfully" });
}