"use client";

import { motion } from "motion/react";
import { Activity, Flame, Calendar, ArrowUpRight, Users, TrendingUp, MapPin } from "lucide-react";

export default function DashboardPage() {
    const userStats = [
        { label: "Total Distance", value: "1,240 km", change: "+12%", icon: Activity, color: "text-cyan-400" },
        { label: "Calories Burned", value: "45,200", change: "+8%", icon: Flame, color: "text-orange-500" },
        { label: "Active Days", value: "142", change: "+2", icon: Calendar, color: "text-purple-500" },
    ];

    const communitySummary = [
        { label: "Total Runners", value: "12,847", icon: Users, color: "text-cyan-400" },
        { label: "Combined Distance", value: "2.4M km", icon: MapPin, color: "text-green-400" },
        { label: "Avg. Pace", value: "5:12 /km", icon: TrendingUp, color: "text-yellow-400" },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-orbitron text-white mb-2">Overview</h1>
                    <p className="text-zinc-400">Welcome back, RunnerOne</p>
                </div>
                <button className="px-4 py-2 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-lg text-sm font-bold hover:bg-cyan-500/20 transition-colors">
                    Download Report
                </button>
            </div>

            {/* Your Stats */}
            <div>
                <h2 className="text-lg font-bold text-white font-orbitron mb-4">Your Stats</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {userStats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-6 rounded-2xl bg-zinc-900/50 border border-white/10 backdrop-blur-sm"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <div className="flex items-center gap-1 text-xs font-medium text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
                                    {stat.change}
                                    <ArrowUpRight className="w-3 h-3" />
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-white font-mono mb-1">{stat.value}</div>
                            <div className="text-sm text-zinc-500">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Community Summary */}
            <div>
                <h2 className="text-lg font-bold text-white font-orbitron mb-4">Community Summary</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {communitySummary.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + index * 0.1 }}
                            className="p-6 rounded-2xl bg-zinc-900/50 border border-white/10 backdrop-blur-sm"
                        >
                            <div className="flex items-start mb-4">
                                <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-white font-mono mb-1">{stat.value}</div>
                            <div className="text-sm text-zinc-500">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
