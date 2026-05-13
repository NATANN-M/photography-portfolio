import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { createPhoto } from "@/services/photo.service";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function POST(req: Request) {
  const { error, user } = requireAuth(req as any);
  if (error) return error;

  try {
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

    // Upload to Cloudinary instead of local disk
    // Folder structure: photography-portfolio/photos
    const result = await uploadToCloudinary(buffer, "photography-portfolio/photos");

    // Save in database using Cloudinary URL
    const photo = await createPhoto({
      title,
      albumId,
      imageUrl: result.secure_url,
      uploadedById: (user as any).id,
    });

    return NextResponse.json(photo);
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    return NextResponse.json({ 
        error: "Upload failed. Ensure Cloudinary environment variables are set." 
    }, { status: 500 });
  }
}