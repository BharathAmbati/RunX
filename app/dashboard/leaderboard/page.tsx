"use client";

import { motion } from "motion/react";
import { MovingTrack } from "@/components/ui/moving-track";
import { Trophy, Medal, TrendingUp, Zap, Target, Award } from "lucide-react";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis, RadialBar, RadialBarChart, Area, AreaChart, CartesianGrid } from "recharts";

const leaderboardData = [
    { rank: 1, name: "Sarah Connor", distance: 1240, pace: "4:30", points: 15420, avatar: "SC", trend: [12, 15, 14, 18, 20, 22, 25] },
    { rank: 2, name: "John Wick", distance: 1150, pace: "4:15", points: 14200, avatar: "JW", trend: [10, 12, 15, 14, 18, 20, 22] },
    { rank: 3, name: "Ethan Hunt", distance: 980, pace: "3:55", points: 12800, avatar: "EH", trend: [8, 10, 12, 14, 15, 18, 19] },
    { rank: 4, name: "Lara Croft", distance: 850, pace: "4:45", points: 10500, avatar: "LC", trend: [5, 8, 10, 12, 14, 15, 17] },
    { rank: 5, name: "James Bond", distance: 720, pace: "5:00", points: 9200, avatar: "JB", trend: [4, 6, 8, 10, 12, 13, 15] },
];

const barChartData = leaderboardData.map(r => ({ name: r.avatar, distance: r.distance }));
const radialData = [
    { name: "Top 1", value: 95, fill: "hsl(var(--chart-1))" },
    { name: "Top 2", value: 85, fill: "hsl(var(--chart-2))" },
    { name: "Top 3", value: 75, fill: "hsl(var(--chart-3))" },
];

const areaChartData = [
    { week: "W1", sarah: 150, john: 120, ethan: 100 },
    { week: "W2", sarah: 180, john: 150, ethan: 130 },
    { week: "W3", sarah: 200, john: 180, ethan: 160 },
    { week: "W4", sarah: 250, john: 220, ethan: 180 },
    { week: "W5", sarah: 280, john: 250, ethan: 200 },
    { week: "W6", sarah: 320, john: 280, ethan: 240 },
    { week: "W7", sarah: 360, john: 320, ethan: 280 },
];

const chartConfig: ChartConfig = {
    distance: { label: "Distance (km)", color: "hsl(180 100% 50%)" },
    sarah: { label: "Sarah", color: "hsl(180 100% 50%)" },
    john: { label: "John", color: "hsl(280 100% 60%)" },
    ethan: { label: "Ethan", color: "hsl(45 100% 50%)" },
};

export default function LeaderboardPage() {
    return (
        <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
            {/* Hero Background */}
            <div className="absolute inset-0 -z-10">
                <MovingTrack className="z-0 opacity-40" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60 z-10" />
            </div>

            {/* Content */}
            <div className="relative z-20 space-y-8 pb-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center pt-8"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
                        <Zap className="w-4 h-4 text-cyan-400" />
                        <span className="text-sm font-medium text-cyan-400">Live Rankings</span>
                    </div>
                    <h1 className="font-exo2 text-4xl md:text-6xl font-bold text-white tracking-tighter mb-4">
                        GLOBAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">LEADERBOARD</span>
                    </h1>
                    <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                        Real-time performance tracking. Compete with elite runners worldwide.
                    </p>
                </motion.div>

                {/* Stats Overview */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    {[
                        { label: "Total Runners", value: "12,847", icon: Target, color: "from-cyan-500 to-blue-600" },
                        { label: "Avg. Points", value: "8,420", icon: Award, color: "from-purple-500 to-pink-600" },
                        { label: "Top Pace", value: "3:55 /km", icon: TrendingUp, color: "from-yellow-500 to-orange-600" },
                    ].map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 + i * 0.1 }}
                            className="relative overflow-hidden p-6 rounded-2xl bg-zinc-900/60 border border-white/10 backdrop-blur-xl"
                        >
                            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-10 blur-2xl`} />
                            <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} w-fit mb-4`}>
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-3xl font-bold text-white font-mono">{stat.value}</div>
                            <div className="text-sm text-zinc-500">{stat.label}</div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Distance Bar Chart */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="p-6 rounded-2xl bg-zinc-900/60 border border-white/10 backdrop-blur-xl"
                    >
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <Target className="w-5 h-5 text-cyan-400" />
                            Distance Comparison
                        </h3>
                        <ChartContainer config={chartConfig} className="h-[250px] w-full">
                            <BarChart data={barChartData} layout="vertical">
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={40} tick={{ fill: '#a1a1aa', fontSize: 12 }} />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Bar dataKey="distance" fill="url(#barGradient)" radius={[0, 8, 8, 0]} />
                                <defs>
                                    <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="hsl(180, 100%, 40%)" />
                                        <stop offset="100%" stopColor="hsl(200, 100%, 50%)" />
                                    </linearGradient>
                                </defs>
                            </BarChart>
                        </ChartContainer>
                    </motion.div>

                    {/* Performance Radial */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                        className="p-6 rounded-2xl bg-zinc-900/60 border border-white/10 backdrop-blur-xl"
                    >
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <Award className="w-5 h-5 text-purple-400" />
                            Performance Index
                        </h3>
                        <ChartContainer config={chartConfig} className="h-[250px] w-full">
                            <RadialBarChart innerRadius="30%" outerRadius="100%" data={radialData} startAngle={180} endAngle={0}>
                                <RadialBar background dataKey="value" cornerRadius={10} />
                                <ChartTooltip content={<ChartTooltipContent />} />
                            </RadialBarChart>
                        </ChartContainer>
                    </motion.div>

                    {/* Weekly Progress Area Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.6 }}
                        className="p-6 rounded-2xl bg-zinc-900/60 border border-white/10 backdrop-blur-xl lg:col-span-2"
                    >
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-green-400" />
                            Weekly Progress - Top 3 Runners
                        </h3>
                        <ChartContainer config={chartConfig} className="h-[250px] w-full">
                            <AreaChart data={areaChartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="week" tick={{ fill: '#a1a1aa', fontSize: 12 }} />
                                <YAxis tick={{ fill: '#a1a1aa', fontSize: 12 }} />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <defs>
                                    <linearGradient id="areaGradient1" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="hsl(180, 100%, 50%)" stopOpacity={0.5} />
                                        <stop offset="100%" stopColor="hsl(180, 100%, 50%)" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="areaGradient2" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="hsl(280, 100%, 60%)" stopOpacity={0.5} />
                                        <stop offset="100%" stopColor="hsl(280, 100%, 60%)" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="areaGradient3" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="hsl(45, 100%, 50%)" stopOpacity={0.5} />
                                        <stop offset="100%" stopColor="hsl(45, 100%, 50%)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <Area type="monotone" dataKey="sarah" stroke="hsl(180, 100%, 50%)" fill="url(#areaGradient1)" strokeWidth={2} />
                                <Area type="monotone" dataKey="john" stroke="hsl(280, 100%, 60%)" fill="url(#areaGradient2)" strokeWidth={2} />
                                <Area type="monotone" dataKey="ethan" stroke="hsl(45, 100%, 50%)" fill="url(#areaGradient3)" strokeWidth={2} />
                            </AreaChart>
                        </ChartContainer>
                    </motion.div>
                </div>

                {/* Leaderboard Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                    className="rounded-2xl bg-zinc-900/60 border border-white/10 backdrop-blur-xl overflow-hidden"
                >
                    <div className="p-6 border-b border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg">
                                <Trophy className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-white">Top Runners</h3>
                        </div>
                        <div className="text-xs text-zinc-500">Updated 2 min ago</div>
                    </div>

                    <div className="p-4">
                        <div className="grid grid-cols-12 text-xs font-medium text-zinc-500 uppercase tracking-wider mb-4 px-4">
                            <div className="col-span-1">Rank</div>
                            <div className="col-span-4">Runner</div>
                            <div className="col-span-2 text-center">Distance</div>
                            <div className="col-span-2 text-center">Pace</div>
                            <div className="col-span-3 text-right">Points</div>
                        </div>

                        <div className="space-y-2">
                            {leaderboardData.map((runner, index) => (
                                <motion.div
                                    key={runner.rank}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.8 + index * 0.1 }}
                                    whileHover={{ scale: 1.01, backgroundColor: "rgba(255,255,255,0.05)" }}
                                    className="grid grid-cols-12 items-center p-4 rounded-xl bg-white/[0.02] border border-transparent hover:border-cyan-500/20 transition-all cursor-pointer group"
                                >
                                    <div className="col-span-1">
                                        {runner.rank === 1 && <Medal className="w-6 h-6 text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" />}
                                        {runner.rank === 2 && <Medal className="w-6 h-6 text-zinc-400 drop-shadow-[0_0_8px_rgba(161,161,170,0.5)]" />}
                                        {runner.rank === 3 && <Medal className="w-6 h-6 text-amber-700 drop-shadow-[0_0_8px_rgba(180,83,9,0.5)]" />}
                                        {runner.rank > 3 && <span className="text-zinc-500 font-mono">#{runner.rank}</span>}
                                    </div>
                                    <div className="col-span-4 flex items-center gap-3">
                                        <div className="relative">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-sm font-bold text-white shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                                                {runner.avatar}
                                            </div>
                                            {runner.rank <= 3 && (
                                                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-zinc-900 animate-pulse" />
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-medium text-white group-hover:text-cyan-400 transition-colors">
                                                {runner.name}
                                            </div>
                                            <div className="text-xs text-zinc-500">Elite Runner</div>
                                        </div>
                                    </div>
                                    <div className="col-span-2 text-center">
                                        <span className="font-mono text-zinc-300">{runner.distance.toLocaleString()} km</span>
                                    </div>
                                    <div className="col-span-2 text-center">
                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-mono">
                                            <TrendingUp className="w-3 h-3" />
                                            {runner.pace} /km
                                        </span>
                                    </div>
                                    <div className="col-span-3 text-right">
                                        <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 font-mono">
                                            {runner.points.toLocaleString()}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
