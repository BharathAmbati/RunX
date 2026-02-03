"use client";

import { motion } from "motion/react";
import { Activity, Clock, Flame, TrendingUp, Calendar } from "lucide-react";

type ActivityRow = {
    id: string;
    name: string | null;
    start_date: string;
    distance_m: number;
    moving_time_s: number;
    calories: number | null;
};

type ActivitySummary = {
    totalDistanceKm: number;
    totalCalories: number;
    avgPaceSecPerKm: number;
    weekly: {
        thisWeek: { distanceKm: number; runs: number };
        lastWeek: { distanceKm: number; runs: number };
        thisMonth: { distanceKm: number; runs: number };
    };
};

function formatDuration(totalSeconds: number) {
    const s = Math.max(0, Math.floor(totalSeconds));
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
}

function formatPaceSecondsPerKm(paceSecPerKm: number) {
    if (!Number.isFinite(paceSecPerKm) || paceSecPerKm <= 0) return "--";
    const total = Math.floor(paceSecPerKm);
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
}

function formatWhen(iso: string) {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "Unknown date";

    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);

    if (d >= startOfToday) {
        return `Today, ${d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}`;
    }
    if (d >= startOfYesterday) {
        return `Yesterday, ${d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}`;
    }
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default function ActivityView({
    activities,
    summary,
}: {
    activities: ActivityRow[];
    summary: ActivitySummary;
}) {
    const userStats = [
        {
            label: "Total Distance",
            value: `${summary.totalDistanceKm.toFixed(1)} km`,
            icon: Activity,
            color: "text-cyan-400",
        },
        {
            label: "Calories Burned",
            value: `${Math.round(summary.totalCalories)}`,
            icon: Flame,
            color: "text-orange-500",
        },
        {
            label: "Avg. Pace",
            value: `${formatPaceSecondsPerKm(summary.avgPaceSecPerKm)} /km`,
            icon: TrendingUp,
            color: "text-green-400",
        },
    ];

    const weeklyStats = [
        { label: "This Week", distanceKm: summary.weekly.thisWeek.distanceKm, runs: summary.weekly.thisWeek.runs },
        { label: "Last Week", distanceKm: summary.weekly.lastWeek.distanceKm, runs: summary.weekly.lastWeek.runs },
        { label: "This Month", distanceKm: summary.weekly.thisMonth.distanceKm, runs: summary.weekly.thisMonth.runs },
    ];

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
                        <div className="text-3xl font-bold text-white font-mono mb-1">{stat.distanceKm.toFixed(1)} km</div>
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
                    {activities.map((activity, index) => {
                        const distanceKm = activity.distance_m / 1000;
                        const pace = distanceKm > 0 ? formatPaceSecondsPerKm(activity.moving_time_s / distanceKm) : "--";
                        return (
                            <motion.div
                                key={activity.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 + index * 0.05 }}
                                className="p-6 hover:bg-white/5 transition-colors cursor-pointer group"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/20 flex items-center justify-center group-hover:border-cyan-500/40 transition-colors">
                                            <Activity className="w-6 h-6 text-cyan-400" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-white group-hover:text-cyan-400 transition-colors">
                                                {activity.name || "Run"}
                                            </div>
                                            <div className="text-sm text-zinc-500 flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {formatWhen(activity.start_date)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-white font-mono">
                                            {distanceKm.toFixed(2)} km
                                        </div>
                                        <div className="text-xs text-zinc-500">distance</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="flex items-center gap-2 p-3 rounded-lg bg-white/5">
                                        <Clock className="w-4 h-4 text-purple-400" />
                                        <div>
                                            <div className="text-xs text-zinc-500">Duration</div>
                                            <div className="text-sm font-mono text-white">
                                                {formatDuration(activity.moving_time_s)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 p-3 rounded-lg bg-white/5">
                                        <TrendingUp className="w-4 h-4 text-green-400" />
                                        <div>
                                            <div className="text-xs text-zinc-500">Pace</div>
                                            <div className="text-sm font-mono text-white">{pace} /km</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 p-3 rounded-lg bg-white/5">
                                        <Flame className="w-4 h-4 text-orange-400" />
                                        <div>
                                            <div className="text-xs text-zinc-500">Calories</div>
                                            <div className="text-sm font-mono text-white">
                                                {Math.round(activity.calories ?? 0)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}

                    {activities.length === 0 && (
                        <div className="p-10 text-center text-zinc-500">
                            No activities yet. Connect Strava in Settings and tap “Sync now”.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

