"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";

export default function ManagePhotosPage() {
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPhotos();
  }, []);

  async function loadPhotos() {
    try {
      const res = await api.get("/photos");
      setPhotos(res.data);
    } catch (err) {
      console.error("Failed to load photos", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this photo?")) return;

    try {
      await api.delete(`/photos/${id}`);
      setPhotos(photos.filter((p) => p.id !== id));
    } catch (err) {
      alert("Failed to delete photo");
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Photos</h1>
          <p className="text-white/50 mt-1">View and manage all uploaded imagery.</p>
        </div>
        <Link 
          href="/admin/photos/upload" 
          className="bg-white text-black px-6 py-2.5 rounded-full font-semibold hover:bg-white/90 transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <span>📤</span> Upload Photo
        </Link>
      </div>

      {photos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {photos.map((photo) => (
            <div key={photo.id} className="group bg-[#111] rounded-2xl overflow-hidden border border-white/5 hover:border-white/20 transition-all">
              <div className="aspect-[4/3] relative overflow-hidden">
                <img 
                  src={encodeURI(photo.imageUrl)} 
                  alt={photo.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-3 right-3 opacity-0 lg:group-hover:opacity-100 transition-opacity">
                    <button 
                        onClick={() => handleDelete(photo.id)}
                        className="bg-red-500/90 hover:bg-red-500 p-2 rounded-lg text-white backdrop-blur-sm"
                        title="Delete Photo"
                    >
                        🗑️
                    </button>
                </div>
                {/* Mobile delete always visible? No, keep it clean or add a mobile-only button */}
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start gap-2">
                    <h3 className="font-medium text-white truncate flex-1">{photo.title || "Untitled"}</h3>
                    <button 
                        onClick={() => handleDelete(photo.id)}
                        className="lg:hidden text-red-500 text-xs"
                    >
                        Delete
                    </button>
                </div>
                <p className="text-sm text-white/40 mt-1 flex items-center gap-1">
                  <span>📁</span> {photo.album?.name || "No Album"}
                </p>
                <div className="mt-3 flex items-center justify-between">
                    <span className="text-[10px] text-white/20 uppercase tracking-widest font-bold">
                        ID: {photo.id.slice(-6)}
                    </span>
                    <Link 
                        href={`/admin/photos/edit/${photo.id}`}
                        className="text-white/40 hover:text-white text-xs font-medium transition-colors border-b border-transparent hover:border-white/40"
                    >
                        Edit Details
                    </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
          <div className="text-4xl mb-4 opacity-20">🖼️</div>
          <p className="text-white/30 text-lg">Your gallery is empty.</p>
          <Link href="/admin/photos/upload" className="text-white hover:underline mt-2 inline-block font-medium">
            Start by uploading a photo
          </Link>
        </div>
      )}
    </div>
  );
}
