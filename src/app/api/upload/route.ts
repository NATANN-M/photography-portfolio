import { NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    // Support external image URL
    const externalUrl = formData.get("url") as string | null;
    if (externalUrl) {
      return NextResponse.json({ url: externalUrl });
    }

    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
    }

    // Convert file to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    // Folder structure: photography-portfolio/photos
    const result = await uploadToCloudinary(buffer, "photography-portfolio/photos");

    // Cloudinary returns a secure_url
    return NextResponse.json({ 
        url: result.secure_url,
        public_id: result.public_id,
        format: result.format,
        width: result.width,
        height: result.height
    });

  } catch (err) {
    console.error("Cloudinary upload error:", err);
    return NextResponse.json({ 
        error: "Upload failed. Ensure Cloudinary environment variables are set." 
    }, { status: 500 });
  }
}
