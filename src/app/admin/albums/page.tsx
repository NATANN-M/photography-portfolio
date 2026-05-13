"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FolderPlus, Edit3, Trash2, Folder, Loader2 } from "lucide-react";
import Toast, { ToastType } from "@/components/Toast";
import ConfirmModal from "@/components/ConfirmModal";

export default function AdminAlbums() {
    const [albums, setAlbums] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    
    // UI State
    const [toast, setToast] = useState({ isVisible: false, message: "", type: "success" as ToastType });
    const [confirm, setConfirm] = useState({ isOpen: false, id: "" });

    useEffect(() => {
        loadAlbums();
    }, []);

    function showToast(message: string, type: ToastType) {
        setToast({ isVisible: true, message, type });
    }

    async function loadAlbums() {
        try {
            const res = await api.get("/albums");
            setAlbums(res.data);
        } catch (err) {
            showToast("Failed to load albums", "error");
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete() {
        if (!confirm.id) return;
        
        try {
            await api.delete(`/albums/${confirm.id}`);
            setAlbums(albums.filter(a => a.id !== confirm.id));
            showToast("Album deleted successfully", "success");
        } catch (err) {
            showToast("Failed to delete album", "error");
        } finally {
            setConfirm({ isOpen: false, id: "" });
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
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase italic">Manage Albums</h1>
                    <p className="text-white/40 mt-1 font-medium">Organize your work into themed collections.</p>
                </div>
                <Link 
                    href="/admin/albums/create" 
                    className="bg-white text-black px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 w-full sm:w-auto shadow-2xl"
                >
                    <FolderPlus size={18} />
                    <span>Create Album</span>
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {albums.length > 0 ? albums.map((a) => (
                    <div
                        key={a.id}
                        className="group flex flex-col md:flex-row md:items-center justify-between p-8 bg-[#0a0a0a] rounded-[2rem] border border-white/5 hover:border-white/10 transition-all gap-8 shadow-xl relative overflow-hidden"
                    >
                        <div className="flex items-center gap-8">
                            <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-white/5 overflow-hidden flex-shrink-0 flex items-center justify-center border border-white/5 group-hover:scale-105 transition-transform duration-500">
                                {a.coverImage ? (
                                    <img src={a.coverImage} alt={a.name} className="w-full h-full object-cover" />
                                ) : (
                                    <Folder size={40} className="text-white/10" />
                                )}
                            </div>
                            <div className="min-w-0 flex-1 space-y-2">
                                <h3 className="text-2xl font-black tracking-tight text-white">{a.name}</h3>
                                <p className="text-white/40 text-sm font-medium line-clamp-1">{a.description || "No description provided."}</p>
                                <div className="flex gap-4 items-center">
                                    <span className="text-[10px] text-white/20 font-black uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full">
                                        /{a.slug}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <button 
                                onClick={() => router.push(`/admin/albums/edit/${a.id}`)}
                                className="flex-1 md:flex-none p-4 rounded-xl bg-white/5 hover:bg-white text-white/40 hover:text-black transition-all group/btn"
                            >
                                <Edit3 size={20} />
                            </button>
                            <button 
                                onClick={() => setConfirm({ isOpen: true, id: a.id })}
                                className="flex-1 md:flex-none p-4 rounded-xl bg-red-500/5 hover:bg-red-500 text-red-500 hover:text-white transition-all"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>
                )) : (
                    <div className="py-32 text-center border-2 border-dashed border-white/5 rounded-[3rem] bg-white/[0.01]">
                        <Folder size={48} className="text-white/5 mx-auto mb-6" />
                        <p className="text-white/20 text-sm font-black uppercase tracking-widest">No albums created yet</p>
                    </div>
                )}
            </div>

            <ConfirmModal 
                isOpen={confirm.isOpen}
                title="Delete Album?"
                message="This action is permanent and will remove all photos associated with this album. Are you sure you want to proceed?"
                confirmLabel="Delete Permanently"
                onConfirm={handleDelete}
                onCancel={() => setConfirm({ isOpen: false, id: "" })}
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