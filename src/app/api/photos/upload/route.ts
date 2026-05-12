import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { createPhoto } from "@/services/photo.service";
import path from "path";
import { writeFile } from "fs/promises";

export async function POST(req: Request) {
  const { error, user } = requireAuth(req as any);
  if (error) return error;

  const formData = await req.formData();

  const file = formData.get("file") as File;
  const title = formData.get("title") as string;
  const albumId = formData.get("albumId") as string;

  if (!file) {
    return NextResponse.json(
      { message: "No file uploaded" },
      { status: 400 }
    );
  }

  // Convert file to buffer
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Create unique file name
  const fileName = `${Date.now()}-${file.name}`;

  const filePath = path.join(
    process.cwd(),
    "public/uploads/photos",
    fileName
  );

  // Save file to disk
  await writeFile(filePath, buffer);

  // Public URL
  const imageUrl = `/uploads/photos/${fileName}`;

  // Save in database
  const photo = await createPhoto({
    title,
    albumId,
    imageUrl,
    uploadedById: (user as any).id,
  });

  return NextResponse.json(photo);
}