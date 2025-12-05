"use client";

import { motion } from "motion/react";
import { Activity, Clock, Flame, TrendingUp, Calendar, ArrowUpRight } from "lucide-react";

const activities = [
    { name: "Morning Run", date: "Today, 6:30 AM", distance: "5.2 km", duration: "28:45", calories: 320, pace: "5:32 /km" },
    { name: "Evening Jog", date: "Yesterday, 7:00 PM", distance: "3.8 km", duration: "22:10", calories: 240, pace: "5:50 /km" },
    { name: "Long Run", date: "Dec 3, 2025", distance: "10.5 km", duration: "58:30", calories: 680, pace: "5:34 /km" },
    { name: "Interval Training", date: "Dec 2, 2025", distance: "6.0 km", duration: "35:00", calories: 420, pace: "5:50 /km" },
    { name: "Recovery Run", date: "Dec 1, 2025", distance: "4.2 km", duration: "26:00", calories: 280, pace: "6:11 /km" },
];

const weeklyStats = [
    { label: "This Week", distance: "29.7 km", runs: 5 },
    { label: "Last Week", distance: "32.1 km", runs: 6 },
    { label: "This Month", distance: "120.4 km", runs: 22 },
];

const userStats = [
    { label: "Total Distance", value: "1,240 km", change: "+12%", icon: Activity, color: "text-cyan-400" },
    { label: "Calories Burned", value: "45,200", change: "+8%", icon: Flame, color: "text-orange-500" },
    { label: "Avg. Pace", value: "5:24 /km", change: "-0:12", icon: TrendingUp, color: "text-green-400" },
];

export default function ActivityPage() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2 font-exo2">Activity</h1>
                <p className="text-zinc-400">Track your running history and progress.</p>
            </div>

            {/* Your Stats */}
            <div>
                <h2 className="text-lg font-bold text-white mb-4 font-exo2">Your Stats</h2>
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

            {/* Weekly Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {weeklyStats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-6 rounded-2xl bg-zinc-900/50 border border-white/10 backdrop-blur-sm"
                    >
                        <div className="text-sm text-zinc-500 mb-2">{stat.label}</div>
                        <div className="text-3xl font-bold text-white font-mono mb-1">{stat.distance}</div>
                        <div className="text-sm text-cyan-400">{stat.runs} runs</div>
                    </motion.div>
                ))}
            </div>

            {/* Activity List */}
            <div className="rounded-2xl bg-zinc-900/50 border border-white/10 backdrop-blur-sm overflow-hidden">
                <div className="p-6 border-b border-white/10 flex items-center gap-3">
                    <div className="p-2 bg-cyan-500/10 rounded-lg">
                        <Activity className="w-5 h-5 text-cyan-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white font-exo2">Recent Runs</h3>
                </div>

                <div className="divide-y divide-white/5">
                    {activities.map((activity, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + index * 0.1 }}
                            className="p-6 hover:bg-white/5 transition-colors cursor-pointer group"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/20 flex items-center justify-center group-hover:border-cyan-500/40 transition-colors">
                                        <Activity className="w-6 h-6 text-cyan-400" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-white group-hover:text-cyan-400 transition-colors">{activity.name}</div>
                                        <div className="text-sm text-zinc-500 flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {activity.date}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-white font-mono">{activity.distance}</div>
                                    <div className="text-xs text-zinc-500">distance</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="flex items-center gap-2 p-3 rounded-lg bg-white/5">
                                    <Clock className="w-4 h-4 text-purple-400" />
                                    <div>
                                        <div className="text-xs text-zinc-500">Duration</div>
                                        <div className="text-sm font-mono text-white">{activity.duration}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 p-3 rounded-lg bg-white/5">
                                    <TrendingUp className="w-4 h-4 text-green-400" />
                                    <div>
                                        <div className="text-xs text-zinc-500">Pace</div>
                                        <div className="text-sm font-mono text-white">{activity.pace}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 p-3 rounded-lg bg-white/5">
                                    <Flame className="w-4 h-4 text-orange-400" />
                                    <div>
                                        <div className="text-xs text-zinc-500">Calories</div>
                                        <div className="text-sm font-mono text-white">{activity.calories}</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
