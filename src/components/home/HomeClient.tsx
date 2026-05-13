"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

interface HomeClientProps {
  initialSetting: any;
  initialAlbums: any[];
  initialRecentPhotos: any[];
}

export default function HomeClient({ 
  initialSetting, 
  initialAlbums, 
  initialRecentPhotos 
}: HomeClientProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [year, setYear] = useState("");

  useEffect(() => {
    setYear(new Date().getFullYear().toString());
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  const safeEncode = (url: string) => {
    if (!url) return "";
    try {
        return encodeURI(url);
    } catch (e) {
        return url;
    }
  };

  return (
    <div className="bg-background min-h-screen text-foreground font-sans selection:bg-foreground selection:text-background transition-colors duration-500">
      <Navbar initialSetting={initialSetting} />

      {/* CURTAIN REVEAL OVERLAY */}
      <motion.div 
        initial={{ height: "100%" }}
        animate={{ height: "0%" }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        className="fixed inset-0 bg-foreground z-[150] origin-top pointer-events-none"
      />

      {/* HERO SECTION */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 z-0"
        >
            <motion.div 
                animate={{ 
                    scale: [1, 1.05, 1],
                    rotate: [0, 0.5, -0.5, 0]
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className={`relative w-full h-full brightness-[0.6] ${theme === 'dark' ? 'grayscale-[0.2]' : ''}`}
            >
                <Image
                    src={initialSetting?.heroImage || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80"}
                    alt="Hero Background"
                    fill
                    priority
                    className="object-cover"
                />
            </motion.div>
        </motion.div>
        
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-background via-background/40 to-transparent" />

        <div className="relative z-20 w-full max-w-7xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center text-center"
          >
            <div className="bg-background/5 backdrop-blur-xl border border-foreground/10 p-12 md:p-24 rounded-[4rem] shadow-2xl relative group overflow-hidden max-w-5xl w-full">
                <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                
                <motion.span 
                    initial={{ opacity: 0, tracking: "0.5em" }}
                    animate={{ opacity: 0.4, tracking: "0.3em" }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="text-[10px] md:text-xs font-black uppercase tracking-widest mb-10 block"
                >
                    {initialSetting?.heroSubtitle?.toLowerCase() || t("visualStoryteller").toLowerCase()}
                </motion.span>

                <div className="overflow-hidden mb-12">
                    <motion.h1 
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="text-7xl md:text-[11rem] font-black tracking-tighter leading-none italic uppercase"
                    >
                        {initialSetting?.heroTitle?.toLowerCase() || "zeki"}<span className="text-accent-cta">.</span>
                    </motion.h1>
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="flex flex-col items-center gap-12"
                >
                    <button 
                        onClick={() => router.push("/contact")}
                        className="pill-button bg-foreground text-background hover:scale-105 active:scale-95 px-16 py-6 text-xs font-black uppercase tracking-[0.2em] shadow-xl transition-all"
                    >
                        {t("initiateContact")}
                    </button>

                    <motion.button
                        onClick={() => document.getElementById("albums")?.scrollIntoView({ behavior: "smooth" })}
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="flex flex-col items-center gap-4 group cursor-pointer"
                    >
                        <span className="text-[9px] font-black uppercase tracking-[0.5em] text-foreground/20 group-hover:text-foreground transition-colors">{t("exploreArchive")}</span>
                        <div className="w-6 h-10 rounded-full border border-foreground/20 flex justify-center p-1.5">
                            <motion.div 
                                animate={{ y: [0, 12, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="w-1 h-2 bg-foreground rounded-full" 
                            />
                        </div>
                    </motion.button>
                </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SPOTLIGHT SECTION */}
      {initialRecentPhotos.length > 0 && (
        <section id="spotlight" className="py-32 px-6">
            <div className="max-w-[1400px] mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-baseline mb-20 gap-4">
                    <div>
                        <h2 className="text-sm font-black uppercase tracking-widest text-accent-cta mb-2">{t("recentCaptures").toLowerCase()}</h2>
                        <h3 className="text-6xl md:text-8xl font-black tracking-tighter leading-none">{t("spotlight").toLowerCase()}<span className="text-accent-cta">.</span></h3>
                    </div>
                    <p className="text-foreground/40 font-bold max-w-xs text-sm">
                        {t("cinematicVision").toLowerCase()}
                    </p>
                </div>

                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  className="grid grid-cols-1 md:grid-cols-12 gap-6"
                >
                    {initialRecentPhotos.map((photo, i) => {
                        const isWide = i % 5 === 0;
                        const isTall = i % 4 === 1;
                        return (
                          <motion.div 
                            key={photo.id}
                            variants={itemVariants}
                            className={`relative group overflow-hidden rounded-[2rem] bg-foreground/5 
                              ${isWide ? "md:col-span-8 aspect-[16/9]" : isTall ? "md:col-span-4 row-span-2 aspect-[9/16]" : "md:col-span-4 aspect-square"}
                            `}
                          >
                              <Image 
                                  src={safeEncode(photo.imageUrl)} 
                                  alt={photo.title}
                                  fill
                                  className="object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              />
                              <div className="absolute inset-0 bg-background/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8 md:p-12">
                                  <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                    <span className="text-xs font-black uppercase tracking-widest text-foreground/60 mb-2 block">{photo.album?.name?.toLowerCase() || t("featured").toLowerCase()}</span>
                                    <h4 className="text-2xl md:text-3xl font-black tracking-tighter">{photo.title?.toLowerCase()}</h4>
                                  </div>
                              </div>
                          </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
      )}

      {/* ALBUMS SECTION */}
      <section id="albums" className="max-w-[1400px] mx-auto px-6 py-40 border-t border-foreground/5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mb-32 items-end">
            <div>
                <h2 className="text-sm font-black uppercase tracking-widest text-accent-cta mb-4">{t("latestCollections").toLowerCase()}</h2>
                <h3 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.8]">
                    {t("photographyArchives").split(' ')[0]} <br/> <span className="text-foreground/20">{t("photographyArchives").split(' ')[1]}.</span>
                </h3>
            </div>
            <div className="space-y-8">
                <p className="text-foreground/60 text-lg font-bold leading-relaxed max-w-md">
                    {t("intersection").toLowerCase()}
                </p>
                <button 
                    onClick={() => router.push("/albums")}
                    className="pill-button border-2 border-foreground hover:bg-foreground hover:text-background"
                >
                    {t("viewAllAlbums").toLowerCase()}
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
          {initialAlbums.map((a, index) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                onClick={() => router.push(`/albums/${a.slug}`)}
                className="group cursor-pointer space-y-8"
              >
                <div className="relative overflow-hidden rounded-[2.5rem] aspect-[4/5] bg-foreground/5">
                  <Image
                    src={a.coverImage || "https://images.unsplash.com/photo-1493246507139-91e8bef99c02?auto=format&fit=crop&q=80"}
                    alt={a.name}
                    fill
                    className="object-cover transition-transform duration-[2s] group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-background/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center backdrop-blur-md">
                      <span className="pill-button bg-foreground text-background">
                          {t("openCollection").toLowerCase()}
                      </span>
                  </div>
                </div>
                <div className="flex justify-between items-start px-4">
                    <div className="space-y-1">
                        <h3 className="text-4xl font-black tracking-tighter">{a.name?.toLowerCase()}</h3>
                        <p className="text-foreground/40 font-bold tracking-tight">{a.description?.toLowerCase() || "collection"}</p>
                    </div>
                    <span className="text-xl font-black opacity-10">0{index + 1}</span>
                </div>
              </motion.div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-32 px-6 bg-foreground text-background rounded-t-[3rem] transition-colors duration-500">
        <div className="max-w-[1400px] mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-20 mb-20">
                <h2 className="text-8xl md:text-[12rem] font-black tracking-tighter leading-none">zeki<span className="text-accent-cta">.</span></h2>
                <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                    {[t("home"), t("archive"), t("contact")].map(item => (
                        <Link key={item} href="#" className="text-sm font-black uppercase tracking-widest hover:text-accent-cta transition-colors">{item}</Link>
                    ))}
                </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-12 border-t border-background/10">
                <p className="font-bold tracking-tight opacity-40">
                    © {year} {initialSetting?.heroTitle?.toLowerCase() || "zeki"} photography.
                </p>
            </div>
        </div>
      </footer>
    </div>
  );
}
