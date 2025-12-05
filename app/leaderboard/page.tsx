"use client";

import { motion } from "motion/react";
import { Trophy, TrendingUp, Activity, Target } from "lucide-react";
import {
    Bar,
    BarChart,
    XAxis,
    YAxis,
    RadialBarChart,
    RadialBar,
    AreaChart,
    Area,
    CartesianGrid,
} from "recharts";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Navbar from "@/components/Navbar";

// Mock data for top runners
const topRunners = [
    { name: "Alex", distance: 245, fill: "var(--color-alex)" },
    { name: "Jordan", distance: 198, fill: "var(--color-jordan)" },
    { name: "Sam", distance: 176, fill: "var(--color-sam)" },
    { name: "Casey", distance: 154, fill: "var(--color-casey)" },
    { name: "Morgan", distance: 132, fill: "var(--color-morgan)" },
];

const runnerChartConfig = {
    distance: { label: "Distance (km)" },
    alex: { label: "Alex", color: "hsl(185 100% 50%)" },
    jordan: { label: "Jordan", color: "hsl(200 100% 50%)" },
    sam: { label: "Sam", color: "hsl(215 100% 55%)" },
    casey: { label: "Casey", color: "hsl(230 90% 60%)" },
    morgan: { label: "Morgan", color: "hsl(245 80% 65%)" },
} satisfies ChartConfig;

// Weekly activity data
const weeklyActivity = [
    { day: "Mon", runs: 12, distance: 45 },
    { day: "Tue", runs: 18, distance: 68 },
    { day: "Wed", runs: 15, distance: 52 },
    { day: "Thu", runs: 22, distance: 89 },
    { day: "Fri", runs: 19, distance: 71 },
    { day: "Sat", runs: 28, distance: 112 },
    { day: "Sun", runs: 25, distance: 95 },
];

const activityChartConfig = {
    runs: { label: "Runs", color: "hsl(185 100% 50%)" },
    distance: { label: "Distance (km)", color: "hsl(220 90% 60%)" },
} satisfies ChartConfig;

// Goal completion data
const goalData = [
    { name: "completed", value: 78, fill: "hsl(185 100% 50%)" },
];

const goalChartConfig = {
    completed: { label: "Goal Progress", color: "hsl(185 100% 50%)" },
} satisfies ChartConfig;

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring" as const,
            stiffness: 100,
            damping: 15,
        },
    },
};

export default function LeaderboardPage() {
    return (
        <main className="min-h-screen bg-black text-white selection:bg-cyan-500/30">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-32 pb-12 px-6">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="container mx-auto text-center"
                >
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">
                        <span className="text-cyan-400">LEADER</span>BOARD
                    </h1>
                    <p className="text-zinc-400 max-w-xl mx-auto">
                        Track top performers and community achievements
                    </p>
                </motion.div>
            </section>

            {/* Charts Grid */}
            <section className="pb-24 px-6">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="container mx-auto grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                >
                    {/* Top Runners Bar Chart */}
                    <motion.div variants={itemVariants} className="lg:col-span-2">
                        <Card className="bg-zinc-900/50 border-white/5 backdrop-blur-sm hover:border-cyan-500/30 transition-colors duration-500">
                            <CardHeader className="pb-2">
                                <div className="flex items-center gap-2">
                                    <Trophy className="w-5 h-5 text-cyan-400" />
                                    <CardTitle className="text-white text-lg">Top Runners</CardTitle>
                                </div>
                                <CardDescription className="text-zinc-500">
                                    Weekly distance leaders
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer config={runnerChartConfig} className="h-[280px] w-full">
                                    <BarChart
                                        data={topRunners}
                                        layout="vertical"
                                        margin={{ left: 10, right: 20 }}
                                    >
                                        <YAxis
                                            dataKey="name"
                                            type="category"
                                            tickLine={false}
                                            axisLine={false}
                                            tick={{ fill: "#a1a1aa", fontSize: 12 }}
                                            width={60}
                                        />
                                        <XAxis
                                            type="number"
                                            tickLine={false}
                                            axisLine={false}
                                            tick={{ fill: "#a1a1aa", fontSize: 12 }}
                                        />
                                        <ChartTooltip
                                            cursor={{ fill: "rgba(6, 182, 212, 0.1)" }}
                                            content={<ChartTooltipContent />}
                                        />
                                        <Bar
                                            dataKey="distance"
                                            radius={[0, 6, 6, 0]}
                                            fill="url(#barGradient)"
                                        />
                                        <defs>
                                            <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                                                <stop offset="0%" stopColor="hsl(185 100% 50%)" />
                                                <stop offset="100%" stopColor="hsl(220 90% 60%)" />
                                            </linearGradient>
                                        </defs>
                                    </BarChart>
                                </ChartContainer>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Goal Progress Radial */}
                    <motion.div variants={itemVariants}>
                        <Card className="bg-zinc-900/50 border-white/5 backdrop-blur-sm hover:border-cyan-500/30 transition-colors duration-500 h-full">
                            <CardHeader className="pb-2">
                                <div className="flex items-center gap-2">
                                    <Target className="w-5 h-5 text-cyan-400" />
                                    <CardTitle className="text-white text-lg">Goal Progress</CardTitle>
                                </div>
                                <CardDescription className="text-zinc-500">
                                    Community monthly goal
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex items-center justify-center">
                                <ChartContainer config={goalChartConfig} className="h-[220px] w-[220px]">
                                    <RadialBarChart
                                        data={goalData}
                                        startAngle={90}
                                        endAngle={90 - (goalData[0].value / 100) * 360}
                                        innerRadius={70}
                                        outerRadius={95}
                                    >
                                        <RadialBar
                                            dataKey="value"
                                            background={{ fill: "rgba(255,255,255,0.05)" }}
                                            cornerRadius={10}
                                        />
                                    </RadialBarChart>
                                </ChartContainer>
                                <div className="absolute text-center">
                                    <p className="text-4xl font-bold text-cyan-400">78%</p>
                                    <p className="text-xs text-zinc-500">Complete</p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Weekly Activity Area Chart */}
                    <motion.div variants={itemVariants} className="lg:col-span-2">
                        <Card className="bg-zinc-900/50 border-white/5 backdrop-blur-sm hover:border-cyan-500/30 transition-colors duration-500">
                            <CardHeader className="pb-2">
                                <div className="flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-cyan-400" />
                                    <CardTitle className="text-white text-lg">Weekly Activity</CardTitle>
                                </div>
                                <CardDescription className="text-zinc-500">
                                    Community running trends
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer config={activityChartConfig} className="h-[250px] w-full">
                                    <AreaChart
                                        data={weeklyActivity}
                                        margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
                                    >
                                        <defs>
                                            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="hsl(185 100% 50%)" stopOpacity={0.4} />
                                                <stop offset="100%" stopColor="hsl(185 100% 50%)" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke="rgba(255,255,255,0.05)"
                                            vertical={false}
                                        />
                                        <XAxis
                                            dataKey="day"
                                            tickLine={false}
                                            axisLine={false}
                                            tick={{ fill: "#a1a1aa", fontSize: 12 }}
                                        />
                                        <YAxis
                                            tickLine={false}
                                            axisLine={false}
                                            tick={{ fill: "#a1a1aa", fontSize: 12 }}
                                            width={40}
                                        />
                                        <ChartTooltip
                                            cursor={{ stroke: "rgba(6, 182, 212, 0.3)" }}
                                            content={<ChartTooltipContent />}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="distance"
                                            stroke="hsl(185 100% 50%)"
                                            strokeWidth={2}
                                            fill="url(#areaGradient)"
                                        />
                                    </AreaChart>
                                </ChartContainer>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Stats Summary */}
                    <motion.div variants={itemVariants}>
                        <Card className="bg-zinc-900/50 border-white/5 backdrop-blur-sm hover:border-cyan-500/30 transition-colors duration-500 h-full">
                            <CardHeader className="pb-2">
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-cyan-400" />
                                    <CardTitle className="text-white text-lg">This Week</CardTitle>
                                </div>
                                <CardDescription className="text-zinc-500">
                                    Quick stats overview
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center p-3 rounded-lg bg-black/30">
                                    <span className="text-zinc-400 text-sm">Total Runs</span>
                                    <span className="text-2xl font-bold text-white">139</span>
                                </div>
                                <div className="flex justify-between items-center p-3 rounded-lg bg-black/30">
                                    <span className="text-zinc-400 text-sm">Distance</span>
                                    <span className="text-2xl font-bold text-cyan-400">532km</span>
                                </div>
                                <div className="flex justify-between items-center p-3 rounded-lg bg-black/30">
                                    <span className="text-zinc-400 text-sm">Active Users</span>
                                    <span className="text-2xl font-bold text-white">847</span>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>
            </section>

            {/* Footer */}
            <footer className="py-8 text-center text-zinc-600 text-sm border-t border-white/5 bg-black">
                <p>© 2025 RUNX. All rights reserved.</p>
            </footer>
        </main>
    );
}
