"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminAlbums() {
    const [albums, setAlbums] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        loadAlbums();
    }, []);

    async function loadAlbums() {
        try {
            const res = await api.get("/albums");
            setAlbums(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    async function deleteAlbum(id: string) {
        if (!confirm("Are you sure? This will permanently delete the album AND all photos inside it.")) return;
        
        try {
            await api.delete(`/albums/${id}`);
            setAlbums(albums.filter(a => a.id !== id));
        } catch (err) {
            alert("Failed to delete album");
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
                    <h1 className="text-3xl font-bold tracking-tight">Manage Albums</h1>
                    <p className="text-white/50 mt-1">Organize your work into themed collections.</p>
                </div>
                <Link 
                    href="/admin/albums/create" 
                    className="bg-white text-black px-6 py-2.5 rounded-full font-semibold hover:bg-white/90 transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                    <span>📁</span> Create Album
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {albums.length > 0 ? albums.map((a) => (
                    <div
                        key={a.id}
                        className="group flex flex-col md:flex-row md:items-center justify-between p-6 bg-[#111] rounded-2xl border border-white/5 hover:border-white/20 transition-all gap-6"
                    >
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-white/5 overflow-hidden flex-shrink-0 flex items-center justify-center text-2xl grayscale group-hover:grayscale-0 transition-all border border-white/5">
                                {a.coverImage ? (
                                    <img src={a.coverImage} alt={a.name} className="w-full h-full object-cover" />
                                ) : (
                                    "📂"
                                )}
                            </div>
                            <div className="min-w-0 flex-1">
                                <h3 className="text-lg md:text-xl font-bold text-white truncate">{a.name}</h3>
                                <p className="text-white/40 text-sm mt-1 line-clamp-1">{a.description || "No description provided."}</p>
                                <div className="flex gap-4 mt-2">
                                    <span className="text-[10px] text-white/20 font-bold uppercase tracking-widest">
                                        Slug: {a.slug}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <button 
                                onClick={() => router.push(`/admin/albums/edit/${a.id}`)}
                                className="flex-1 md:flex-none px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all text-sm font-medium"
                            >
                                Edit
                            </button>
                            <button 
                                onClick={() => deleteAlbum(a.id)}
                                className="flex-1 md:flex-none px-4 py-2.5 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white transition-all text-sm font-medium"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                )) : (
                    <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
                        <p className="text-white/30">No albums created yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}