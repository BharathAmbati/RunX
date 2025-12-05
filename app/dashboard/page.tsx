"use client";

import { motion } from "motion/react";
import { Users, TrendingUp, MapPin, Target, Trophy, Calendar, Zap, Play, Route, Timer } from "lucide-react";
import { Magnetic } from "@/components/ui/magnetic";
import { GradientButton } from "@/components/ui/gradient-button";

export default function DashboardPage() {
    const communitySummary = [
        { label: "Total Runners", value: "12,847", icon: Users, color: "text-cyan-400" },
        { label: "Combined Distance", value: "2.4M km", icon: MapPin, color: "text-green-400" },
        { label: "Avg. Pace", value: "5:12 /km", icon: TrendingUp, color: "text-yellow-400" },
    ];

    const quickActions = [
        { label: "Start Run", icon: Play, variant: "cyan" as const },
        { label: "Plan Route", icon: Route, variant: "purple" as const },
        { label: "Set Timer", icon: Timer, variant: "orange" as const },
    ];

    const achievements = [
        { title: "Speed Demon", desc: "Ran 5K under 22 min", date: "2 days ago", icon: Zap, color: "text-yellow-400" },
        { title: "Marathon Ready", desc: "Completed 42K week", date: "1 week ago", icon: Trophy, color: "text-amber-500" },
        { title: "Early Bird", desc: "10 morning runs streak", date: "3 days ago", icon: Target, color: "text-cyan-400" },
    ];

    const upcomingEvents = [
        { name: "City Marathon 2025", date: "Dec 15", participants: "5.2K", type: "Marathon" },
        { name: "Night Run Challenge", date: "Dec 20", participants: "1.8K", type: "10K" },
        { name: "New Year Sprint", date: "Jan 1", participants: "3.4K", type: "5K" },
    ];

    const weeklyGoal = { current: 28, target: 40, unit: "km" };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 font-exo2">Overview</h1>
                    <p className="text-zinc-400">Welcome back, RunnerOne</p>
                </div>
                <button className="px-4 py-2 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-lg text-sm font-bold hover:bg-cyan-500/20 transition-colors">
                    Download Report
                </button>
            </div>

            {/* Weekly Goal Progress */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 backdrop-blur-sm"
            >
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-cyan-500/20">
                            <Target className="w-6 h-6 text-cyan-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white font-exo2">Weekly Goal</h2>
                            <p className="text-sm text-zinc-400">Keep pushing, you&apos;re almost there!</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-bold text-white font-mono">
                            {weeklyGoal.current}<span className="text-zinc-500">/{weeklyGoal.target}</span>
                        </div>
                        <div className="text-sm text-cyan-400">{weeklyGoal.unit} this week</div>
                    </div>
                </div>
                <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(weeklyGoal.current / weeklyGoal.target) * 100}%` }}
                        transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                    />
                </div>
                <div className="mt-2 text-sm text-zinc-500">
                    {weeklyGoal.target - weeklyGoal.current} km remaining • {Math.round((weeklyGoal.current / weeklyGoal.target) * 100)}% complete
                </div>
            </motion.div>

            {/* Quick Actions with Gradient Button Effect */}
            <div>
                <h2 className="text-lg font-bold text-white mb-4 font-exo2">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {quickActions.map((action, index) => (
                        <Magnetic key={action.label} intensity={0.4} range={120}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.1 + index * 0.1 }}
                            >
                                <GradientButton
                                    variant={action.variant}
                                    className="w-full min-w-0 rounded-2xl flex items-center gap-4"
                                >
                                    <div className="p-2 rounded-xl bg-white/10">
                                        <action.icon className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="text-base font-medium">{action.label}</span>
                                </GradientButton>
                            </motion.div>
                        </Magnetic>
                    ))}
                </div>
            </div>

            {/* Community Summary */}
            <div>
                <h2 className="text-lg font-bold text-white mb-4 font-exo2">Community Summary</h2>
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

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Achievements */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="rounded-2xl bg-zinc-900/50 border border-white/10 backdrop-blur-sm overflow-hidden"
                >
                    <div className="p-6 border-b border-white/10 flex items-center gap-3">
                        <div className="p-2 bg-amber-500/10 rounded-lg">
                            <Trophy className="w-5 h-5 text-amber-500" />
                        </div>
                        <h3 className="text-lg font-bold text-white font-exo2">Recent Achievements</h3>
                    </div>
                    <div className="divide-y divide-white/5">
                        {achievements.map((achievement, index) => (
                            <motion.div
                                key={achievement.title}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + index * 0.1 }}
                                className="p-4 flex items-center gap-4 hover:bg-white/5 transition-colors"
                            >
                                <div className={`p-2 rounded-lg bg-white/5 ${achievement.color}`}>
                                    <achievement.icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <div className="font-medium text-white">{achievement.title}</div>
                                    <div className="text-sm text-zinc-500">{achievement.desc}</div>
                                </div>
                                <div className="text-xs text-zinc-500">{achievement.date}</div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Upcoming Events */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="rounded-2xl bg-zinc-900/50 border border-white/10 backdrop-blur-sm overflow-hidden"
                >
                    <div className="p-6 border-b border-white/10 flex items-center gap-3">
                        <div className="p-2 bg-purple-500/10 rounded-lg">
                            <Calendar className="w-5 h-5 text-purple-500" />
                        </div>
                        <h3 className="text-lg font-bold text-white font-exo2">Upcoming Events</h3>
                    </div>
                    <div className="divide-y divide-white/5">
                        {upcomingEvents.map((event, index) => (
                            <motion.div
                                key={event.name}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + index * 0.1 }}
                                className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="text-center">
                                        <div className="text-lg font-bold text-cyan-400 font-mono">{event.date.split(" ")[0]}</div>
                                        <div className="text-xs text-zinc-500">{event.date.split(" ")[1]}</div>
                                    </div>
                                    <div>
                                        <div className="font-medium text-white group-hover:text-cyan-400 transition-colors">{event.name}</div>
                                        <div className="text-sm text-zinc-500">{event.participants} participants</div>
                                    </div>
                                </div>
                                <div className="px-3 py-1 rounded-full bg-white/5 text-xs font-medium text-zinc-400">
                                    {event.type}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
