"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Upload, X, CheckCircle2, Image as ImageIcon, Plus, Trash2 } from "lucide-react";
import Toast, { ToastType } from "@/components/Toast";
import imageCompression from "browser-image-compression";

interface UploadItem {
  id: string;
  file: File;
  preview: string;
  title: string;
  status: "pending" | "uploading" | "success" | "error";
}

export default function MediaManagerPage() {
  const router = useRouter();
  const [items, setItems] = useState<UploadItem[]>([]);
  const [albumId, setAlbumId] = useState("");
  const [albums, setAlbums] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  
  // Toast state
  const [toast, setToast] = useState({ isVisible: false, message: "", type: "success" as ToastType });

  useEffect(() => {
    loadAlbums();
  }, []);

  async function loadAlbums() {
    try {
      const res = await api.get("/albums");
      setAlbums(res.data);
      if (res.data.length > 0) setAlbumId(res.data[0].id);
    } catch (err) {
      showToast("Failed to load albums", "error");
    }
  }

  function showToast(message: string, type: ToastType) {
    setToast({ isVisible: true, message, type });
  }

  function validateFile(file: File) {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      showToast(`${file.name} is not a valid image`, "error");
      return false;
    }
    if (file.size > 10 * 1024 * 1024) {
      showToast(`${file.name} is too large (max 10MB)`, "error");
      return false;
    }
    return true;
  }

  function handleFiles(files: FileList | null) {
    if (!files) return;
    
    const newItems: UploadItem[] = [];
    Array.from(files).forEach((file) => {
      if (validateFile(file)) {
        newItems.push({
          id: Math.random().toString(36).substr(2, 9),
          file,
          preview: URL.createObjectURL(file),
          title: file.name.split(".")[0].replace(/-/g, " ").replace(/_/g, " "),
          status: "pending",
        });
      }
    });
    
    setItems((prev) => [...prev, ...newItems]);
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  function updateItemTitle(id: string, title: string) {
    setItems((prev) => prev.map((item) => item.id === id ? { ...item, title } : item));
  }

  async function processUpload() {
    if (items.length === 0) {
      showToast("Please add some images first", "error");
      return;
    }
    if (!albumId) {
      showToast("Please select an album", "error");
      return;
    }

    setIsUploading(true);
    let successCount = 0;
    let failCount = 0;

    for (const item of items) {
      if (item.status === "success") continue;

      setItems(prev => prev.map(i => i.id === item.id ? { ...i, status: "uploading" } : i));

      try {
        let fileToUpload = item.file;
        try {
          const options = {
            maxSizeMB: 1.5,
            maxWidthOrHeight: 2048,
            useWebWorker: true,
          };
          fileToUpload = await imageCompression(item.file, options);
        } catch (error) {
          console.error("Compression error:", error);
        }

        const formData = new FormData();
        formData.append("file", fileToUpload);
        formData.append("title", item.title);
        formData.append("albumId", albumId);

        await api.post("/photos/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        setItems(prev => prev.map(i => i.id === item.id ? { ...i, status: "success" } : i));
        successCount++;
      } catch (err) {
        setItems(prev => prev.map(i => i.id === item.id ? { ...i, status: "error" } : i));
        failCount++;
      }
    }

    setIsUploading(false);
    if (failCount === 0) {
      showToast(`Successfully uploaded ${successCount} photos!`, "success");
      setTimeout(() => router.push("/admin"), 1500);
    } else {
      showToast(`Finished: ${successCount} successful, ${failCount} failed.`, "error");
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic">Media Manager</h1>
          <p className="text-white/40 mt-1 font-medium">Bulk upload your latest captures to your collections.</p>
        </div>
        <div className="flex gap-4">
            <button
              onClick={processUpload}
              disabled={isUploading || items.length === 0 || albums.length === 0}
              className="bg-white text-black px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all shadow-2xl flex items-center gap-3"
            >
              {isUploading ? (
                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              ) : (
                <CheckCircle2 size={18} />
              )}
              {isUploading ? "Uploading..." : `Publish ${items.length} Photo${items.length === 1 ? "" : "s"}`}
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10">
        {/* UPLOAD AREA - NOW ON TOP */}
        <div className="space-y-4">
            <div
                onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                className={`min-h-[300px] rounded-[2.5rem] border-2 border-dashed flex flex-col items-center justify-center relative overflow-hidden transition-all duration-500 bg-white/[0.01] ${
                    dragging ? "border-white bg-white/5" : "border-white/5"
                }`}
            >
                <div className="text-center p-12 pointer-events-none">
                    <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/10 group-hover:scale-110 transition-transform">
                        <Upload size={32} className="text-white/40" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Drop your masterpieces here</h3>
                    <p className="text-white/30 text-sm max-w-xs mx-auto">Select multiple images to upload. High-quality PNG, JPG or WEBP supported.</p>
                </div>
                <input 
                    type="file" 
                    multiple
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    onChange={(e) => handleFiles(e.target.files)}
                    disabled={isUploading}
                />
            </div>
        </div>

        {/* CONTROLS & QUEUE */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* SETTINGS SIDEBAR */}
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-[#0a0a0a] p-8 rounded-[2rem] border border-white/5 space-y-6 shadow-2xl">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Target Album</label>
                        <select
                            value={albumId}
                            onChange={(e) => setAlbumId(e.target.value)}
                            className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-4 text-white focus:outline-none focus:bg-white/[0.05] transition-all appearance-none cursor-pointer font-bold"
                        >
                            {albums.map((a) => (
                                <option key={a.id} value={a.id} className="bg-[#0a0a0a]">{a.name}</option>
                            ))}
                        </select>
                        {albums.length === 0 && (
                            <p className="text-xs text-red-400 mt-2 font-medium">You need to create an album first.</p>
                        )}
                    </div>
                    
                    <div className="pt-6 border-t border-white/5">
                        <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-white/20">
                            <span>Queue Summary</span>
                            <span>{items.length} items</span>
                        </div>
                    </div>
                </div>
                
                <Link href="/admin" className="block text-center text-white/20 hover:text-white transition-colors text-xs font-black uppercase tracking-widest">
                    Cancel and Return
                </Link>
            </div>

            {/* UPLOAD QUEUE */}
            <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {items.map((item) => (
                        <div key={item.id} className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-4 flex gap-4 items-center group relative overflow-hidden">
                            <div className="w-20 h-20 rounded-xl overflow-hidden bg-white/5 shrink-0 border border-white/10">
                                <img src={item.preview} alt="preview" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <input 
                                    value={item.title}
                                    onChange={(e) => updateItemTitle(item.id, e.target.value)}
                                    className="bg-transparent border-0 p-0 text-sm font-bold text-white focus:outline-none w-full placeholder:opacity-20"
                                    placeholder="Enter title..."
                                />
                                <div className="flex items-center gap-2 mt-1">
                                    <span className={`w-1.5 h-1.5 rounded-full ${
                                        item.status === 'success' ? 'bg-emerald-500' : 
                                        item.status === 'error' ? 'bg-red-500' : 
                                        item.status === 'uploading' ? 'bg-blue-500 animate-pulse' : 'bg-white/10'
                                    }`} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-20">
                                        {item.status}
                                    </span>
                                </div>
                            </div>
                            <button 
                                onClick={() => removeItem(item.id)}
                                disabled={isUploading}
                                className="p-2 text-white/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-0"
                            >
                                <Trash2 size={16} />
                            </button>
                            
                            {item.status === 'uploading' && (
                                <div className="absolute bottom-0 left-0 h-1 bg-white animate-progress-indefinite" />
                            )}
                        </div>
                    ))}
                    
                    {items.length === 0 && (
                        <div className="sm:col-span-2 h-[200px] flex flex-col items-center justify-center border border-white/5 rounded-[2rem] bg-white/[0.01]">
                            <ImageIcon size={32} className="text-white/5 mb-4" />
                            <p className="text-white/20 text-sm font-bold uppercase tracking-widest">No images in queue</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>

      <Toast 
        isVisible={toast.isVisible} 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast({ ...toast, isVisible: false })} 
      />
      
      <style jsx global>{`
        @keyframes progress-indefinite {
            0% { width: 0%; left: 0%; }
            50% { width: 30%; left: 35%; }
            100% { width: 0%; left: 100%; }
        }
        .animate-progress-indefinite {
            animation: progress-indefinite 2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}