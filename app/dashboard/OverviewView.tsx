"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
    TrendingUp,
    MapPin,
    Target,
    Zap,
    Route,
    Timer,
    Activity,
    ArrowRight,
    RefreshCcw,
} from "lucide-react";
import { toast } from "sonner";
import { Magnetic } from "@/components/ui/magnetic";
import { GradientButton } from "@/components/ui/gradient-button";
import { StatCard } from "@/components/dashboard/overview/StatCard";
import { OverviewGrid } from "@/components/dashboard/overview/OverviewGrid";

import { ActivityFeed, ActivityItem } from "@/components/dashboard/overview/ActivityFeed";
import { ActivityChart } from "@/components/dashboard/overview/ActivityChart";
import { Calendar, CloudLightning } from "lucide-react";
import { User } from "@supabase/supabase-js";

type OverviewData = {
    totals: {
        distanceKm: number;
        timeHours: number;
        runsCount: number;
        calories: number;
    };
    weekly: {
        currentKm: number;
        targetKm: number;
    };
    recentRuns: Array<{
        id: string;
        name: string | null;
        start_date: string | null;
        distance_m: number;
        moving_time_s: number;
        calories: number;
        sport_type: string | null;
    }>;
};

type Profile = {
    username?: string | null;
    full_name?: string | null;
    weekly_goal_km?: number | null;
} | null;

interface DashboardClientProps {
    user: User;
    profile: Profile;
    overview: OverviewData;
}

export default function OverviewView({ user, profile, overview }: DashboardClientProps) {
    const displayName = profile?.username || profile?.full_name || user?.user_metadata?.username || user?.email?.split('@')[0] || "Runner";

    // State
    // State
    const [isSyncing, setIsSyncing] = useState(false);

    const router = useRouter();

    const totals = overview?.totals ?? { distanceKm: 0, timeHours: 0, runsCount: 0, calories: 0 };
    const weeklyGoal = {
        current: overview?.weekly?.currentKm ?? 0,
        target: overview?.weekly?.targetKm ?? 40,
    };

    const stats = [
        { id: "dist", label: "Total Distance", value: totals.distanceKm.toFixed(1), unit: "km", icon: MapPin, color: "text-cyan-400" },
        { id: "time", label: "Total Time", value: totals.timeHours.toFixed(1), unit: "hrs", icon: Timer, color: "text-purple-400" },
        { id: "runs", label: "Total Runs", value: totals.runsCount, unit: "", icon: Activity, color: "text-orange-400" },
        { id: "cal", label: "Calories", value: Math.round(totals.calories), unit: "kcal", icon: Zap, color: "text-rose-400" },
    ];

    // Data Processing
    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        if (h > 0) return `${h}h ${m}m`;
        return `${m}m`;
    };

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return "";
        const d = new Date(dateStr);
        return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    };

    const activities: ActivityItem[] = (overview.recentRuns || []).map((run) => ({
        id: run.id,
        title: run.name || "Untitled Run",
        desc: `${(run.distance_m / 1000).toFixed(2)} km • ${formatTime(run.moving_time_s)} • ⚡ ${run.calories}`,
        date: formatDate(run.start_date),
        icon: run.sport_type === "Ride" ? Route : Activity, // Simple logic, can extend
        color: "text-cyan-400",
        type: "run",
    }));

    const chartData = (overview.recentRuns || []).map(run => ({
        date: formatDate(run.start_date),
        distance: run.distance_m ? parseFloat((run.distance_m / 1000).toFixed(2)) : 0,
        time: formatTime(run.moving_time_s),
        pace: "0:00/km" // Placeholder calculation
    })).reverse(); // Show oldest to newest in chart if needed, ActivityChart handles slicing/reversing too but usually charts are chronological


    // Handlers
    // Handlers
    const handlePlanRoute = () => {
        router.push("/dashboard/routes");
    };

    const handleStravaSync = async () => {
        setIsSyncing(true);
        toast.info("Syncing with Strava...");
        try {
            const res = await fetch("/api/strava/sync", { method: "POST" });
            const json = await res.json().catch(() => null);

            if (!res.ok || !json?.ok) {
                toast.error(json?.error || "Strava sync failed");
                return;
            }

            if (json.totalUpserted === 0) {
                toast.info("No new activities found");
            } else {
                toast.success(`Synced ${json.totalUpserted} new activities`);
                router.refresh();
            }
        } catch (e) {
            toast.error("Sync failed");
        } finally {
            setIsSyncing(false);
        }
    };

    const handleDownloadReport = () => {
        toast.promise(new Promise(resolve => setTimeout(resolve, 2000)), {
            loading: 'Generating PDF Report...',
            success: 'Report downloaded successfully!',
            error: 'Failed to generate report',
        });
    };

    return (
        <div className="space-y-8 pb-20">


            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2 font-exo2 tracking-wide">
                        Overview (Beta)
                    </h1>
                    <p className="text-zinc-400">
                        Welcome back, <span className="text-cyan-400 font-semibold">{displayName}</span>.
                        Ready to break some records?
                    </p>
                </div>
                <div className="flex gap-3">
                    <Magnetic>
                        <button
                            onClick={handleDownloadReport}
                            className="px-4 py-2 bg-zinc-800/50 hover:bg-zinc-800 text-zinc-300 rounded-xl text-sm font-medium transition-colors border border-white/5 backdrop-blur-sm"
                        >
                            Export Data
                        </button>
                    </Magnetic>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Magnetic intensity={0.2}>
                    <GradientButton variant="purple" className="w-full justify-between group" onClick={handlePlanRoute}>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-black/20 rounded-lg"><Route className="w-5 h-5" /></div>
                            <span className="font-bold">Plan New Route</span>
                        </div>
                        <ArrowRight className="w-4 h-4 opacity-50 group-hover:translate-x-1 transition-transform" />
                    </GradientButton>
                </Magnetic>

                <Magnetic intensity={0.2}>
                    <GradientButton 
                        variant="orange" 
                        className="w-full justify-between group" 
                        onClick={handleStravaSync}
                        disabled={isSyncing}
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-black/20 rounded-lg">
                                <RefreshCcw className={`w-5 h-5 ${isSyncing ? 'animate-spin' : ''}`} />
                            </div>
                            <span className="font-bold">
                                {isSyncing ? "Syncing..." : "Sync from Strava"}
                            </span>
                        </div>
                        {!isSyncing && <ArrowRight className="w-4 h-4 opacity-50 group-hover:translate-x-1 transition-transform" />}
                    </GradientButton>
                </Magnetic>
            </div>

            {/* Stats Grid */}
            <OverviewGrid>
                {stats.map((stat, i) => (
                    <StatCard
                        key={stat.id}
                        label={stat.label}
                        value={`${stat.value}${stat.unit ? ' ' + stat.unit : ''}`}
                        icon={stat.icon}
                        color={stat.color}
                        delay={i * 0.1}
                    />
                ))}
            </OverviewGrid>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Col: Charts & Goals */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Weekly Goal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-8 rounded-3xl bg-gradient-to-br from-zinc-900/90 to-zinc-900/50 border border-white/10 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-white font-exo2">Weekly Goal</h3>
                                    <p className="text-zinc-400">Keep up the pace to hit your target!</p>
                                </div>
                                <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
                                    <Target className="w-6 h-6 text-cyan-400" />
                                </div>
                            </div>

                            <div className="flex items-end gap-2 mb-4">
                                <span className="text-5xl font-bold text-white font-mono tracking-tighter">{weeklyGoal.current.toFixed(1)}</span>
                                <span className="text-xl text-zinc-500 mb-1 font-medium">/ {weeklyGoal.target} km</span>
                            </div>

                            <div className="h-4 bg-zinc-800 rounded-full overflow-hidden mb-2">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-600"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(100, (weeklyGoal.current / weeklyGoal.target) * 100)}%` }}
                                    transition={{ duration: 1, ease: "circOut" }}
                                />
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-cyan-400 font-medium">{Math.min(100, Math.round((weeklyGoal.current / weeklyGoal.target) * 100))}% Completed</span>
                                <span className="text-zinc-500">{(weeklyGoal.target - weeklyGoal.current).toFixed(1)} km remaining</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Activity Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="h-[400px]"
                    >
                        <ActivityChart data={chartData} />
                    </motion.div>
                </div>

                {/* Right Col: Recent Activity */}
                <div className="lg:col-span-1 h-full min-h-[500px]">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="h-full"
                    >
                        <ActivityFeed items={activities} className="h-full" />
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
