"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { LayoutDashboard, FolderKanban, Images, Settings, LogOut, Menu, X, Sun, Moon, Languages } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { t, language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  function logout() {
    localStorage.removeItem("token");
    router.push("/login");
  }

  const navItems = [
    { name: t("dashboard"), href: "/admin", icon: LayoutDashboard },
    { name: t("albums"), href: "/admin/albums", icon: FolderKanban },
    { name: t("mediaManager"), href: "/admin/photos/upload", icon: Images },
    { name: t("settings"), href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-background text-foreground font-sans overflow-hidden transition-colors duration-500">
      {/* MOBILE HEADER */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-20 bg-background/80 backdrop-blur-xl border-b border-border-custom flex items-center justify-between px-6 z-50">
        <h2 className="text-xl font-black tracking-tighter italic">ZEKI<span className="text-accent-cta">.</span> {t("admin").toUpperCase()}</h2>
        <div className="flex items-center gap-2">
            <button 
                onClick={toggleTheme}
                className="p-2 bg-foreground/5 rounded-xl border border-border-custom"
            >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 bg-foreground/5 rounded-xl border border-border-custom"
            >
                {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
        </div>
      </div>

      {/* SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-background border-r border-border-custom flex flex-col transition-all duration-500 transform
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        <div className="p-10 hidden lg:block">
          <h2 className="text-2xl font-black tracking-tighter italic group cursor-default">
            ZEKI<span className="text-accent-cta group-hover:opacity-60 transition-opacity">.</span> <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-20 block ml-1 -mt-1">{t("controlCenter")}</span>
          </h2>
        </div>

        <nav className="flex-1 px-6 space-y-3 mt-32 lg:mt-6">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${
                  isActive
                    ? "bg-foreground text-background font-black shadow-xl"
                    : "text-foreground/40 hover:text-foreground hover:bg-foreground/5"
                }`}
              >
                <Icon size={18} strokeWidth={isActive ? 3 : 2} className={`${isActive ? "text-background" : "group-hover:scale-110 transition-transform"}`} />
                <span className="text-[11px] font-black uppercase tracking-widest">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-border-custom bg-foreground/[0.01] space-y-4">
          <div className="flex items-center justify-between px-2">
            <button 
                onClick={() => setLanguage(language === 'en' ? 'am' : 'en')}
                className="flex items-center gap-2 text-foreground/40 hover:text-foreground transition-colors group"
            >
                <Languages size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">{language === 'en' ? 'AM' : 'AMH'}</span>
            </button>
            <button 
                onClick={toggleTheme}
                className="p-2 text-foreground/40 hover:text-foreground transition-colors"
            >
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
          
          <button
            onClick={logout}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-red-500/40 hover:text-red-500 hover:bg-red-500/5 transition-all duration-300 group"
          >
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[11px] font-black uppercase tracking-widest">{t("logout")}</span>
          </button>
        </div>
      </aside>


      {/* OVERLAY FOR MOBILE SIDEBAR */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-md z-30 lg:hidden animate-in fade-in duration-500"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* CONTENT */}
      <main className="flex-1 lg:ml-72 overflow-y-auto pt-24 lg:pt-0">
        <div className="max-w-6xl mx-auto p-4 md:p-8 lg:p-12 pb-40">{children}</div>
      </main>
    </div>
  );
}