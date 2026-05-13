"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";

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

    if (loading) {
      return (
        <div className="bg-background min-h-screen flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-foreground/10 border-t-accent-cta rounded-full animate-spin" />
        </div>
      );
    }

    return (
        <div className="bg-background min-h-screen text-foreground font-sans selection:bg-foreground selection:text-background pt-40">
            <Navbar />

            <div className="max-w-[1400px] mx-auto px-6 mb-32">
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm font-black uppercase tracking-widest text-accent-cta mb-6"
                >
                  archive
                </motion.h1>
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-6xl md:text-9xl font-black tracking-tighter"
                >
                  all collections<span className="text-accent-cta">.</span>
                </motion.h2>
            </div>

            <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-20 pb-32">
                {albums.map((a, index) => (
                    <motion.div
                        key={a.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => router.push(`/albums/${a.slug}`)}
                        className="group cursor-pointer"
                    >
                        <div className="aspect-[4/5] overflow-hidden rounded-[2rem] bg-foreground/5 relative mb-8">
                            <img
                                src={a.coverImage || "https://images.unsplash.com/photo-1493246507139-91e8bef99c02?auto=format&fit=crop&q=80"}
                                alt={a.name}
                                className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-background/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center backdrop-blur-sm">
                                <span className="pill-button bg-foreground text-background">
                                    view album
                                </span>
                            </div>
                        </div>
                        <div className="space-y-2 px-2">
                            <div className="flex items-center justify-between">
                                <h3 className="text-3xl font-black tracking-tighter">{a.name?.toLowerCase()}</h3>
                                <span className="text-[10px] font-black tracking-widest uppercase opacity-20 group-hover:opacity-100 group-hover:text-accent-cta transition-all">
                                    0{index + 1}
                                </span>
                            </div>
                            <p className="text-foreground/40 font-bold tracking-tight line-clamp-2">
                                {a.description?.toLowerCase() || "collection"}
                            </p>
                        </div>
                    </motion.div>
                ))}

                {albums.length === 0 && (
                    <div className="col-span-full py-40 text-center opacity-20 italic font-bold">
                        no collections available at this time.
                    </div>
                )}
            </div>

            <footer className="py-20 px-6 bg-foreground text-background rounded-t-[3rem] text-center">
                <p className="font-bold tracking-tight opacity-40">
                    © {new Date().getFullYear()} zeki photography.
                </p>
            </footer>
        </div>
    );
}