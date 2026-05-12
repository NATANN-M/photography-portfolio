"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
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
    { name: "Home", href: "/" },
    { name: "Archive", href: "/albums" },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 md:px-12 py-6 transition-all duration-500 ${
        scrolled || isOpen ? "bg-black/90 backdrop-blur-xl py-4 border-b border-white/5" : "bg-transparent"
      }`}>
        <Link href="/" className="text-2xl font-black tracking-tighter text-white italic group relative z-[110]">
          ZEKI<span className="text-white/40 group-hover:text-white transition-colors">.</span>
        </Link>
        
        {/* DESKTOP LINKS */}
        <div className="hidden md:flex items-center gap-10">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-[10px] font-bold tracking-[0.3em] uppercase transition-all duration-300 ${
                pathname === link.href ? "text-white" : "text-white/30 hover:text-white"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/login"
            className="px-6 py-2 text-[10px] font-bold tracking-[0.2em] uppercase border border-white/10 rounded-full hover:bg-white hover:text-black transition-all duration-500 backdrop-blur-md"
          >
            Login
          </Link>
        </div>

        {/* MOBILE MENU TOGGLE */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white flex flex-col gap-1.5 p-2 relative z-[110] cursor-pointer"
          aria-label="Toggle Menu"
        >
          <div className={`w-6 h-0.5 bg-white transition-all duration-300 origin-center ${isOpen ? "rotate-45 translate-y-2" : ""}`} />
          <div className={`w-6 h-0.5 bg-white transition-all duration-300 ${isOpen ? "opacity-0" : ""}`} />
          <div className={`w-6 h-0.5 bg-white transition-all duration-300 origin-center ${isOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </nav>

      {/* MOBILE MENU OVERLAY */}
      <div className={`fixed inset-0 z-[90] bg-black backdrop-blur-3xl transition-all duration-500 md:hidden flex flex-col items-center justify-center gap-12 p-10 ${
        isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
      }`}>
        <div className="flex flex-col items-center gap-10">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-4xl font-bold tracking-[0.2em] uppercase transition-all active:scale-95 ${
                pathname === link.href ? "text-white" : "text-white/20"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/login"
            className="text-4xl font-bold tracking-[0.2em] uppercase text-white/20 active:scale-95"
          >
            Login
          </Link>
        </div>

        {/* Branding in menu */}
        <div className="absolute bottom-12 text-center">
            <p className="text-[10px] font-bold tracking-[0.5em] text-white/20 uppercase italic">Zeki Photography</p>
        </div>
      </div>
    </>
  );
}
