"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function AllAlbumsPage() {
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

    return (
        <div className="bg-[#0a0a0a] min-h-screen text-white font-sans selection:bg-white selection:text-black pt-32">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 mb-20">
                <h1 className="text-sm font-bold uppercase tracking-[0.5em] text-white/30 mb-6">Archive</h1>
                <h2 className="text-5xl md:text-7xl font-bold tracking-tighter">All Collections</h2>
            </div>

            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 pb-32">
                {albums.map((a) => (
                    <div
                        key={a.id}
                        onClick={() => router.push(`/albums/${a.slug}`)}
                        className="group cursor-pointer"
                    >
                        <div className="aspect-[3/2] overflow-hidden rounded-sm relative mb-6">
                            <img
                                src={a.coverImage || "https://images.unsplash.com/photo-1493246507139-91e8bef99c02?auto=format&fit=crop&q=80"}
                                alt={a.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <h3 className="text-2xl font-bold tracking-tight">{a.name}</h3>
                                <span className="text-[10px] font-bold tracking-widest uppercase opacity-20 group-hover:opacity-100 transition-opacity">
                                    Browse →
                                </span>
                            </div>
                            <p className="text-white/40 text-sm font-medium tracking-widest uppercase line-clamp-2 leading-relaxed">
                                {a.description || "Collection"}
                            </p>
                        </div>
                    </div>
                ))}

                {albums.length === 0 && !loading && (
                    <div className="col-span-full py-40 text-center opacity-20 italic">
                        No collections available at this time.
                    </div>
                )}
            </div>

            <footer className="border-t border-white/5 py-20 text-center">
                <p className="text-white/20 text-sm tracking-widest uppercase">
                    © {new Date().getFullYear()} ZEKI Photography. All Rights Reserved.
                </p>
            </footer>
        </div>
    );
}