import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getPhotoById, updatePhoto, deletePhoto } from "@/services/photo.service";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const photo = await getPhotoById(id);
    if (!photo) return NextResponse.json({ error: "Photo not found" }, { status: 404 });
    return NextResponse.json(photo);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch photo" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = requireAuth(req as any);
  if (error) return error;

  try {
    const { id } = await params;
    const body = await req.json();
    const updated = await updatePhoto(id, {
        title: body.title,
        description: body.description,
        albumId: body.albumId,
    });
    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update photo" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { error } = requireAuth(req as any);
  if (error) return error;

  try {
    const { id } = await params;
    await deletePhoto(id);
    return NextResponse.json({ message: "Photo deleted successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete photo" }, { status: 500 });
  }
}
