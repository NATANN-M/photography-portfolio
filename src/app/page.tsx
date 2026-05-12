"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function HomePage() {
  const [setting, setSetting] = useState<any>(null);
  const [albums, setAlbums] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [settingRes, albumRes] = await Promise.all([
        api.get("/setting"),
        api.get("/albums"),
      ]);
      setSetting(settingRes.data);
      setAlbums(albumRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white font-sans selection:bg-white selection:text-black">
      <Navbar />

      {/* HERO SECTION - ULTRA MODERN */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Ken Burns Effect */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat animate-ken-burns"
          style={{ backgroundImage: `url(${setting?.heroImage || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80"})` }}
        />
        <div className="absolute inset-0 z-10 bg-black/40" />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />

        {/* Hero Content */}
        <div className="relative z-20 text-center px-6">
          <div className="overflow-hidden mb-4">
            <h1 className="text-7xl md:text-[10rem] font-bold tracking-tighter leading-none text-gradient animate-slide-up">
              {setting?.heroTitle || "ZEKI"}
            </h1>
          </div>
          <div className="overflow-hidden">
            <p className="text-lg md:text-xl font-light tracking-[0.5em] uppercase opacity-50 animate-slide-up delay-200">
                {setting?.heroSubtitle || "Visual Storyteller"}
            </p>
          </div>
          
          <div className="mt-20 animate-fade-in delay-500">
            <button 
                onClick={() => document.getElementById("albums")?.scrollIntoView({ behavior: "smooth" })}
                className="group relative px-8 py-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-full hover:bg-white hover:text-black transition-all duration-500 overflow-hidden"
            >
                <span className="relative z-10 font-bold uppercase tracking-widest text-xs">Explore Portfolio</span>
            </button>
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute bottom-10 left-10 hidden lg:block animate-fade-in delay-700">
            <p className="text-[10px] font-bold tracking-widest uppercase opacity-20 rotate-90 origin-left">
                Scroll to discover
            </p>
        </div>
      </section>

      {/* ALBUMS SECTION - MODERN ASYMMETRIC GRID */}
      <section id="albums" className="max-w-[1600px] mx-auto px-6 py-40">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-10">
            <div className="max-w-2xl">
                <h2 className="text-xs font-bold uppercase tracking-[0.5em] text-white/30 mb-6">Selected Works</h2>
                <h3 className="text-5xl md:text-7xl font-bold tracking-tight leading-[0.9]">
                    Photography <br/> <span className="text-white/40">Collections.</span>
                </h3>
            </div>
            <div className="md:text-right">
                <p className="text-white/40 text-sm max-w-xs mb-8">
                    A collection of moments captured across the globe, focusing on minimalist landscapes and cinematic portraiture.
                </p>
                <button 
                    onClick={() => router.push("/albums")}
                    className="group flex items-center gap-4 text-white hover:text-white/60 transition-all ml-auto"
                >
                    <span className="text-sm font-bold uppercase tracking-widest">Archive</span>
                    <div className="w-12 h-px bg-white group-hover:w-16 transition-all" />
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-20">
          {albums.map((a, index) => {
            const isWide = index % 3 === 0;
            return (
              <div
                key={a.id}
                onClick={() => router.push(`/albums/${a.slug}`)}
                className={`group cursor-pointer ${isWide ? "md:col-span-8" : "md:col-span-4"} space-y-8 animate-reveal`}
              >
                <div className={`relative overflow-hidden rounded-2xl ${isWide ? "aspect-[16/9]" : "aspect-[3/4]"}`}>
                  <img
                    src={a.coverImage || "https://images.unsplash.com/photo-1493246507139-91e8bef99c02?auto=format&fit=crop&q=80"}
                    alt={a.name}
                    className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center backdrop-blur-sm">
                      <span className="text-white font-bold uppercase tracking-[0.3em] text-xs border border-white/30 px-6 py-3 rounded-full">
                          Open Album
                      </span>
                  </div>
                </div>
                <div className="flex justify-between items-start">
                    <div className="space-y-2">
                        <h3 className="text-3xl font-bold">{a.name}</h3>
                        <p className="text-white/40 text-sm font-medium tracking-widest uppercase">{a.description || "Collection"}</p>
                    </div>
                    <span className="text-[10px] font-bold opacity-20">0{index + 1}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-40 px-6 border-t border-white/5">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
            <h2 className="text-4xl font-bold italic tracking-tighter">ZEKI.</h2>
            <div className="flex gap-10 text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
                <a href="#" className="hover:text-white transition-colors">Instagram</a>
                <a href="#" className="hover:text-white transition-colors">Vimeo</a>
                <a href="#" className="hover:text-white transition-colors">Email</a>
            </div>
            <p className="text-white/20 text-[10px] font-bold tracking-widest uppercase">
                © {new Date().getFullYear()} ZEKI Photography.
            </p>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes ken-burns {
            0% { transform: scale(1); }
            100% { transform: scale(1.1); }
        }
        @keyframes slide-up {
            0% { transform: translateY(100%); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes fade-in {
            0% { opacity: 0; }
            100% { opacity: 1; }
        }
        .animate-ken-burns { animation: ken-burns 20s ease-in-out infinite alternate; }
        .animate-slide-up { animation: slide-up 1s cubic-bezier(0.23, 1, 0.32, 1) forwards; }
        .animate-fade-in { animation: fade-in 1.5s ease forwards; }
        .delay-200 { animation-delay: 200ms; }
        .delay-500 { animation-delay: 500ms; }
        .delay-700 { animation-delay: 700ms; }
      `}</style>
    </div>
  );
}