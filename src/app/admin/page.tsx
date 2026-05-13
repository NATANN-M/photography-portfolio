"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import { LayoutDashboard, Images, FolderKanban, ArrowRight, Plus, Loader2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    albumsCount: 0,
    photosCount: 0,
    recentPhotos: [] as any[],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      const res = await api.get("/admin/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Failed to load stats", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-white/20" size={40} />
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-12 pb-20"
    >
      {/* HEADER */}
      <motion.div variants={item}>
        <h1 className="text-4xl font-black tracking-tighter uppercase italic">Control Center</h1>
        <p className="text-white/40 mt-1 font-medium">Monitoring your visual empire and creative assets.</p>
      </motion.div>

      {/* STATS GRID */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Total Collections" value={stats.albumsCount} icon={FolderKanban} color="blue" />
        <StatCard title="Curated Assets" value={stats.photosCount} icon={Images} color="purple" />
        <div className="bg-[#0a0a0a] p-8 rounded-[2rem] border border-white/5 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl -mr-16 -mt-16 rounded-full group-hover:bg-white/10 transition-colors" />
            <h3 className="text-white/30 text-[10px] font-black uppercase tracking-widest relative z-10">Quick Operations</h3>
            <div className="flex flex-col gap-3 mt-6 relative z-10">
                <Link href="/admin/photos/upload" className="w-full bg-white text-black text-center py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                    <Plus size={14} />
                    Media Manager
                </Link>
                <Link href="/admin/albums/create" className="w-full bg-white/5 border border-white/10 text-white text-center py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                    New Collection
                </Link>
            </div>
        </div>
      </motion.div>

      {/* RECENT PHOTOS */}
      <motion.div variants={item} className="space-y-8">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Sparkles size={20} className="text-accent-cta" />
                <h2 className="text-2xl font-black tracking-tight italic uppercase">Recent Activity</h2>
            </div>
            <Link href="/admin/albums" className="text-white/20 hover:text-white transition-all text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 group">
                System Archives <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </Link>
        </div>

        {stats.recentPhotos.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {stats.recentPhotos.map((photo: any) => (
                    <motion.div 
                        key={photo.id} 
                        whileHover={{ y: -10 }}
                        className="group relative aspect-square bg-[#0a0a0a] rounded-2xl overflow-hidden border border-white/5 shadow-xl"
                    >
                        <img 
                            src={photo.imageUrl} 
                            alt={photo.title}
                            className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 p-4 flex flex-col justify-end backdrop-blur-[2px]">
                            <p className="text-[10px] font-black uppercase tracking-widest truncate">{photo.title}</p>
                            <p className="text-[8px] text-white/40 truncate uppercase tracking-tighter font-bold">{photo.album?.name}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        ) : (
            <div className="py-24 text-center border-2 border-dashed border-white/5 rounded-[3rem] bg-white/[0.01]">
                <Images size={48} className="text-white/5 mx-auto mb-6" />
                <p className="text-white/20 text-sm font-black uppercase tracking-widest">Digital void detected</p>
                <Link href="/admin/photos/upload" className="inline-block mt-6 bg-white/5 hover:bg-white/10 text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all">
                    Initiate First Upload
                </Link>
            </div>
        )}
      </motion.div>
    </motion.div>
  );
}

function StatCard({ title, value, icon: Icon, color }: { title: string, value: number, icon: any, color: string }) {
    return (
        <div className="bg-[#0a0a0a] p-8 rounded-[2.5rem] border border-white/5 hover:border-white/10 transition-all group relative overflow-hidden shadow-2xl">
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/[0.02] rounded-full -mr-16 -mb-16 group-hover:scale-150 transition-transform duration-1000" />
            <div className="flex items-center justify-between relative z-10">
                <div>
                    <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em]">{title}</p>
                    <h2 className="text-5xl font-black mt-4 tracking-tighter italic">{value}</h2>
                </div>
                <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-white/20 group-hover:text-white transition-all group-hover:scale-110 duration-500">
                    <Icon size={24} />
                </div>
            </div>
        </div>
    );
}