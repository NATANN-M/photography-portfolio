"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FolderPlus, Edit3, Trash2, Folder, Loader2, ArrowUpRight } from "lucide-react";
import Toast, { ToastType } from "@/components/Toast";
import ConfirmModal from "@/components/ConfirmModal";
import { useLanguage } from "@/context/LanguageContext";

export default function AdminAlbums() {
    const { t } = useLanguage();
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
            showToast(t("error"), "error");
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete() {
        if (!confirm.id) return;
        
        try {
            await api.delete(`/albums/${confirm.id}`);
            setAlbums(albums.filter(a => a.id !== confirm.id));
            showToast(t("success"), "success");
        } catch (err) {
            showToast(t("error"), "error");
        } finally {
            setConfirm({ isOpen: false, id: "" });
        }
    }

    if (loading) {
        return (
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="animate-spin text-foreground/20" size={40} />
          </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 px-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase italic">{t("albums")}</h1>
                    <p className="text-foreground/40 mt-1 font-medium">{t("latestCollections")}</p>
                </div>
                <Link 
                    href="/admin/albums/create" 
                    className="bg-foreground text-background px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 w-full sm:w-auto shadow-2xl"
                >
                    <FolderPlus size={18} />
                    <span>{t("create")}</span>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
                {albums.length > 0 ? albums.map((a) => (
                    <div
                        key={a.id}
                        className="group flex flex-col lg:flex-row lg:items-center justify-between p-6 md:p-8 bg-card rounded-[2rem] border border-border-custom hover:border-foreground/10 transition-all gap-8 shadow-xl relative overflow-hidden"
                    >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 md:gap-8 flex-1 min-w-0">
                            <div className="w-full sm:w-32 h-40 sm:h-32 rounded-2xl bg-foreground/5 overflow-hidden flex-shrink-0 flex items-center justify-center border border-border-custom group-hover:scale-105 transition-transform duration-500">
                                {a.coverImage ? (
                                    <img src={a.coverImage} alt={a.name} className="w-full h-full object-cover" />
                                ) : (
                                    <Folder size={40} className="text-foreground/10" />
                                )}
                            </div>
                            <div className="min-w-0 flex-1 space-y-2">
                                <h3 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-3">
                                    {a.name}
                                    <Link href={`/albums/${a.slug}`} target="_blank" className="opacity-0 group-hover:opacity-100 transition-opacity text-foreground/20 hover:text-foreground">
                                        <ArrowUpRight size={16} />
                                    </Link>
                                </h3>
                                <p className="text-foreground/40 text-sm font-medium line-clamp-2 max-w-2xl">{a.description || "No description provided."}</p>
                                <div className="flex gap-4 items-center pt-2">
                                    <span className="text-[10px] text-foreground/40 font-black uppercase tracking-widest bg-foreground/5 px-4 py-1.5 rounded-full border border-border-custom">
                                        /{a.slug}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 w-full lg:w-auto mt-4 lg:mt-0">
                            <button 
                                onClick={() => router.push(`/admin/albums/edit/${a.id}`)}
                                className="flex-1 lg:flex-none bg-foreground/5 hover:bg-foreground text-foreground/40 hover:text-background px-6 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 group/btn"
                            >
                                <Edit3 size={16} />
                                <span>{t("edit")}</span>
                            </button>
                            <button 
                                onClick={() => setConfirm({ isOpen: true, id: a.id })}
                                className="flex-1 lg:flex-none bg-red-500/5 hover:bg-red-500 text-red-500 hover:text-white px-6 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2"
                            >
                                <Trash2 size={16} />
                                <span>{t("delete")}</span>
                            </button>
                        </div>
                    </div>
                )) : (
                    <div className="py-32 text-center border-2 border-dashed border-border-custom rounded-[3rem] bg-foreground/[0.01]">
                        <Folder size={48} className="text-foreground/5 mx-auto mb-6" />
                        <p className="text-foreground/20 text-sm font-black uppercase tracking-widest">No albums created yet</p>
                    </div>
                )}
            </div>

            <ConfirmModal 
                isOpen={confirm.isOpen}
                title="Delete?"
                message="This action is permanent."
                confirmLabel={t("delete")}
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