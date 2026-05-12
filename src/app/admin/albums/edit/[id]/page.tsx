"use client";

import { useEffect, useState, use } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function EditAlbumPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadAlbum();
  }, [id]);

  async function loadAlbum() {
    try {
      const res = await api.get(`/albums/${id}`);
      const album = res.data;
      
      setName(album.name);
      setSlug(album.slug);
      setDescription(album.description || "");
      setCoverImage(album.coverImage || "");
    } catch (err) {
      console.error("Failed to load album", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!name || !slug) {
        alert("Name and Slug are required");
        return;
    }

    setSaving(true);
    try {
      await api.put(`/albums/${id}`, {
        name,
        slug: slug.toLowerCase().replace(/\s+/g, "-"),
        description,
        coverImage,
      });

      router.push("/admin/albums");
    } catch (err) {
      alert("Failed to update album");
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
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Album</h1>
          <p className="text-white/50 mt-1">Modify the details and branding of this collection.</p>
        </div>
        <Link href="/admin/albums" className="text-white/40 hover:text-white transition-colors">
            Back to Albums
        </Link>
      </div>

      <div className="bg-[#111] p-8 rounded-3xl border border-white/10 space-y-6">
        <div className="space-y-2">
            <label className="text-sm font-medium text-white/60">Album Name</label>
            <input
                placeholder="e.g. Wedding 2024"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/40 transition-colors"
            />
        </div>

        <div className="space-y-2">
            <label className="text-sm font-medium text-white/60">Slug (URL Path)</label>
            <input
                placeholder="e.g. wedding-2024"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/40 transition-colors"
            />
        </div>

        <div className="space-y-2">
            <label className="text-sm font-medium text-white/60">Cover Image URL (Optional)</label>
            <input
                placeholder="https://example.com/image.jpg"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/40 transition-colors"
            />
            {coverImage && (
                <div className="mt-2 aspect-video rounded-xl overflow-hidden border border-white/10">
                    <img src={coverImage} alt="preview" className="w-full h-full object-cover" />
                </div>
            )}
        </div>

        <div className="space-y-2">
            <label className="text-sm font-medium text-white/60">Description (Optional)</label>
            <textarea
                placeholder="Briefly describe the theme of this album..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/40 transition-colors resize-none"
            />
        </div>

        <div className="pt-4 flex gap-4">
            <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-white text-black py-4 rounded-xl font-bold hover:bg-white/90 disabled:opacity-50 transition-all"
            >
                {saving ? "Saving Changes..." : "Update Album"}
            </button>
            <Link href="/admin/albums" className="flex-1 bg-white/5 text-center py-4 rounded-xl font-bold hover:bg-white/10 transition-all">
                Cancel
            </Link>
        </div>
      </div>
    </div>
  );
}
