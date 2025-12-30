"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Trophy, Settings, LogOut, Activity, Zap, ChevronUp, User2, Users, HeartPulse } from "lucide-react";
import { motion } from "motion/react";
import { createClient } from "@/lib/supabase/client";
import { signOut } from "@/app/actions";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Icon animation variants for each nav item
const iconAnimations = {
    Home: {
        initial: { scale: 1 },
        animate: { scale: [1, 1.1, 1] },
        transition: { duration: 2, repeat: Infinity, ease: "easeInOut" as const },
        whileHover: { scale: 1.2, rotate: -10 },
    },
    Activity: {
        initial: { scale: 1 },
        animate: { scale: [1, 1.15, 1, 1.15, 1] },
        transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" as const },
        whileHover: { scale: 1.3, y: -2 },
    },
    Leaderboard: {
        initial: { y: 0 },
        animate: { y: [0, -3, 0] },
        transition: { duration: 0.6, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" as const },
        whileHover: { scale: 1.2, rotate: 15 },
    },
    Learn: {
        initial: { opacity: 1, scale: 1 },
        animate: { opacity: [1, 0.7, 1], scale: [1, 1.1, 1] },
        transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" as const },
        whileHover: { scale: 1.3, rotate: [0, -10, 10, 0] },
    },
    Recover: {
        initial: { scale: 1 },
        animate: { scale: [1, 1.2, 1] },
        transition: { duration: 1, repeat: Infinity, repeatDelay: 1, ease: "easeInOut" as const },
        whileHover: { scale: 1.25, color: "#34d399" }, // Emerald color on hover
    },
    Settings: {
        initial: { rotate: 0 },
        animate: { rotate: 0 },
        transition: { duration: 0.5, ease: "easeInOut" as const },
        whileHover: { rotate: 180, scale: 1.1 },
    },
    Club: {
        initial: { scale: 1 },
        animate: { scale: [1, 1.2, 1] },
        transition: { duration: 0.8, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" as const },
        whileHover: { scale: 1.25, x: 3 },
    },
};

const navItems = [
    { 
        name: "Overview", 
        url: "/dashboard", 
        icon: Home, 
        animKey: "Home",
        activeColor: "text-cyan-400",
        activeBg: "bg-cyan-500/10",
        activeShadow: "shadow-[0_0_15px_rgba(6,182,212,0.1)]"
    },
    { 
        name: "Activity", 
        url: "/dashboard/activity", 
        icon: Activity, 
        animKey: "Activity",
        activeColor: "text-cyan-400",
        activeBg: "bg-cyan-500/10",
        activeShadow: "shadow-[0_0_15px_rgba(6,182,212,0.1)]"
    },
    { 
        name: "Club", 
        url: "/dashboard/club", 
        icon: Users, 
        animKey: "Club",
        activeColor: "text-cyan-400",
        activeBg: "bg-cyan-500/10",
        activeShadow: "shadow-[0_0_15px_rgba(6,182,212,0.1)]"
    },
    { 
        name: "Leaderboard", 
        url: "/dashboard/leaderboard", 
        icon: Trophy, 
        animKey: "Leaderboard",
        activeColor: "text-cyan-400",
        activeBg: "bg-cyan-500/10",
        activeShadow: "shadow-[0_0_15px_rgba(6,182,212,0.1)]"
    },
    { 
        name: "Learn", 
        url: "/dashboard/learn", 
        icon: Zap, 
        animKey: "Learn",
        activeColor: "text-orange-400",
        activeBg: "bg-orange-500/10",
        activeShadow: "shadow-[0_0_15px_rgba(249,115,22,0.1)]"
    },
    { 
        name: "Recover", 
        url: "/dashboard/recover", 
        icon: HeartPulse, 
        animKey: "Recover",
        activeColor: "text-emerald-400",
        activeBg: "bg-emerald-500/10",
        activeShadow: "shadow-[0_0_15px_rgba(52,211,153,0.1)]"
    },
    { 
        name: "Settings", 
        url: "/dashboard/settings", 
        icon: Settings, 
        animKey: "Settings",
        activeColor: "text-cyan-400",
        activeBg: "bg-cyan-500/10",
        activeShadow: "shadow-[0_0_15px_rgba(6,182,212,0.1)]"
    },
];

export function AppSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();

    const handleSignOut = async () => {
        await signOut();
    };

    const [userEmail, setUserEmail] = React.useState<string>("runner@runx.com");
    const [userName, setUserName] = React.useState<string>("RunnerOne");

    React.useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUserEmail(user.email || "runner@runx.com");
                setUserName(user.user_metadata?.full_name || user.user_metadata?.username || user.email?.split('@')[0] || "RunnerOne");
            }
        };
        getUser();
    }, []);

    return (
        <Sidebar collapsible="icon" className="border-r border-white/10 bg-black/50 backdrop-blur-xl">
            {/* Logo Header */}
            <SidebarHeader className="p-4">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild size="lg" className="hover:bg-white/5">
                            <Link href="/" className="flex items-center gap-2 group -ml-1">
                                <motion.div 
                                    className="relative flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-[0_0_15px_rgba(6,182,212,0.5)]"
                                    animate={{ 
                                        boxShadow: [
                                            "0 0 15px rgba(6,182,212,0.5)",
                                            "0 0 25px rgba(6,182,212,0.8)",
                                            "0 0 15px rgba(6,182,212,0.5)"
                                        ]
                                    }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                    whileHover={{ 
                                        scale: 1.1,
                                        boxShadow: "0 0 35px rgba(6,182,212,1)"
                                    }}
                                >
                                    <motion.div
                                        animate={{ rotate: [0, 5, -5, 0] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                    >
                                        <Zap className="w-5 h-5 text-white fill-current" />
                                    </motion.div>
                                </motion.div>
                                <span className="text-xl font-bold tracking-tighter text-white group-hover:text-cyan-400 transition-colors font-orbitron group-data-[collapsible=icon]:hidden">
                                    RUN<span className="text-cyan-400 group-hover:text-white transition-colors">X</span>
                                </span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            {/* Navigation */}
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="text-zinc-500 text-xs uppercase tracking-wider">
                        Navigation
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navItems.map((item) => {
                                const isActive = pathname === item.url;
                                const anim = iconAnimations[item.animKey as keyof typeof iconAnimations];
                                
                                return (
                                    <SidebarMenuItem key={item.name}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={isActive}
                                            tooltip={item.name}
                                            className={`transition-all duration-300 ${
                                                isActive
                                                    ? `${item.activeBg} ${item.activeColor} ${item.activeShadow}`
                                                    : "text-zinc-500 hover:text-white hover:bg-white/5"
                                            }`}
                                        >
                                            <Link href={item.url} className="flex items-center gap-2">
                                                <motion.div
                                                    initial={anim.initial}
                                                    animate={isActive ? anim.animate : {}}
                                                    whileHover={anim.whileHover}
                                                    transition={anim.transition || { duration: 0.3 }}
                                                >
                                                    <item.icon 
                                                        className={`w-4 h-4 ${
                                                            isActive ? "fill-current" : ""
                                                        } ${
                                                            item.name === "Learn" ? "text-orange-400" :
                                                            item.name === "Recover" ? "text-emerald-400" : ""
                                                        }`} 
                                                    />
                                                </motion.div>
                                                <span className="font-medium group-data-[collapsible=icon]:hidden">{item.name}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            {/* Footer with User Menu */}
            <SidebarFooter className="border-t border-white/10">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton
                                    size="lg"
                                    className="text-zinc-400 hover:text-white hover:bg-white/5"
                                >
                                    <motion.div 
                                        className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 shrink-0"
                                        whileHover={{ scale: 1.1, borderColor: "rgba(6,182,212,0.8)" }}
                                        animate={{ 
                                            borderColor: ["rgba(6,182,212,0.3)", "rgba(6,182,212,0.6)", "rgba(6,182,212,0.3)"]
                                        }}
                                        transition={{ duration: 3, repeat: Infinity }}
                                    >
                                        <motion.div
                                            animate={{ rotate: [0, 360] }}
                                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                        >
                                            <User2 className="w-4 h-4 text-cyan-400" />
                                        </motion.div>
                                    </motion.div>
                                    <div className="flex flex-col items-start min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
                                        <span className="text-sm font-medium text-white truncate w-full">{userName}</span>
                                        <span className="text-xs text-zinc-500 truncate w-full">{userEmail}</span>
                                    </div>
                                    <motion.div
                                        whileHover={{ y: -2 }}
                                        className="ml-auto shrink-0 group-data-[collapsible=icon]:hidden"
                                    >
                                        <ChevronUp />
                                    </motion.div>
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                side="top"
                                className="w-[--radix-popper-anchor-width] bg-zinc-900 border-white/10"
                            >
                                <Link href="/dashboard/profile">
                                    <DropdownMenuItem className="text-zinc-400 hover:text-white focus:text-white focus:bg-white/5 cursor-pointer">
                                        <motion.div whileHover={{ scale: 1.2 }}>
                                            <User2 className="mr-2 h-4 w-4" />
                                        </motion.div>
                                        Profile
                                    </DropdownMenuItem>
                                </Link>
                                <Link href="/dashboard/settings">
                                    <DropdownMenuItem className="text-zinc-400 hover:text-white focus:text-white focus:bg-white/5 cursor-pointer">
                                        <motion.div whileHover={{ rotate: 90 }}>
                                            <Settings className="mr-2 h-4 w-4" />
                                        </motion.div>
                                        Settings
                                    </DropdownMenuItem>
                                </Link>
                                <DropdownMenuItem 
                                    onClick={handleSignOut}
                                    className="text-red-400 hover:text-red-300 focus:text-red-300 focus:bg-red-500/10"
                                >
                                    <motion.div whileHover={{ x: 3 }}>
                                        <LogOut className="mr-2 h-4 w-4" />
                                    </motion.div>
                                    Sign Out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    );
}

