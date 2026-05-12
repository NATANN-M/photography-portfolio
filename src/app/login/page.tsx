"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await api.post("/auth/login", {
                email,
                password,
            });

            localStorage.setItem("token", res.data.token);
            router.push("/admin");
        } catch (err: any) {
            setError(err.response?.data?.message || "Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 font-sans">
            {/* AMBIENT BACKGROUND ELEMENTS */}
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-white/5 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-white/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="w-full max-w-md animate-in fade-in zoom-in duration-1000">
                <div className="text-center mb-10">
                    <h2 className="text-sm font-bold tracking-[0.3em] text-white/40 uppercase mb-3">System Access</h2>
                    <h1 className="text-4xl font-bold tracking-tight text-white italic">ZEKI ADMIN</h1>
                </div>

                <div className="bg-[#111]/80 backdrop-blur-xl border border-white/10 p-10 rounded-3xl shadow-2xl">
                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-4 rounded-xl text-center">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-white/50 ml-1">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-white/30 transition-all duration-300 placeholder:text-white/20"
                                placeholder="admin@zekiphoto.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-white/50 ml-1">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-white/30 transition-all duration-300 placeholder:text-white/20"
                                placeholder="••••••••"
                            />
                        </div>

                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full bg-white text-black py-4 rounded-xl font-bold hover:bg-white/90 disabled:opacity-50 transition-all duration-300 mt-4 active:scale-[0.98]"
                        >
                            {loading ? "Authenticating..." : "Sign In"}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-white/30 text-xs">
                            Secure access for authorized administrators only.
                        </p>
                    </div>
                </div>
                
                <div className="mt-8 text-center animate-pulse">
                    <button onClick={() => router.push("/")} className="text-white/20 hover:text-white/40 text-xs transition-colors tracking-widest uppercase">
                        ← Return to Gallery
                    </button>
                </div>
            </div>
        </div>
    );
}