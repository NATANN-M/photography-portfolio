"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { LayoutDashboard, FolderKanban, Images, Settings, LogOut, Menu, X } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  function logout() {
    localStorage.removeItem("token");
    router.push("/login");
  }

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Albums", href: "/admin/albums", icon: FolderKanban },
    { name: "Media Manager", href: "/admin/photos/upload", icon: Images },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-[#050505] text-white font-sans">
      {/* MOBILE HEADER */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-20 bg-black/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 z-50">
        <h2 className="text-xl font-black tracking-tighter italic">ZEKI<span className="text-accent-cta">.</span> ADMIN</h2>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 bg-white/5 rounded-xl border border-white/10"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-[#0a0a0a] border-r border-white/5 flex flex-col transition-all duration-500 transform
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        <div className="p-10 hidden lg:block">
          <h2 className="text-2xl font-black tracking-tighter italic group cursor-default">
            ZEKI<span className="text-accent-cta group-hover:opacity-60 transition-opacity">.</span> <span className="text-xs font-bold uppercase tracking-widest opacity-20 block ml-1 -mt-1">Control Center</span>
          </h2>
        </div>

        <nav className="flex-1 px-6 space-y-3 mt-28 lg:mt-6">
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
                    ? "bg-white text-black font-bold shadow-[0_10px_30px_rgba(255,255,255,0.1)]"
                    : "text-white/40 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon size={20} className={`${isActive ? "text-black" : "group-hover:scale-110 transition-transform"}`} />
                <span className="text-sm tracking-tight">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-white/5 bg-white/[0.01]">
          <button
            onClick={logout}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-red-400/60 hover:text-red-400 hover:bg-red-400/5 transition-all duration-300 group"
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-bold tracking-tight">System Logout</span>
          </button>
        </div>
      </aside>


      {/* OVERLAY FOR MOBILE SIDEBAR */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* CONTENT */}
      <main className="flex-1 lg:ml-64 overflow-y-auto pt-16 lg:pt-0">
        <div className="max-w-6xl mx-auto p-6 md:p-8 lg:p-12">{children}</div>
      </main>
    </div>
  );
}