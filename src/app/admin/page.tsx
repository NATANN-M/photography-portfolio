"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";

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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-white/50 mt-2">Manage your portfolio and track your content.</p>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Total Albums" value={stats.albumsCount} icon="📁" />
        <StatCard title="Total Photos" value={stats.photosCount} icon="🖼️" />
        <div className="bg-[#111] p-6 rounded-2xl border border-white/10 flex flex-col justify-between">
            <h3 className="text-white/60 text-xs font-bold uppercase tracking-widest">Quick Actions</h3>
            <div className="flex gap-3 mt-4">
                <Link href="/admin/photos/upload" className="flex-1 bg-white text-black text-center py-2.5 rounded-lg font-bold text-xs hover:bg-white/90 transition-colors flex items-center justify-center">
                    Upload
                </Link>
                <Link href="/admin/albums/create" className="flex-1 border border-white/20 text-center py-2.5 rounded-lg font-bold text-xs hover:bg-white/5 transition-colors flex items-center justify-center">
                    New Album
                </Link>
            </div>
        </div>
      </div>

      {/* RECENT PHOTOS */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-bold">Recent Uploads</h2>
            <Link href="/admin/photos" className="text-white/40 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
                View All →
            </Link>
        </div>

        {stats.recentPhotos.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {stats.recentPhotos.map((photo: any) => (
                    <div key={photo.id} className="group relative aspect-square bg-[#111] rounded-xl overflow-hidden border border-white/5">
                        <img 
                            src={photo.imageUrl} 
                            alt={photo.title}
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end">
                            <p className="text-[10px] font-bold truncate">{photo.title}</p>
                            <p className="text-[8px] text-white/40 truncate uppercase tracking-tighter">{photo.album?.name}</p>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="p-12 text-center border-2 border-dashed border-white/10 rounded-3xl">
                <p className="text-white/30 text-sm">No photos uploaded yet.</p>
                <Link href="/admin/photos/upload" className="inline-block mt-4 text-white hover:underline text-xs font-bold">
                    Upload your first photo
                </Link>
            </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string, value: number, icon: string }) {
    return (
        <div className="bg-[#111] p-6 md:p-8 rounded-2xl border border-white/10 hover:border-white/20 transition-all group">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">{title}</p>
                    <h2 className="text-3xl md:text-4xl font-black mt-2 group-hover:scale-105 transition-transform origin-left">{value}</h2>
                </div>
                <div className="text-2xl md:text-3xl grayscale group-hover:grayscale-0 transition-all opacity-20 group-hover:opacity-100">
                    {icon}
                </div>
            </div>
        </div>
    );
}