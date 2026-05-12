"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function AdminSettingsPage() {
  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [heroImage, setHeroImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const res = await api.get("/setting");
      if (res.data) {
        setHeroTitle(res.data.heroTitle || "");
        setHeroSubtitle(res.data.heroSubtitle || "");
        setHeroImage(res.data.heroImage || "");
      }
    } catch (err) {
      console.error("Failed to load settings", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      await api.put("/setting", {
        heroTitle,
        heroSubtitle,
        heroImage,
      });
      alert("Settings saved successfully!");
    } catch (err) {
      alert("Failed to save settings");
    } finally {
      setSaving(false);
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
    <div className="max-w-3xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Site Settings</h1>
        <p className="text-white/50 mt-1">Customize the global appearance and content of your portfolio.</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* HERO CONFIGURATION */}
        <div className="bg-[#111] p-8 rounded-3xl border border-white/10 space-y-6">
            <h2 className="text-xl font-bold border-b border-white/5 pb-4">Hero Section</h2>
            
            <div className="space-y-2">
                <label className="text-sm font-medium text-white/60">Main Hero Title</label>
                <input
                    placeholder="e.g. Capturing Moments"
                    value={heroTitle}
                    onChange={(e) => setHeroTitle(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/40 transition-colors"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-white/60">Hero Subtitle</label>
                <input
                    placeholder="e.g. Professional Photography Portfolio"
                    value={heroSubtitle}
                    onChange={(e) => setHeroSubtitle(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/40 transition-colors"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-white/60">Hero Background Image URL</label>
                <input
                    placeholder="https://example.com/hero.jpg"
                    value={heroImage}
                    onChange={(e) => setHeroImage(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/40 transition-colors"
                />
                {heroImage && (
                    <div className="mt-4 aspect-video rounded-2xl overflow-hidden border border-white/10 relative group">
                        <img src={heroImage} alt="Hero Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-xs font-bold uppercase tracking-widest">Live Preview</span>
                        </div>
                    </div>
                )}
            </div>
        </div>

        <div className="flex justify-end">
            <button
                onClick={handleSave}
                disabled={saving}
                className="bg-white text-black px-10 py-4 rounded-xl font-bold hover:bg-white/90 disabled:opacity-50 transition-all shadow-xl active:scale-95"
            >
                {saving ? "Saving Changes..." : "Save All Settings"}
            </button>
        </div>
      </div>
    </div>
  );
}
