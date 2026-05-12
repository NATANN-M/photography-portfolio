"use client";

import { useEffect, useState, use } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function AlbumDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const [album, setAlbum] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        loadAlbum();
    }, [slug]);

    async function loadAlbum() {
        try {
            const res = await api.get(`/albums/${slug}`);
            setAlbum(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="bg-[#0a0a0a] min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
        );
    }

    if (!album) {
        return (
            <div className="bg-[#0a0a0a] min-h-screen flex flex-col items-center justify-center text-white p-6">
                <h1 className="text-4xl font-bold mb-4 italic">Album Not Found</h1>
                <button onClick={() => router.push("/albums")} className="text-white/40 hover:text-white transition-colors">
                    Return to Albums
                </button>
            </div>
        );
    }

    return (
        <div className="bg-[#0a0a0a] min-h-screen text-white font-sans selection:bg-white selection:text-black">
            <Navbar />

            {/* ALBUM HEADER */}
            <header className="relative h-[70vh] flex flex-col justify-end p-10 md:p-20 overflow-hidden">
                <div 
                    className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-[2s] scale-105 opacity-40"
                    style={{ backgroundImage: `url(${album.coverImage})` }}
                />
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/20 to-transparent" />
                
                <div className="relative z-20 max-w-4xl animate-in fade-in slide-in-from-left-10 duration-1000">
                    <button 
                        onClick={() => router.push("/albums")}
                        className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/30 hover:text-white transition-colors mb-6 flex items-center gap-2"
                    >
                        ← Back to Archives
                    </button>
                    <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-6 italic">{album.name}</h1>
                    <p className="text-lg md:text-xl text-white/60 font-light leading-relaxed max-w-2xl">{album.description}</p>
                </div>
            </header>

            {/* PHOTOS GRID - MASONRY STYLE */}
            <section className="px-4 md:px-10 py-20">
                <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
                    {album.photos?.map((photo: any) => (
                        <div key={photo.id} className="break-inside-avoid group relative cursor-pointer overflow-hidden rounded-sm">
                            <img 
                                src={photo.imageUrl} 
                                alt={photo.title}
                                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            {/* Overlay on hover */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                                <h4 className="text-xl font-bold tracking-tight italic">{photo.title}</h4>
                                <p className="text-xs text-white/40 uppercase tracking-widest mt-2">© ZEKI Photography</p>
                            </div>
                        </div>
                    ))}
                </div>

                {(!album.photos || album.photos.length === 0) && (
                    <div className="py-40 text-center opacity-20 italic">
                        This collection currently has no photographs.
                    </div>
                )}
            </section>

            <footer className="border-t border-white/5 py-20 text-center">
                <p className="text-white/20 text-sm tracking-widest uppercase">
                    © {new Date().getFullYear()} ZEKI Photography. All Rights Reserved.
                </p>
            </footer>
        </div>
    );
}
