"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Zap, Home, Trophy, User } from "lucide-react";
import { useAuthModal } from "@/components/providers/auth-modal-provider";
import { useTheme } from "next-themes";
import { TubelightNavbar } from "@/components/ui/tubelight-navbar";

export default function Navbar() {
    const { openModal } = useAuthModal();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const navItems = [
        { name: 'Home', url: '/', icon: Home },
        { name: 'Learn', url: '/learn', icon: Zap },
        { name: 'About', url: '/#about', icon: User }
    ];

    return (
        <>
            {/* Logo - Fixed Top Left */}
            <Link href="/learn" className="fixed top-6 left-6 z-50 flex items-center gap-2 group">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center gap-2"
                >
                    <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 group-hover:from-yellow-500 group-hover:to-orange-500 transition-all duration-500 shadow-[0_0_20px_rgba(6,182,212,0.5)] group-hover:shadow-[0_0_30px_rgba(234,179,8,0.6)] cursor-pointer">
                        <Zap className="w-6 h-6 text-white fill-current group-hover:scale-110 transition-transform" />
                    </div>
                    <span className="text-2xl font-bold tracking-tighter text-white font-orbitron transition-colors hidden md:inline-block">
                        RUN<span className="text-cyan-400 group-hover:text-yellow-400 transition-colors">X</span>
                    </span>
                </motion.div>
            </Link>

            {/* Tubelight Navbar - Fixed Top Right */}
            <motion.div
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="fixed top-6 right-6 z-40"
            >
                <TubelightNavbar
                    items={navItems}
                    action={
                        <button
                            onClick={openModal}
                            className="px-4 py-1.5 text-xs font-bold text-black bg-cyan-400 rounded-full hover:bg-cyan-300 transition-all shadow-[0_0_15px_rgba(34,211,238,0.6)] hover:shadow-[0_0_25px_rgba(34,211,238,0.8)] whitespace-nowrap"
                        >
                            SIGN IN/UP
                        </button>
                    }
                />
            </motion.div>
        </>
    );
}
