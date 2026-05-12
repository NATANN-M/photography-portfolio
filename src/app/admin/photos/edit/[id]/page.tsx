"use client";

import { useEffect, useState, use } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function EditPhotoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  
  const [photo, setPhoto] = useState<any>(null);
  const [albums, setAlbums] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [albumId, setAlbumId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  async function loadData() {
    try {
      const [photoRes, albumsRes] = await Promise.all([
        api.get(`/photos/${id}`),
        api.get("/albums"),
      ]);
      
      const p = photoRes.data;
      setPhoto(p);
      setTitle(p.title);
      setAlbumId(p.albumId);
      setAlbums(albumsRes.data);
    } catch (err) {
      console.error("Failed to load data", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      await api.put(`/photos/${id}`, {
        title,
        albumId,
      });
      router.push("/admin/photos");
    } catch (err) {
      alert("Failed to update photo");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Photo Details</h1>
          <p className="text-white/50 mt-1">Update the metadata and organization for this image.</p>
        </div>
        <Link href="/admin/photos" className="text-white/40 hover:text-white transition-colors">
            Back to Photos
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* IMAGE PREVIEW */}
        <div className="space-y-4">
            <label className="text-sm font-medium text-white/60">Image Preview</label>
            <div className="aspect-[4/3] rounded-3xl overflow-hidden border border-white/10">
                <img src={photo?.imageUrl} alt={photo?.title} className="w-full h-full object-cover" />
            </div>
            <p className="text-[10px] text-white/20 uppercase tracking-widest font-bold">Original URL: {photo?.imageUrl}</p>
        </div>

        {/* FORM */}
        <div className="space-y-6 bg-[#111] p-8 rounded-3xl border border-white/10">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/60">Photo Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/40 transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/60">Album</label>
            <select
              value={albumId}
              onChange={(e) => setAlbumId(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/40 transition-colors appearance-none"
            >
              {albums.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>

          <div className="pt-4 flex flex-col gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-white text-black py-4 rounded-xl font-bold hover:bg-white/90 disabled:opacity-50 transition-all"
            >
              {saving ? "Saving Changes..." : "Update Details"}
            </button>
            
            <button
                onClick={() => {
                    if (confirm("Setting this as the album cover will update the album's main image. Continue?")) {
                        api.put(`/albums/${albumId}`, { coverImage: photo.imageUrl })
                            .then(() => alert("Album cover updated!"))
                            .catch(() => alert("Failed to update cover"));
                    }
                }}
                className="w-full bg-white/5 text-white py-4 rounded-xl font-bold hover:bg-white/10 transition-all"
            >
                Set as Album Cover
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
