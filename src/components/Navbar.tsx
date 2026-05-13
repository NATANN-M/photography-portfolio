"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [setting, setSetting] = useState<any>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    
    // Load settings for logo
    async function loadSettings() {
      try {
        const res = await api.get("/setting");
        setSetting(res.data);
      } catch (err) {
        console.error(err);
      }
    }
    loadSettings();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    { name: "home", href: "/" },
    { name: "archive", href: "/albums" },
    { name: "contact", href: "/contact" },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 md:px-12 py-6 transition-all duration-500 ${
        scrolled || isOpen ? "bg-background/80 backdrop-blur-xl py-4 border-b border-foreground/5" : "bg-transparent"
      }`}>
        <Link href="/" className="group relative z-[110] flex items-center gap-3">
          {setting?.useDefaultLogo === false && setting?.logoUrl ? (
             <img src={setting.logoUrl} alt="Logo" className="h-8 md:h-10 w-auto object-contain invert dark:invert-0" />
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
              className={`text-sm font-bold tracking-tight transition-all duration-300 ${
                pathname === link.href ? "text-foreground" : "text-foreground/40 hover:text-foreground"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/login"
            className="pill-button bg-foreground text-background hover:opacity-90 active:scale-95"
          >
            login
          </Link>
        </div>

        {/* MOBILE MENU TOGGLE */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-foreground flex flex-col gap-1.5 p-2 relative z-[110] cursor-pointer"
          aria-label="Toggle Menu"
        >
          <div className={`w-6 h-0.5 bg-foreground transition-all duration-300 origin-center ${isOpen ? "rotate-45 translate-y-2" : ""}`} />
          <div className={`w-6 h-0.5 bg-foreground transition-all duration-300 ${isOpen ? "opacity-0" : ""}`} />
          <div className={`w-6 h-0.5 bg-foreground transition-all duration-300 origin-center ${isOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </nav>

      {/* MOBILE MENU OVERLAY */}
      <div className={`fixed inset-0 z-[90] bg-background transition-all duration-500 md:hidden flex flex-col items-center justify-center gap-12 p-10 ${
        isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
      }`}>
        <div className="flex flex-col items-center gap-10">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-5xl font-bold tracking-tighter transition-all active:scale-95 ${
                pathname === link.href ? "text-foreground" : "text-foreground/20"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/login"
            className="text-5xl font-bold tracking-tighter text-foreground/20 active:scale-95"
          >
            login
          </Link>
        </div>

        {/* Branding in menu */}
        <div className="absolute bottom-12 text-center">
            <p className="text-xs font-bold tracking-tight text-foreground/20 italic">{setting?.heroTitle?.toLowerCase() || "zeki"} photography</p>
        </div>
      </div>
    </>
  );
}

