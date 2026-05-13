"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateAlbumPage() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function createAlbum() {
    if (!name || !slug) {
        alert("Name and Slug are required");
        return;
    }

    setLoading(true);
    try {
      await api.post("/albums", {
        name,
        slug: slug.toLowerCase().replace(/\s+/g, "-"),
        description,
        coverImage,
      });

      router.push("/admin/albums");
    } catch (err) {
      alert("Failed to create album");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create New Album</h1>
        <p className="text-white/50 mt-1">Define a new category for your photography collections.</p>
      </div>

      <div className="bg-[#111] p-8 rounded-3xl border border-white/10 space-y-6">
        <div className="space-y-2">
            <label className="text-sm font-medium text-white/60">Album Name</label>
            <input
                placeholder="e.g. Wedding 2024"
                value={name}
                onChange={(e) => {
                    setName(e.target.value);
                    if (!slug) setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"));
                }}
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
            <p className="text-[10px] text-white/30 uppercase tracking-widest font-medium">This will be used in the URL: /albums/{slug || "slug"}</p>
        </div>

        <div className="space-y-2">
            <label className="text-sm font-medium text-white/60">Cover Image (URL or Upload)</label>
            <div className="flex items-center gap-4">
                <input
                    placeholder="https://example.com/image.jpg"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/40 transition-colors"
                />
                <div className="relative">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const formData = new FormData();
                            formData.append("file", file);
                            try {
                                const res = await api.post("/upload", formData, {
                                    headers: { "Content-Type": "multipart/form-data" },
                                });
                                if (res.data.url) setCoverImage(res.data.url);
                            } catch (err) {
                                console.error("Upload failed", err);
                                alert("Failed to upload image");
                            }
                        }}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <button className="bg-white/10 hover:bg-white/20 px-4 py-3 rounded-xl text-sm font-medium transition-colors">
                        Upload
                    </button>
                </div>
            </div>
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
                onClick={createAlbum}
                disabled={loading}
                className="flex-1 bg-white text-black py-4 rounded-xl font-bold hover:bg-white/90 disabled:opacity-50 transition-all"
            >
                {loading ? "Creating..." : "Create Album"}
            </button>
            <Link href="/admin/albums" className="flex-1 bg-white/5 text-center py-4 rounded-xl font-bold hover:bg-white/10 transition-all">
                Cancel
            </Link>
        </div>
      </div>
    </div>
  );
}