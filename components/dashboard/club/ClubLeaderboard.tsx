"use client";

import { motion } from "motion/react";
import { Trophy, Medal, TrendingUp, Target, Award, Search, X } from "lucide-react";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { useState, useMemo } from "react";

// Mock Data (In a real app, this would come from props or API)
const ALL_RUNNERS = [
    { id: 1, name: "Sarah Connor", distance: 1240, pace: "4:30", points: 15420, avatar: "SC", trend: [150, 180, 200, 250, 280, 320, 360], color: "hsl(180, 100%, 50%)" },
    { id: 2, name: "John Wick", distance: 1150, pace: "4:15", points: 14200, avatar: "JW", trend: [120, 150, 180, 220, 250, 280, 320], color: "hsl(280, 100%, 60%)" },
    { id: 3, name: "Ethan Hunt", distance: 980, pace: "3:55", points: 12800, avatar: "EH", trend: [100, 130, 160, 180, 200, 240, 280], color: "hsl(45, 100%, 50%)" },
    { id: 4, name: "Lara Croft", distance: 850, pace: "4:45", points: 10500, avatar: "LC", trend: [80, 110, 130, 150, 180, 200, 220], color: "hsl(320, 100%, 60%)" },
    { id: 5, name: "James Bond", distance: 720, pace: "5:00", points: 9200, avatar: "JB", trend: [60, 90, 110, 130, 150, 170, 190], color: "hsl(200, 100%, 50%)" },
     { id: 6, name: "Jason Bourne", distance: 680, pace: "4:10", points: 8500, avatar: "JB", trend: [50, 80, 100, 120, 140, 160, 180], color: "hsl(150, 100%, 50%)" },
];

const WEEKS = ["W1", "W2", "W3", "W4", "W5", "W6", "W7"];

export function ClubLeaderboard() {
    // Default to Top 3
    const [selectedRunnerIds, setSelectedRunnerIds] = useState<number[]>([1, 2, 3]);
    const [searchQuery, setSearchQuery] = useState("");

    const chartConfig: ChartConfig = {}; // Dynamic config based on selection

    // Prepare Chart Data
    const chartData = useMemo(() => {
        return WEEKS.map((week, index) => {
            const dataPoint: any = { week };
            selectedRunnerIds.forEach(id => {
                const runner = ALL_RUNNERS.find(r => r.id === id);
                if (runner) {
                    dataPoint[runner.name] = runner.trend[index];
                    chartConfig[runner.name] = { label: runner.name, color: runner.color };
                }
            });
            return dataPoint;
        });
    }, [selectedRunnerIds]);

    const filteredRunners = ALL_RUNNERS.filter(r => 
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !selectedRunnerIds.includes(r.id)
    );

    const toggleRunner = (id: number) => {
        if (selectedRunnerIds.includes(id)) {
            setSelectedRunnerIds(selectedRunnerIds.filter(pid => pid !== id));
        } else {
            setSelectedRunnerIds([...selectedRunnerIds, id]);
        }
    };

    return (
        <div className="space-y-8">
            {/* Graph Section */}
            <div className="p-6 rounded-3xl bg-zinc-900/50 border border-white/5">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <h3 className="text-xl font-bold text-white font-exo2 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-cyan-400" />
                        Performance Comparison
                    </h3>
                    
                    {/* Search / Filter */}
                    <div className="relative w-full md:w-64">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                            <input 
                                type="text" 
                                placeholder="Compare runner..."
                                className="w-full pl-10 pr-4 py-2 rounded-xl bg-black/20 border border-white/10 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        
                        {/* Search Dropdown */}
                        {searchQuery && (
                            <div className="absolute top-full left-0 right-0 mt-2 p-2 rounded-xl bg-zinc-900 border border-white/10 shadow-xl z-20">
                                {filteredRunners.length > 0 ? (
                                    filteredRunners.map(runner => (
                                        <button
                                            key={runner.id}
                                            onClick={() => {
                                                toggleRunner(runner.id);
                                                setSearchQuery("");
                                            }}
                                            className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors text-left"
                                        >
                                            <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center text-[10px] text-cyan-400 font-bold">
                                                {runner.avatar}
                                            </div>
                                            <span className="text-sm text-zinc-300">{runner.name}</span>
                                        </button>
                                    ))
                                ) : (
                                    <div className="p-2 text-xs text-zinc-500 text-center">No runners found</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Selected Runners Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {selectedRunnerIds.map(id => {
                        const runner = ALL_RUNNERS.find(r => r.id === id);
                        if (!runner) return null;
                        return (
                            <button
                                key={id}
                                onClick={() => toggleRunner(id)}
                                className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5 hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400 transition-colors group"
                            >
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: runner.color }} />
                                <span className="text-xs text-zinc-300 group-hover:text-red-400">{runner.name}</span>
                                <X className="w-3 h-3 group-hover:scale-110" />
                            </button>
                        );
                    })}
                </div>

                {/* Chart */}
                <div className="h-[300px] w-full">
                     <ChartContainer config={chartConfig} className="h-full w-full">
                        <AreaChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis dataKey="week" tick={{ fill: '#71717a', fontSize: 12 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#71717a', fontSize: 12 }} axisLine={false} tickLine={false} />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <defs>
                                {selectedRunnerIds.map(id => {
                                    const runner = ALL_RUNNERS.find(r => r.id === id);
                                     if (!runner) return null;
                                     return (
                                        <linearGradient key={id} id={`gradient-${id}`} x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor={runner.color} stopOpacity={0.2} />
                                            <stop offset="100%" stopColor={runner.color} stopOpacity={0} />
                                        </linearGradient>
                                     )
                                })}
                            </defs>
                             {selectedRunnerIds.map(id => {
                                const runner = ALL_RUNNERS.find(r => r.id === id);
                                if (!runner) return null;
                                return (
                                    <Area 
                                        key={id}
                                        type="monotone" 
                                        dataKey={runner.name} 
                                        stroke={runner.color} 
                                        fill={`url(#gradient-${id})`} 
                                        strokeWidth={2} 
                                    />
                                );
                            })}
                        </AreaChart>
                    </ChartContainer>
                </div>
            </div>

            {/* Leaderboard Table */}
            <div className="rounded-3xl bg-zinc-900/50 border border-white/5 overflow-hidden">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                         <div className="p-2 bg-yellow-500/10 rounded-lg">
                            <Trophy className="w-5 h-5 text-yellow-500" />
                        </div>
                        <h3 className="text-xl font-bold text-white font-exo2">Club Rankings</h3>
                    </div>
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
                        {ALL_RUNNERS.sort((a,b) => b.points - a.points).map((runner, index) => (
                             <motion.div
                                key={runner.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="grid grid-cols-12 items-center p-4 rounded-xl bg-white/[0.02] border border-transparent hover:border-cyan-500/20 transition-all cursor-pointer group"
                            >
                                 <div className="col-span-1">
                                    {(index + 1) === 1 && <Medal className="w-6 h-6 text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" />}
                                    {(index + 1) === 2 && <Medal className="w-6 h-6 text-zinc-400 drop-shadow-[0_0_8px_rgba(161,161,170,0.5)]" />}
                                    {(index + 1) === 3 && <Medal className="w-6 h-6 text-amber-700 drop-shadow-[0_0_8px_rgba(180,83,9,0.5)]" />}
                                    {(index + 1) > 3 && <span className="text-zinc-500 font-mono">#{index + 1}</span>}
                                </div>
                                <div className="col-span-4 flex items-center gap-3">
                                     <div className="relative">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-sm font-bold text-white">
                                            {runner.avatar}
                                        </div>
                                    </div>
                                    <div className="font-medium text-white group-hover:text-cyan-400 transition-colors">
                                        {runner.name}
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
            </div>
        </div>
    );
}
