"use client";

import { motion, AnimatePresence } from "motion/react";
import { LucideIcon, Trophy, Zap, MapPin, Timer } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ActivityItem {
    id: string;
    title: string;
    desc: string;
    date: string;
    icon: LucideIcon;
    color: string;
    type: "achievement" | "run" | "social";
}

interface ActivityFeedProps {
    items: ActivityItem[];
    title?: string;
    className?: string;
}

export function ActivityFeed({ items, title = "Recent Activity", className }: ActivityFeedProps) {
    return (
        <div className={cn("rounded-2xl bg-zinc-900/40 border border-white/5 backdrop-blur-sm overflow-hidden flex flex-col h-full", className)}>
            <div className="p-6 border-b border-white/5 flex items-center justify-between sticky top-0 bg-zinc-900/40 z-20 backdrop-blur-md">
                <h3 className="text-lg font-bold text-white font-exo2">{title}</h3>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-white/10 text-zinc-400">
                    Live Updates
                </span>
            </div>
            
            <div className="p-4 space-y-2 overflow-y-auto custom-scrollbar flex-1 min-h-[300px] max-h-[400px]">
                <AnimatePresence initial={false} mode="popLayout">
                    {items.map((item) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -20, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            layout
                            className="group p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/5 transition-all cursor-default flex items-center gap-4"
                        >
                            <div className={cn("p-2 rounded-lg bg-white/5 transition-transform group-hover:scale-105", item.color)}>
                                <item.icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-semibold text-white truncate">{item.title}</h4>
                                <p className="text-xs text-zinc-400 truncate">{item.desc}</p>
                            </div>
                            <div className="text-xs text-zinc-500 font-mono whitespace-nowrap">
                                {item.date}
                            </div>
                        </motion.div>
                    ))}
                    {items.length === 0 && (
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center py-12 text-zinc-500"
                        >
                            <p>No recent activity</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
