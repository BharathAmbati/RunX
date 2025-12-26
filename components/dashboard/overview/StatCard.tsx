"use client";

import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
    label: string;
    value: string | number;
    icon: LucideIcon;
    color?: string; // Tailwind text color class, e.g., "text-cyan-400"
    trend?: string;
    trendUp?: boolean;
    className?: string;
    delay?: number;
}

export function StatCard({
    label,
    value,
    icon: Icon,
    color = "text-white",
    trend,
    trendUp,
    className,
    delay = 0,
}: StatCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5 }}
            className={cn(
                "relative group overflow-hidden rounded-2xl bg-zinc-900/40 border border-white/5 backdrop-blur-sm p-6 hover:bg-zinc-800/50 transition-colors",
                className
            )}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10 flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-zinc-400">{label}</p>
                    <h3 className="text-3xl font-bold text-white mt-2 font-mono tracking-tight">
                        {value}
                    </h3>
                </div>
                <div
                    className={cn(
                        "p-3 rounded-xl bg-white/5 group-hover:scale-110 transition-transform duration-300",
                        color.replace("text-", "bg-").replace("400", "500/10").replace("500", "500/10") // Auto-generate bg color from text color if possible, or fallback
                    )}
                >
                    <Icon className={cn("w-6 h-6", color)} />
                </div>
            </div>

            {trend && (
                <div className="relative z-10 mt-4 flex items-center gap-2 text-xs font-medium">
                    <span
                        className={cn(
                            trendUp ? "text-emerald-400" : "text-rose-400",
                            "flex items-center gap-1"
                        )}
                    >
                        {trendUp ? "↑" : "↓"} {trend}
                    </span>
                    <span className="text-zinc-500">vs last week</span>
                </div>
            )}
        </motion.div>
    );
}
