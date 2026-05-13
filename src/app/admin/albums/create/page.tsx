"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Upload, CheckCircle2, Loader2, Image as ImageIcon } from "lucide-react";
import Toast, { ToastType } from "@/components/Toast";

export default function CreateAlbumPage() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const router = useRouter();
  const [toast, setToast] = useState({ isVisible: false, message: "", type: "success" as ToastType });

  function showToast(message: string, type: ToastType) {
    setToast({ isVisible: true, message, type });
  }

  async function createAlbum() {
    if (!name || !slug) {
        showToast("Name and Slug are required", "error");
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

      showToast("Collection created successfully", "success");
      setTimeout(() => router.push("/admin/albums"), 1500);
    } catch (err) {
      showToast("Failed to create collection", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 px-4">
      <div className="space-y-4">
        <Link href="/admin/albums" className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 hover:text-white flex items-center gap-2 transition-all group">
            <ChevronLeft size={12} className="group-hover:-translate-x-1 transition-transform" /> Back to Collections
        </Link>
        <h1 className="text-4xl font-black tracking-tighter uppercase italic">Create Collection</h1>
        <p className="text-white/40 font-medium">Define a new chapter in your visual narrative.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
            <div className="bg-[#0a0a0a] p-6 md:p-10 rounded-[2.5rem] border border-white/5 space-y-8 shadow-2xl overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl -mr-16 -mt-16 rounded-full group-hover:bg-white/10 transition-colors" />
                
                <div className="space-y-6 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Collection Name</label>
                            <input
                                placeholder="e.g. Wedding 2024"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    if (!slug) setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"));
                                }}
                                className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-5 py-4 text-white focus:outline-none focus:bg-white/[0.05] transition-all font-bold"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Slug (URL Path)</label>
                            <input
                                placeholder="e.g. wedding-2024"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-5 py-4 text-white focus:outline-none focus:bg-white/[0.05] transition-all font-mono text-xs"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Description</label>
                        <textarea
                            placeholder="Briefly describe the theme of this album..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={6}
                            className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-5 py-4 text-white focus:outline-none focus:bg-white/[0.05] transition-all font-medium resize-none text-sm"
                        />
                    </div>
                </div>
            </div>
        </div>

        <div className="lg:col-span-1 space-y-8">
            <div className="bg-[#0a0a0a] p-8 rounded-[2.5rem] border border-white/5 space-y-6 shadow-2xl">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Cover Masterpiece</label>
                <div className="aspect-[4/5] rounded-3xl overflow-hidden border-2 border-white/5 relative group bg-white/5">
                    {coverImage ? (
                        <img src={coverImage} alt="preview" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-white/10 p-6 text-center">
                            <ImageIcon size={32} />
                            <span className="text-[8px] mt-4 font-black uppercase tracking-widest">No Cover Selected</span>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center backdrop-blur-sm p-6 gap-4">
                        <label className="w-full cursor-pointer bg-white text-black px-6 py-3 rounded-full font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-transform text-center">
                            {uploading ? "Uploading..." : "Upload Cover"}
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                disabled={uploading}
                                onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    setUploading(true);
                                    const formData = new FormData();
                                    formData.append("file", file);
                                    try {
                                        const res = await api.post("/upload", formData, { headers: { "Content-Type": "multipart/form-data" } });
                                        if (res.data.url) setCoverImage(res.data.url);
                                    } catch (err) { showToast("Upload failed", "error"); }
                                    finally { setUploading(false); }
                                }}
                            />
                        </label>
                        <span className="text-white/40 text-[8px] font-bold uppercase tracking-widest">or paste URL below</span>
                    </div>
                </div>
                <input
                    placeholder="https://image-url.com"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none text-[10px] font-medium"
                />
            </div>

            <button
                onClick={createAlbum}
                disabled={loading}
                className="w-full bg-white text-black py-6 rounded-[2rem] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 disabled:opacity-50 transition-all shadow-2xl flex items-center justify-center gap-3"
            >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
                {loading ? "Creating..." : "Initialize Collection"}
            </button>
        </div>
      </div>

      <Toast 
        isVisible={toast.isVisible} 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast({ ...toast, isVisible: false })} 
      />
    </div>
  );
}