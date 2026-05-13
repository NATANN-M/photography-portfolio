"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Toast, { ToastType } from "@/components/Toast";
import { Loader2, Globe, Share2, Palette, Image as ImageIcon, CheckCircle2, ChevronRight, User, Upload } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function AdminSettingsPage() {
  const { t } = useLanguage();
  
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
  const [uploading, setUploading] = useState<string | null>(null);
  
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
      showToast(t("success"), "success");
    } catch (err) {
      showToast(t("error"), "error");
    } finally {
      setSaving(false);
    }
  }

  const handleUpload = async (file: File, type: string) => {
    if (!file) return;
    setUploading(type);
    const form = new FormData();
    form.append('file', file);
    try {
        const res = await api.post('/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } });
        if (res.data.url) {
            if (type === 'logo') setLogoUrl(res.data.url);
            if (type === 'profile') setProfilePicUrl(res.data.url);
            if (type === 'hero') setHeroImage(res.data.url);
            showToast(t("success"), "success");
        }
    } catch (err) { showToast(t("error"), "error"); }
    finally { setUploading(null); }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-foreground/20" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-32 px-4">
      <div>
        <h1 className="text-4xl font-black tracking-tighter italic uppercase">{t("siteSettings")}</h1>
        <p className="text-foreground/40 mt-1 font-medium">{t("controlCenter")}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* NAV - STICKY ON DESKTOP */}
        <div className="lg:col-span-1">
            <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 sticky top-10 z-10 lg:z-0 no-scrollbar">
                <SettingsNavBtn icon={Palette} label={t("branding")} active target="branding" />
                <SettingsNavBtn icon={Globe} label={t("contact")} target="contact" />
                <SettingsNavBtn icon={Share2} label={t("connectivity")} target="socials" />
                <SettingsNavBtn icon={ImageIcon} label="Hero" target="hero" />
            </nav>
        </div>

        <div className="lg:col-span-3 space-y-12">
            {/* BRANDING SECTION */}
            <section id="branding" className="bg-card p-6 md:p-10 rounded-[2.5rem] border border-border-custom space-y-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-foreground/5 blur-[100px] -mr-32 -mt-32 rounded-full" />
                <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                    <Palette size={20} className="text-accent-cta" /> {t("identity")}
                </h2>
                
                <div className="space-y-10 relative z-10">
                    <div className="space-y-6">
                        <label className="text-[10px] font-black uppercase tracking-widest text-foreground/30">Logo Architecture</label>
                        <div className="bg-foreground/[0.02] p-6 rounded-3xl border border-border-custom space-y-6">
                            <div className="flex items-center justify-between p-4 bg-foreground/[0.03] rounded-2xl">
                                <span className="text-xs font-bold uppercase tracking-tight">Use Standard Wordmark</span>
                                <button 
                                    onClick={() => setUseDefaultLogo(!useDefaultLogo)}
                                    className={`w-14 h-8 rounded-full transition-all duration-500 relative flex items-center px-1 ${useDefaultLogo ? 'bg-foreground' : 'bg-foreground/10'}`}
                                >
                                    <div className={`w-6 h-6 rounded-full transition-transform duration-500 shadow-sm ${useDefaultLogo ? 'translate-x-6 bg-background' : 'translate-x-0 bg-foreground'}`} />
                                </button>
                            </div>
                            
                            {!useDefaultLogo && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-500">
                                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                                        <div className="w-20 h-20 bg-foreground/5 rounded-2xl flex items-center justify-center p-4 border border-border-custom shrink-0">
                                            {logoUrl ? <img src={logoUrl} className="max-w-full max-h-full object-contain" /> : <ImageIcon size={24} className="text-foreground/10" />}
                                        </div>
                                        <div className="flex-1 w-full space-y-2">
                                            <input
                                                placeholder="Paste Logo URL..."
                                                value={logoUrl}
                                                onChange={(e) => setLogoUrl(e.target.value)}
                                                className="w-full bg-background/50 border border-border-custom rounded-xl px-4 py-3 text-foreground focus:outline-none text-xs"
                                            />
                                            <label className="block">
                                                <span className="text-[10px] font-black uppercase tracking-widest bg-foreground/5 hover:bg-foreground/10 px-4 py-2 rounded-full cursor-pointer transition-all inline-block">
                                                    {uploading === 'logo' ? t("upload") + '...' : t("upload")}
                                                </span>
                                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload(e.target.files![0], 'logo')} />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <label className="text-[10px] font-black uppercase tracking-widest text-foreground/30">Artist Profile</label>
                        <div className="bg-foreground/[0.02] p-6 rounded-3xl border border-border-custom flex flex-col sm:flex-row items-center gap-8">
                            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-border-custom bg-foreground/[0.05] shrink-0 relative group/pic">
                                {profilePicUrl ? (
                                    <img src={profilePicUrl} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-foreground/10">
                                        <User size={32} />
                                    </div>
                                )}
                                <label className="absolute inset-0 bg-black/60 opacity-0 group-hover/pic:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                                    <Upload size={20} className="text-white" />
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload(e.target.files![0], 'profile')} />
                                </label>
                            </div>
                            <div className="flex-1 w-full space-y-4">
                                <input
                                    placeholder="Profile Image URL..."
                                    value={profilePicUrl}
                                    onChange={(e) => setProfilePicUrl(e.target.value)}
                                    className="w-full bg-background/50 border border-border-custom rounded-xl px-4 py-3 text-foreground focus:outline-none text-xs"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CONTACT SECTION */}
            <section id="contact" className="bg-card p-6 md:p-10 rounded-[2.5rem] border border-border-custom space-y-8 shadow-2xl">
                <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                    <Globe size={20} className="text-accent-cta" /> {t("outreach")}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="Location Base" value={location} onChange={setLocation} placeholder="e.g. Tokyo, Japan" />
                    <InputField label="Email Address" value={contactEmail} onChange={setContactEmail} placeholder="e.g. artist@zeki.com" />
                    <InputField label="Contact Phone" value={contactPhone} onChange={setContactPhone} placeholder="e.g. +81..." />
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-foreground/30">Artist Bio</label>
                    <textarea
                        placeholder="Define your creative philosophy..."
                        value={aboutText}
                        onChange={(e) => setAboutText(e.target.value)}
                        rows={6}
                        className="w-full bg-foreground/[0.03] border border-border-custom rounded-3xl px-6 py-5 text-foreground focus:outline-none focus:bg-foreground/[0.05] transition-all font-medium resize-none text-sm"
                    />
                </div>
            </section>

            {/* SOCIALS SECTION */}
            <section id="socials" className="bg-card p-6 md:p-10 rounded-[2.5rem] border border-border-custom space-y-8 shadow-2xl">
                <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                    <Share2 size={20} className="text-accent-cta" /> {t("connectivity")}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="Instagram" value={instagramUrl} onChange={setInstagramUrl} placeholder="https://..." />
                    <InputField label="Vimeo" value={vimeoUrl} onChange={setVimeoUrl} placeholder="https://..." />
                    <InputField label="Telegram" value={telegramUrl} onChange={setTelegramUrl} placeholder="https://..." />
                    <InputField label="YouTube" value={youtubeUrl} onChange={setYoutubeUrl} placeholder="https://..." />
                </div>
            </section>

            {/* HERO SECTION */}
            <section id="hero" className="bg-card p-6 md:p-10 rounded-[2.5rem] border border-border-custom space-y-8 shadow-2xl">
                <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                    <ImageIcon size={20} className="text-accent-cta" /> {t("heroDynamics")}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="Master Heading" value={heroTitle} onChange={setHeroTitle} placeholder="e.g. ZEKI" />
                    <InputField label="Sub-Narrative" value={heroSubtitle} onChange={setHeroSubtitle} placeholder="e.g. Visual Explorer" />
                </div>

                <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-foreground/30">Hero Background</label>
                    <div className="aspect-[21/9] rounded-[2rem] overflow-hidden border-2 border-border-custom relative group bg-foreground/5">
                        {heroImage ? (
                            <img src={heroImage} alt="Hero" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-foreground/5">
                                <ImageIcon size={48} />
                                <span className="text-[10px] mt-4 font-black uppercase tracking-widest">No Hero Selected</span>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm gap-4">
                            <label className="cursor-pointer bg-white text-black px-8 py-3 rounded-full font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-transform">
                                {uploading === 'hero' ? t("upload") + '...' : t("upload")}
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload(e.target.files![0], 'hero')} />
                            </label>
                        </div>
                    </div>
                    <input
                        placeholder="Or paste direct image URL..."
                        value={heroImage}
                        onChange={(e) => setHeroImage(e.target.value)}
                        className="w-full bg-foreground/[0.03] border border-border-custom rounded-xl px-4 py-3 text-foreground focus:outline-none text-[10px] font-medium"
                    />
                </div>
            </section>
        </div>
      </div>

      {/* SAVE ACTION */}
      <div className="fixed bottom-8 left-0 right-0 z-[100] px-4">
        <div className="max-w-5xl mx-auto flex justify-end">
            <button
                onClick={handleSave}
                disabled={saving}
                className="w-full md:w-auto bg-foreground text-background px-12 py-5 rounded-2xl font-black uppercase tracking-widest hover:scale-105 active:scale-95 disabled:opacity-50 transition-all shadow-2xl flex items-center justify-center gap-4"
            >
                {saving ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
                {saving ? "Syncing..." : t("syncChanges")}
            </button>
        </div>
      </div>

      <Toast 
        isVisible={toast.isVisible} 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast({ ...toast, isVisible: false })} 
      />

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

function SettingsNavBtn({ icon: Icon, label, active, target }: { icon: any, label: string, active?: boolean, target: string }) {
    return (
        <a 
            href={`#${target}`}
            className={`flex items-center gap-3 px-6 py-4 rounded-2xl border transition-all shrink-0 ${
                active 
                ? "bg-foreground text-background border-foreground shadow-xl scale-105" 
                : "bg-foreground/[0.02] text-foreground/40 border-border-custom hover:border-foreground/10 hover:text-foreground"
            }`}
        >
            <Icon size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
        </a>
    );
}

function InputField({ label, value, onChange, placeholder }: { label: string, value: string, onChange: (v: string) => void, placeholder: string }) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-foreground/30">{label}</label>
            <input
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-foreground/[0.03] border border-border-custom rounded-xl px-5 py-4 text-foreground focus:outline-none focus:bg-foreground/[0.05] focus:border-foreground/20 transition-all font-bold text-sm"
            />
        </div>
    );
}
