"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { api } from "@/lib/api";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { Moon, Sun, Languages, Loader2 } from "lucide-react";

export default function Navbar({ initialSetting }: { initialSetting?: any }) {
  const pathname = usePathname();
  const { t, language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [setting, setSetting] = useState<any>(initialSetting || null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    
    // Load settings for logo if not provided
    if (!initialSetting) {
      async function loadSettings() {
        try {
          const res = await api.get("/setting");
          setSetting(res.data);
        } catch (err) {
          console.error(err);
        }
      }
      loadSettings();
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, [initialSetting]);

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  const links = [
    { name: t("home"), href: "/" },
    { name: t("archive"), href: "/albums" },
    { name: t("contact"), href: "/contact" },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 md:px-12 py-6 transition-all duration-500 ${
        scrolled || isOpen ? "bg-background/80 backdrop-blur-xl py-4 border-b border-border-custom" : "bg-transparent"
      }`}>
        <Link href="/" className="group relative z-[110] flex items-center gap-3">
          {setting?.useDefaultLogo === false && setting?.logoUrl ? (
             <Image 
               src={setting.logoUrl} 
               alt="Logo" 
               width={160} 
               height={40} 
               className={`h-8 md:h-10 w-auto object-contain ${theme === 'light' ? 'invert' : ''}`} 
             />
          ) : (
            <span className="text-3xl font-black tracking-tighter text-foreground group">
              zeki<span className="text-accent-cta group-hover:opacity-60 transition-opacity">.</span>
            </span>
          )}
        </Link>
        
        {/* DESKTOP LINKS */}
        <div className="hidden md:flex items-center gap-10">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                pathname === link.href ? "text-foreground" : "text-foreground/40 hover:text-foreground"
              }`}
            >
              {link.name}
            </Link>
          ))}
          
          <div className="flex items-center gap-4 ml-4 pl-4 border-l border-border-custom">
            {/* Language Switcher */}
            <button 
                onClick={() => setLanguage(language === 'en' ? 'am' : 'en')}
                className="p-2 hover:bg-foreground/5 rounded-full transition-colors group flex items-center gap-2"
                title="Switch Language"
            >
                <Languages size={16} className="text-foreground/40 group-hover:text-foreground transition-colors" />
                <span className="text-[10px] font-black uppercase tracking-tighter text-foreground/40 group-hover:text-foreground">{language === 'en' ? 'AM' : 'EN'}</span>
            </button>

            {/* Theme Toggle */}
            <button 
                onClick={toggleTheme}
                className="p-2 hover:bg-foreground/5 rounded-full transition-colors group"
                title="Toggle Theme"
            >
                {theme === 'dark' ? (
                    <Sun size={16} className="text-foreground/40 group-hover:text-foreground transition-colors" />
                ) : (
                    <Moon size={16} className="text-foreground/40 group-hover:text-foreground transition-colors" />
                )}
            </button>

            <Link
                href="/login"
                className="pill-button bg-foreground text-background hover:opacity-90 active:scale-95 ml-2"
            >
                {t("login")}
            </Link>
          </div>
        </div>

        {/* MOBILE MENU TOGGLE */}
        <div className="flex items-center gap-4 md:hidden">
            <button 
                onClick={toggleTheme}
                className="p-2 text-foreground/40"
            >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="text-foreground flex flex-col gap-1.5 p-2 relative z-[110] cursor-pointer"
                aria-label="Toggle Menu"
            >
                <div className={`w-6 h-0.5 bg-foreground transition-all duration-300 origin-center ${isOpen ? "rotate-45 translate-y-2" : ""}`} />
                <div className={`w-6 h-0.5 bg-foreground transition-all duration-300 ${isOpen ? "opacity-0" : ""}`} />
                <div className={`w-6 h-0.5 bg-foreground transition-all duration-300 origin-center ${isOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </button>
        </div>
      </nav>

      {/* MOBILE MENU OVERLAY */}
      <div className={`fixed inset-0 z-[90] bg-background transition-all duration-500 md:hidden flex flex-col items-center justify-center gap-12 p-10 ${
        isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
      }`}>
        <div className="flex flex-col items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-5xl font-black tracking-tighter transition-all active:scale-95 ${
                pathname === link.href ? "text-foreground" : "text-foreground/20"
              }`}
            >
              {link.name}
            </Link>
          ))}
          
          <div className="flex items-center gap-12 mt-8 pt-8 border-t border-border-custom w-full justify-center">
            <button 
                onClick={() => setLanguage(language === 'en' ? 'am' : 'en')}
                className="flex flex-col items-center gap-2"
            >
                <Languages size={24} className="text-foreground/40" />
                <span className="text-xs font-black uppercase tracking-widest">{language === 'en' ? 'አማርኛ' : 'English'}</span>
            </button>
            
            <Link
                href="/login"
                className="text-5xl font-black tracking-tighter text-foreground/20 active:scale-95"
            >
                {t("login")}
            </Link>
          </div>
        </div>

        {/* Branding in menu */}
        <div className="absolute bottom-12 text-center">
            <p className="text-xs font-black uppercase tracking-widest text-foreground/20 italic">{setting?.heroTitle?.toLowerCase() || "zeki"} photography</p>
        </div>
      </div>
    </>
  );
}
