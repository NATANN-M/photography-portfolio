"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function UploadPhotoPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [albumId, setAlbumId] = useState("");
  const [albums, setAlbums] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    loadAlbums();
  }, []);

  async function loadAlbums() {
    try {
      const res = await api.get("/albums");
      setAlbums(res.data);
      if (res.data.length > 0) setAlbumId(res.data[0].id);
    } catch (err) {
      console.error("Failed to load albums", err);
    }
  }

  function validateFile(file: File) {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      alert("Only JPG, PNG, WEBP allowed");
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("File too large (max 5MB)");
      return false;
    }
    return true;
  }

  function handleFile(file: File | undefined) {
    if (!file) return;
    if (!validateFile(file)) return;
    setFile(file);
    setPreview(URL.createObjectURL(file));
  }

  async function upload() {
    if (!file) {
      alert("Please select a file");
      return;
    }
    if (!title || !albumId) {
      alert("Title and Album selection are required");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);
      formData.append("albumId", albumId);

      await api.post("/photos/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Upload successful!");
      router.push("/admin/photos");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Upload New Photo</h1>
        <p className="text-white/50 mt-1">Add a new masterpiece to your portfolio.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* LEFT: FORM */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/60">Photo Title</label>
            <input
              placeholder="e.g. Sunset in the Alps"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/40 transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/60">Select Album</label>
            <select
              value={albumId}
              onChange={(e) => setAlbumId(e.target.value)}
              className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/40 transition-colors appearance-none"
            >
              {albums.length > 0 ? (
                albums.map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))
              ) : (
                <option disabled>No albums available</option>
              )}
            </select>
            {albums.length === 0 && (
                <p className="text-xs text-red-400 mt-1">You need to create an album first.</p>
            )}
          </div>

          <div className="pt-4">
            <button
              onClick={upload}
              disabled={loading || !file || albums.length === 0}
              className="w-full bg-white text-black py-4 rounded-xl font-bold hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? "Processing Upload..." : "Publish Photo"}
            </button>
            <Link href="/admin/photos" className="block text-center mt-4 text-white/40 hover:text-white text-sm transition-colors">
                Cancel and return
            </Link>
          </div>
        </div>

        {/* RIGHT: UPLOAD AREA */}
        <div className="space-y-4">
            <label className="text-sm font-medium text-white/60">Image File</label>
            <div
                onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files?.[0]); }}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                className={`aspect-square rounded-3xl border-2 border-dashed flex flex-col items-center justify-center relative overflow-hidden transition-all duration-300 ${
                    dragging ? "border-white bg-white/5" : "border-white/10 bg-[#0a0a0a]"
                } ${preview ? "border-solid" : ""}`}
            >
                {preview ? (
                    <>
                        <img src={preview} alt="preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                            <button onClick={() => { setFile(null); setPreview(null); }} className="bg-white text-black px-4 py-2 rounded-lg font-bold text-sm">
                                Change Image
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="text-center p-10">
                        <div className="text-5xl mb-4 opacity-20">🖼️</div>
                        <p className="text-white/60 font-medium">Drag and drop your image</p>
                        <p className="text-white/30 text-sm mt-1">PNG, JPG or WEBP (max 5MB)</p>
                        <input 
                            type="file" 
                            className="absolute inset-0 opacity-0 cursor-pointer" 
                            onChange={(e) => handleFile(e.target.files?.[0])}
                        />
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}