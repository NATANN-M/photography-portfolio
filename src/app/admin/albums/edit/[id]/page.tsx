"use client";

import { useEffect, useState, use } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Trash2, CheckCircle2, ChevronLeft, Upload, Grid, Settings as SettingsIcon, Image as ImageIcon, Loader2, Plus } from "lucide-react";
import Toast, { ToastType } from "@/components/Toast";
import ConfirmModal from "@/components/ConfirmModal";

export default function EditAlbumPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [photos, setPhotos] = useState<any[]>([]);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // UI State
  const [toast, setToast] = useState({ isVisible: false, message: "", type: "success" as ToastType });
  const [confirm, setConfirm] = useState({ isOpen: false, type: "single" as "single" | "bulk", id: "" });

  useEffect(() => {
    loadAlbum();
  }, [id]);

  function showToast(message: string, type: ToastType) {
    setToast({ isVisible: true, message, type });
  }

  async function loadAlbum() {
    try {
      const res = await api.get(`/albums/${id}`);
      const album = res.data;
      
      setName(album.name);
      setSlug(album.slug);
      setDescription(album.description || "");
      setCoverImage(album.coverImage || "");
      setPhotos(album.photos || []);
    } catch (err) {
      showToast("Failed to load album data", "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!name || !slug) {
        showToast("Name and Slug are required", "error");
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
      showToast("Album updated successfully", "success");
      setTimeout(() => router.push("/admin/albums"), 1000);
    } catch (err) {
      showToast("Update failed", "error");
    } finally {
      setSaving(false);
    }
  }

  const toggleSelect = (photoId: string) => {
    setSelectedPhotos(prev => 
      prev.includes(photoId) 
        ? prev.filter(p => p !== photoId) 
        : [...prev, photoId]
    );
  };

  async function deletePhotos() {
    setIsDeleting(true);
    try {
        if (confirm.type === "single") {
            await api.delete(`/photos/${confirm.id}`);
            setPhotos(prev => prev.filter(p => p.id !== confirm.id));
            showToast("Photo deleted", "success");
        } else {
            await api.delete("/photos/bulk", { data: { ids: selectedPhotos } });
            setPhotos(prev => prev.filter(p => !selectedPhotos.includes(p.id)));
            setSelectedPhotos([]);
            showToast(`${selectedPhotos.length} photos removed`, "success");
        }
    } catch (err) {
        showToast("Deletion failed", "error");
    } finally {
        setIsDeleting(false);
        setConfirm({ ...confirm, isOpen: false });
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-white/20" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
            <Link href="/admin/albums" className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 hover:text-white flex items-center gap-2 transition-all group">
                <ChevronLeft size={12} className="group-hover:-translate-x-1 transition-transform" /> Back to Collections
            </Link>
            <h1 className="text-4xl font-black tracking-tighter uppercase italic">Curate Collection</h1>
            <p className="text-white/40 font-medium">Refining the narrative of <span className="text-white italic">{name}</span>.</p>
        </div>
        
        <div className="flex items-center gap-4">
            {selectedPhotos.length > 0 && (
                <button 
                    onClick={() => setConfirm({ isOpen: true, type: "bulk", id: "" })}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-4 rounded-2xl font-black uppercase tracking-widest transition-all flex items-center gap-3 shadow-xl animate-in zoom-in-95 duration-300"
                >
                    <Trash2 size={16} /> Delete {selectedPhotos.length}
                </button>
            )}
            <button
                onClick={handleSave}
                disabled={saving}
                className="bg-white text-black px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:scale-105 active:scale-95 disabled:opacity-50 transition-all shadow-2xl flex items-center gap-3"
            >
                {saving ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
                {saving ? "Syncing..." : "Update Story"}
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* LEFT: SETTINGS (Sticky on Desktop) */}
        <div className="lg:col-span-1 space-y-8">
            <div className="bg-[#0a0a0a] p-10 rounded-[2.5rem] border border-white/5 space-y-8 shadow-2xl sticky top-10 overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl -mr-16 -mt-16 rounded-full group-hover:bg-white/10 transition-colors" />
                <div className="flex items-center gap-3 relative z-10">
                    <SettingsIcon size={18} className="text-accent-cta" />
                    <h2 className="text-xl font-black uppercase tracking-tight italic">Meta Data</h2>
                </div>
                
                <div className="space-y-6 relative z-10">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Collection Name</label>
                        <input
                            placeholder="e.g. Wedding 2024"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-5 py-4 text-white focus:outline-none focus:bg-white/[0.05] transition-all font-bold"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Slug</label>
                        <input
                            placeholder="e.g. wedding-2024"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-5 py-4 text-white focus:outline-none focus:bg-white/[0.05] transition-all font-mono text-xs"
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Cover Masterpiece</label>
                        <div className="aspect-video rounded-3xl overflow-hidden border-2 border-white/5 relative group bg-white/5">
                            {coverImage ? (
                                <img src={coverImage} alt="preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-white/10">
                                    <ImageIcon size={32} />
                                    <span className="text-[8px] mt-2 font-black uppercase tracking-widest">No Cover Set</span>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                <label className="cursor-pointer bg-white text-black px-6 py-3 rounded-full font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-transform">
                                    Replace
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;
                                            const formData = new FormData();
                                            formData.append("file", file);
                                            try {
                                                const res = await api.post("/upload", formData, { headers: { "Content-Type": "multipart/form-data" } });
                                                if (res.data.url) setCoverImage(res.data.url);
                                            } catch (err) { showToast("Upload failed", "error"); }
                                        }}
                                    />
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Description</label>
                        <textarea
                            placeholder="Briefly describe the theme of this album..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-5 py-4 text-white focus:outline-none focus:bg-white/[0.05] transition-all font-medium resize-none text-sm"
                        />
                    </div>
                </div>
            </div>
        </div>

        {/* RIGHT: PHOTOS GRID */}
        <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Grid size={18} className="text-accent-cta" />
                    <h2 className="text-xl font-black uppercase tracking-tight italic">Asset Management</h2>
                </div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
                    {photos.length} photos total
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {photos.map((photo) => (
                    <div 
                        key={photo.id}
                        onClick={() => toggleSelect(photo.id)}
                        className={`group relative aspect-square rounded-[2rem] overflow-hidden border-2 transition-all duration-500 cursor-pointer shadow-xl ${
                            selectedPhotos.includes(photo.id) ? "border-white scale-95" : "border-white/5 hover:border-white/20"
                        }`}
                    >
                        <img 
                            src={photo.imageUrl} 
                            alt={photo.title} 
                            className={`w-full h-full object-cover transition-all duration-700 ${
                                selectedPhotos.includes(photo.id) ? "brightness-[0.4] scale-110" : "opacity-60 group-hover:opacity-100 group-hover:scale-105"
                            }`} 
                        />
                        
                        {/* Overlay Controls */}
                        <div className="absolute inset-0 flex flex-col justify-between p-6">
                            <div className="flex justify-end">
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                    selectedPhotos.includes(photo.id) ? "bg-white border-white" : "border-white/20 group-hover:border-white/40"
                                }`}>
                                    {selectedPhotos.includes(photo.id) && <CheckCircle2 size={12} className="text-black" />}
                                </div>
                            </div>
                            
                            <div className={`transition-all duration-500 ${selectedPhotos.includes(photo.id) ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                                <p className="text-[10px] font-black uppercase tracking-widest truncate mb-2">{photo.title}</p>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); setConfirm({ isOpen: true, type: "single", id: photo.id }); }}
                                    className="p-3 bg-red-500/80 hover:bg-red-500 rounded-xl text-white backdrop-blur-sm transition-all"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                
                {/* Empty State / Add Placeholder */}
                <Link 
                    href="/admin/photos/upload"
                    className="aspect-square rounded-[2rem] border-2 border-dashed border-white/5 hover:border-white/20 hover:bg-white/[0.02] transition-all flex flex-col items-center justify-center gap-4 group"
                >
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform">
                        <Plus size={20} className="text-white/20 group-hover:text-white" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Add Content</span>
                </Link>
            </div>
            
            {photos.length === 0 && (
                <div className="py-24 text-center border-2 border-dashed border-white/5 rounded-[3rem] bg-white/[0.01]">
                    <ImageIcon size={48} className="text-white/5 mx-auto mb-6" />
                    <p className="text-white/20 text-sm font-black uppercase tracking-widest">No assets found in this collection</p>
                </div>
            )}
        </div>
      </div>

      <ConfirmModal 
        isOpen={confirm.isOpen}
        title={confirm.type === "single" ? "Erase Photo?" : `Erase ${selectedPhotos.length} Photos?`}
        message={confirm.type === "single" 
            ? "This will permanently remove this masterpiece from your digital archives. This action cannot be undone."
            : `You are about to permanently delete ${selectedPhotos.length} photos. This will refine your collection but the data will be lost forever.`
        }
        confirmLabel="Erase Permanently"
        onConfirm={deletePhotos}
        onCancel={() => setConfirm({ ...confirm, isOpen: false })}
      />

      <Toast 
        isVisible={toast.isVisible} 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast({ ...toast, isVisible: false })} 
      />
    </div>
  );
}

