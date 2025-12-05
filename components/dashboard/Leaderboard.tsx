"use client";

import { motion } from "motion/react";
import { Trophy, Medal, TrendingUp } from "lucide-react";

const leaderboardData = [
    { rank: 1, name: "Sarah Connor", distance: "1,240 km", pace: "4:30 /km", points: 15420, avatar: "SC" },
    { rank: 2, name: "John Wick", distance: "1,150 km", pace: "4:15 /km", points: 14200, avatar: "JW" },
    { rank: 3, name: "Ethan Hunt", distance: "980 km", pace: "3:55 /km", points: 12800, avatar: "EH" },
    { rank: 4, name: "Lara Croft", distance: "850 km", pace: "4:45 /km", points: 10500, avatar: "LC" },
    { rank: 5, name: "James Bond", distance: "720 km", pace: "5:00 /km", points: 9200, avatar: "JB" },
];

export function Leaderboard() {
    return (
        <div className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-500/10 rounded-lg">
                        <Trophy className="w-5 h-5 text-yellow-500" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Top Runners</h3>
                </div>
                <button className="text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors">
                    View All
                </button>
            </div>

            <div className="p-4">
                <div className="grid grid-cols-12 text-xs font-medium text-zinc-500 uppercase tracking-wider mb-4 px-4">
                    <div className="col-span-1">Rank</div>
                    <div className="col-span-5">Runner</div>
                    <div className="col-span-3 text-right">Distance</div>
                    <div className="col-span-3 text-right">Points</div>
                </div>

                <div className="space-y-2">
                    {leaderboardData.map((runner, index) => (
                        <motion.div
                            key={runner.rank}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="grid grid-cols-12 items-center p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-transparent hover:border-white/5 group"
                        >
                            <div className="col-span-1 font-bold text-white">
                                {runner.rank === 1 && <Medal className="w-5 h-5 text-yellow-500" />}
                                {runner.rank === 2 && <Medal className="w-5 h-5 text-zinc-400" />}
                                {runner.rank === 3 && <Medal className="w-5 h-5 text-amber-700" />}
                                {runner.rank > 3 && <span className="text-zinc-400">#{runner.rank}</span>}
                            </div>
                            <div className="col-span-5 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white">
                                    {runner.avatar}
                                </div>
                                <div>
                                    <div className="font-medium text-white group-hover:text-cyan-400 transition-colors">
                                        {runner.name}
                                    </div>
                                    <div className="text-xs text-zinc-500 flex items-center gap-1">
                                        <TrendingUp className="w-3 h-3" /> {runner.pace}
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-3 text-right text-zinc-300 font-mono">
                                {runner.distance}
                            </div>
                            <div className="col-span-3 text-right font-bold text-cyan-400 font-mono">
                                {runner.points.toLocaleString()}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
