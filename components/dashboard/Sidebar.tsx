"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Trophy, Settings, LogOut, Activity, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/");
        router.refresh();
    };

    const navItems = [
        { name: "Overview", url: "/dashboard", icon: Home },
        { name: "Activity", url: "/dashboard/activity", icon: Activity },
        { name: "Leaderboard", url: "/dashboard/leaderboard", icon: Trophy },
        { name: "Learn", url: "/dashboard/learn", icon: Zap },
        { name: "Settings", url: "/dashboard/settings", icon: Settings },
    ];

    return (
        <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="fixed left-0 top-0 h-screen w-20 md:w-64 bg-black/50 backdrop-blur-xl border-r border-white/10 flex flex-col z-40"
        >
            {/* Logo */}
            <Link href="/" className="p-6 flex items-center gap-3 group cursor-pointer">
                <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-[0_0_15px_rgba(6,182,212,0.5)] group-hover:shadow-[0_0_25px_rgba(6,182,212,0.8)] transition-all">
                    <Zap className="w-5 h-5 text-white fill-current group-hover:scale-110 transition-transform" />
                </div>
                <span className="text-xl font-bold tracking-tighter text-white font-orbitron hidden md:block group-hover:text-cyan-400 transition-colors">
                    RUN<span className="text-cyan-400 group-hover:text-white transition-colors">X</span>
                </span>
            </Link>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-8 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.url;
                    return (
                        <Link key={item.name} href={item.url}>
                            <div
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group",
                                    isActive
                                        ? "bg-cyan-500/10 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                                        : "text-zinc-500 hover:text-white hover:bg-white/5"
                                )}
                            >
                                <item.icon
                                    className={cn(
                                        "w-5 h-5 transition-transform group-hover:scale-110",
                                        isActive ? "fill-current" : ""
                                    )}
                                />
                                <span className="font-medium hidden md:block">{item.name}</span>
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute left-0 w-1 h-8 bg-cyan-500 rounded-r-full md:hidden"
                                    />
                                )}
                            </div>
                        </Link>
                    );
                })}
            </nav>

            {/* User / Logout */}
            <div className="p-4 border-t border-white/10">
                <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 group"
                >
                    <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    <span className="font-medium hidden md:block">Sign Out</span>
                </button>
            </div>
        </motion.div>
    );
}
