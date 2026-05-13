"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Toast, { ToastType } from "@/components/Toast";

export default function AdminSettingsPage() {
  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [heroImage, setHeroImage] = useState("");
  
  const [logoUrl, setLogoUrl] = useState("");
  const [useDefaultLogo, setUseDefaultLogo] = useState(true);
  const [profilePicUrl, setProfilePicUrl] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [vimeoUrl, setVimeoUrl] = useState("");
  const [telegramUrl, setTelegramUrl] = useState("");
  const [facebookUrl, setFacebookUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [location, setLocation] = useState("");
  const [aboutText, setAboutText] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Toast state
  const [toast, setToast] = useState({ isVisible: false, message: "", type: "success" as ToastType });

  useEffect(() => {
    loadSettings();
  }, []);

  function showToast(message: string, type: ToastType) {
    setToast({ isVisible: true, message, type });
  }

  async function loadSettings() {
    try {
      const res = await api.get("/setting");
      if (res.data) {
        setHeroTitle(res.data.heroTitle || "");
        setHeroSubtitle(res.data.heroSubtitle || "");
        setHeroImage(res.data.heroImage || "");
        setLogoUrl(res.data.logoUrl || "");
        setUseDefaultLogo(res.data.useDefaultLogo ?? true);
        setProfilePicUrl(res.data.profilePicUrl || "");
        setContactEmail(res.data.contactEmail || "");
        setContactPhone(res.data.contactPhone || "");
        setInstagramUrl(res.data.instagramUrl || "");
        setVimeoUrl(res.data.vimeoUrl || "");
        setTelegramUrl(res.data.telegramUrl || "");
        setFacebookUrl(res.data.facebookUrl || "");
        setYoutubeUrl(res.data.youtubeUrl || "");
        setLocation(res.data.location || "");
        setAboutText(res.data.aboutText || "");
      }
    } catch (err) {
      showToast("Failed to load settings", "error");
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
        logoUrl,
        useDefaultLogo,
        profilePicUrl,
        contactEmail,
        contactPhone,
        instagramUrl,
        vimeoUrl,
        telegramUrl,
        facebookUrl,
        youtubeUrl,
        location,
        aboutText
      });
      showToast("Settings updated successfully", "success");
    } catch (err) {
      showToast("Failed to save changes", "error");
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
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div>
        <h1 className="text-4xl font-black tracking-tighter italic uppercase">Site Settings</h1>
        <p className="text-white/50 mt-1 font-medium">Elevate your portfolio's presence and core identity.</p>
      </div>

      <div className="grid grid-cols-1 gap-12">
        {/* BRANDING SECTION */}
        <div className="bg-[#0a0a0a] p-10 rounded-[2.5rem] border border-white/5 space-y-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[100px] -mr-32 -mt-32 rounded-full group-hover:bg-white/10 transition-colors duration-700" />
            <h2 className="text-2xl font-black tracking-tight border-b border-white/5 pb-6">Identity & Branding</h2>
            
            <div className="flex flex-col md:flex-row gap-12 items-start">
                <div className="space-y-4 w-full md:w-1/2">
                    <label className="text-xs font-black uppercase tracking-widest text-white/30">Logo Management</label>
                    <div className="space-y-6 bg-white/[0.02] p-6 rounded-3xl border border-white/5">
                        <div className="flex items-center justify-between p-4 bg-white/[0.03] rounded-2xl">
                            <span className="text-sm font-bold">Use Default Text Logo</span>
                            <button 
                                onClick={() => setUseDefaultLogo(!useDefaultLogo)}
                                className={`w-14 h-8 rounded-full transition-all duration-500 relative flex items-center px-1 ${useDefaultLogo ? 'bg-white' : 'bg-white/10'}`}
                            >
                                <div className={`w-6 h-6 rounded-full transition-transform duration-500 shadow-sm ${useDefaultLogo ? 'translate-x-6 bg-black' : 'translate-x-0 bg-white'}`} />
                            </button>
                        </div>
                        
                        {!useDefaultLogo && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-500">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/20">Custom Logo URL</label>
                                    <input
                                        placeholder="https://..."
                                        value={logoUrl}
                                        onChange={(e) => setLogoUrl(e.target.value)}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/40 transition-colors text-sm"
                                    />
                                </div>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;
                                            const form = new FormData();
                                            form.append('file', file);
                                            try {
                                                const res = await api.post('/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } });
                                                if (res.data.url) setLogoUrl(res.data.url);
                                            } catch (err) { alert("Logo upload failed"); }
                                        }}
                                        className="text-[10px] text-white/40 file:bg-white/10 file:border-0 file:rounded-full file:px-4 file:py-2 file:text-white file:mr-4 hover:file:bg-white/20 cursor-pointer"
                                    />
                                </div>
                                {logoUrl && (
                                    <div className="mt-4 h-20 bg-white/[0.02] rounded-2xl flex items-center justify-center border border-white/5 p-4">
                                        <img src={logoUrl} alt="Logo Preview" className="max-h-full object-contain filter invert opacity-80" />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-4 w-full md:w-1/2">
                    <label className="text-xs font-black uppercase tracking-widest text-white/30">Profile Image</label>
                    <div className="flex items-center gap-8 bg-white/[0.02] p-6 rounded-3xl border border-white/5">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/10 bg-white/[0.05] shrink-0">
                            {profilePicUrl ? (
                                <img src={profilePicUrl} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-white/10">
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                </div>
                            )}
                        </div>
                        <div className="space-y-4 flex-1">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    const form = new FormData();
                                    form.append('file', file);
                                    try {
                                        const res = await api.post('/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } });
                                        if (res.data.url) setProfilePicUrl(res.data.url);
                                    } catch (err) { alert("Profile upload failed"); }
                                }}
                                className="text-[10px] text-white/40 file:bg-white file:text-black file:border-0 file:rounded-full file:px-6 file:py-2 file:font-bold file:mr-4 hover:file:bg-white/80 cursor-pointer"
                            />
                            <p className="text-[10px] font-medium text-white/20 italic">Suggested: 500x500px square crop for contact page.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* CONTACT & SOCIAL SECTION */}
        <div className="bg-[#0a0a0a] p-10 rounded-[2.5rem] border border-white/5 space-y-8 shadow-2xl">
            <h2 className="text-2xl font-black tracking-tight border-b border-white/5 pb-6">Contact & Social Reach</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-white/30">Location</label>
                    <input
                        placeholder="New York, USA"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:bg-white/[0.05] focus:border-white/20 transition-all font-medium"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-white/30">Email Address</label>
                    <input
                        placeholder="hello@zeki.com"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:bg-white/[0.05] focus:border-white/20 transition-all font-medium"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-white/30">Phone Number</label>
                    <input
                        placeholder="+1 (555) 000-0000"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:bg-white/[0.05] focus:border-white/20 transition-all font-medium"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-white/30">Instagram URL</label>
                    <input
                        placeholder="https://instagram.com/zeki"
                        value={instagramUrl}
                        onChange={(e) => setInstagramUrl(e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:bg-white/[0.05] focus:border-white/20 transition-all font-medium"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-white/30">Vimeo URL</label>
                    <input
                        placeholder="https://vimeo.com/zeki"
                        value={vimeoUrl}
                        onChange={(e) => setVimeoUrl(e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:bg-white/[0.05] focus:border-white/20 transition-all font-medium"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-white/30">Telegram URL</label>
                    <input
                        placeholder="https://t.me/zeki"
                        value={telegramUrl}
                        onChange={(e) => setTelegramUrl(e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:bg-white/[0.05] focus:border-white/20 transition-all font-medium"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-white/30">Facebook URL</label>
                    <input
                        placeholder="https://facebook.com/zeki"
                        value={facebookUrl}
                        onChange={(e) => setFacebookUrl(e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:bg-white/[0.05] focus:border-white/20 transition-all font-medium"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-white/30">YouTube URL</label>
                    <input
                        placeholder="https://youtube.com/@zeki"
                        value={youtubeUrl}
                        onChange={(e) => setYoutubeUrl(e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:bg-white/[0.05] focus:border-white/20 transition-all font-medium"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-white/30">About Text (Contact Page)</label>
                <textarea
                    placeholder="A brief intro about your creative vision and approach..."
                    value={aboutText}
                    onChange={(e) => setAboutText(e.target.value)}
                    rows={6}
                    className="w-full bg-white/[0.03] border border-white/5 rounded-3xl px-6 py-5 text-white focus:outline-none focus:bg-white/[0.05] focus:border-white/20 transition-all font-medium resize-none"
                />
            </div>
        </div>

        {/* HERO CONFIGURATION */}
        <div className="bg-[#0a0a0a] p-10 rounded-[2.5rem] border border-white/5 space-y-8 shadow-2xl">
            <h2 className="text-2xl font-black tracking-tight border-b border-white/5 pb-6">Hero Performance</h2>
            
            <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-white/30">Hero Heading</label>
                        <input
                            placeholder="e.g. ZEKI"
                            value={heroTitle}
                            onChange={(e) => setHeroTitle(e.target.value)}
                            className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:bg-white/[0.05] focus:border-white/20 transition-all font-medium"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-white/30">Hero Subheading</label>
                        <input
                            placeholder="e.g. Visual Storyteller"
                            value={heroSubtitle}
                            onChange={(e) => setHeroSubtitle(e.target.value)}
                            className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:bg-white/[0.05] focus:border-white/20 transition-all font-medium"
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="text-xs font-black uppercase tracking-widest text-white/30">Hero Background</label>
                    <div className="flex flex-col md:flex-row items-center gap-6 p-4 bg-white/[0.02] rounded-3xl border border-white/5">
                        <input
                            placeholder="https://example.com/hero.jpg"
                            value={heroImage}
                            onChange={(e) => setHeroImage(e.target.value)}
                            className="flex-1 w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-white/40 transition-colors text-sm"
                        />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const form = new FormData();
                                form.append('file', file);
                                try {
                                    const res = await api.post('/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } });
                                    if (res.data.url) setHeroImage(res.data.url);
                                } catch (err) { alert("Hero upload failed"); }
                            }}
                            className="text-[10px] text-white/40 file:bg-white/10 file:border-0 file:rounded-full file:px-6 file:py-2 file:text-white hover:file:bg-white/20 cursor-pointer"
                        />
                    </div>
                    {heroImage && (
                        <div className="aspect-[21/9] rounded-[2rem] overflow-hidden border border-white/5 relative group bg-white/5 shadow-2xl">
                            <img src={heroImage} alt="Hero Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-sm">
                                <span className="text-xs font-black uppercase tracking-widest border border-white/20 px-8 py-3 rounded-full">Live Hero Preview</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>

        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-6">
            <button
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-white text-black py-6 rounded-3xl font-black uppercase tracking-widest hover:scale-105 active:scale-95 disabled:opacity-50 transition-all shadow-[0_20px_50px_rgba(255,255,255,0.1)] flex items-center justify-center gap-4 group"
            >
                {saving ? (
                    <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                ) : (
                    <>
                        <span>Publish Changes</span>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
                    </>
                )}
            </button>
        </div>
      </div>

      <Toast 
        isVisible={toast.isVisible} 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast({ ...toast, isVisible: false })} 
      />
    </div>
  );
}
