
"use client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";

export default function ContactPage() {
  const [setting, setSetting] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.get("/setting");
        setSetting(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="bg-[#0a0a0a] min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-white/10 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white font-sans selection:bg-white selection:text-black">
      <Navbar />

      <section className="pt-40 pb-20 px-6 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          {/* LEFT COLUMN: INFO */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-12"
          >
            <div>
              <h2 className="text-sm font-black uppercase tracking-[0.5em] text-white/30 mb-6">Let's Connect</h2>
              <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.8] mb-8">
                Get in <br /> <span className="text-white/20 italic">Touch.</span>
              </h1>
              <p className="text-white/60 text-lg md:text-xl font-medium leading-relaxed max-w-lg">
                {setting?.aboutText || "Available for global assignments and creative collaborations. Let's create something extraordinary together."}
              </p>
            </div>

            <div className="space-y-8">
              {setting?.location && (
                <div className="group">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-2">Location</p>
                  <p className="text-3xl md:text-4xl font-bold text-white/80">
                    {setting.location}
                  </p>
                </div>
              )}
              {setting?.contactEmail && (
                <div className="group">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-2">Email</p>
                  <a href={`mailto:${setting.contactEmail}`} className="text-3xl md:text-4xl font-bold hover:text-white/60 transition-colors">
                    {setting.contactEmail}
                  </a>
                </div>
              )}
              {setting?.contactPhone && (
                <div className="group">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-2">Phone</p>
                  <a href={`tel:${setting.contactPhone}`} className="text-3xl md:text-4xl font-bold hover:text-white/60 transition-colors">
                    {setting.contactPhone}
                  </a>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-8 pt-8">
              {setting?.instagramUrl && (
                <a href={setting.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-black uppercase tracking-widest hover:text-white/40 transition-colors">Instagram</a>
              )}
              {setting?.vimeoUrl && (
                <a href={setting.vimeoUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-black uppercase tracking-widest hover:text-white/40 transition-colors">Vimeo</a>
              )}
              {setting?.telegramUrl && (
                <a href={setting.telegramUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-black uppercase tracking-widest hover:text-white/40 transition-colors">Telegram</a>
              )}
              {setting?.facebookUrl && (
                <a href={setting.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-black uppercase tracking-widest hover:text-white/40 transition-colors">Facebook</a>
              )}
              {setting?.youtubeUrl && (
                <a href={setting.youtubeUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-black uppercase tracking-widest hover:text-white/40 transition-colors">YouTube</a>
              )}
            </div>
          </motion.div>

          {/* RIGHT COLUMN: IMAGE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="aspect-[3/4] rounded-[3rem] overflow-hidden bg-white/5 border border-white/10 relative shadow-2xl group">
              {setting?.profilePicUrl ? (
                <img
                  src={setting.profilePicUrl}
                  alt="Profile"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-[1.5s]"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-white/5 to-transparent">
                  <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-white/10">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
              )}

              {/* Floating Badge */}
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white text-black rounded-full flex items-center justify-center p-8 animate-spin-slow shadow-2xl">
                <p className="text-[10px] font-black uppercase tracking-widest text-center">
                  Creativity • Vision • Passion • Light •
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER SHORT */}
      <footer className="py-20 px-6 border-t border-white/5">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <p className="text-white/20 text-[10px] font-black tracking-widest uppercase italic">
            © {new Date().getFullYear()} zeki photography.
          </p>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-white/40">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <a href="/albums" className="hover:text-white transition-colors">Albums</a>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 15s linear infinite;
        }
      `}</style>
    </div>
  );
}
