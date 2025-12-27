"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
    Users, TrendingUp, MapPin, Target, Trophy, Calendar,
    Zap, Play, Route, Timer, Activity, ArrowRight, CheckCircle2
} from "lucide-react";
import { toast } from "sonner";
import { Magnetic } from "@/components/ui/magnetic";
import { GradientButton } from "@/components/ui/gradient-button";
import { StatCard } from "@/components/dashboard/overview/StatCard";
import { ActivityFeed, ActivityItem } from "@/components/dashboard/overview/ActivityFeed";
import { OverviewGrid } from "@/components/dashboard/overview/OverviewGrid";

import { QuickTimer } from "@/components/dashboard/overview/QuickTimer";
import { User } from "@supabase/supabase-js";

interface DashboardClientProps {
    user: User;
    profile: any;
}

export default function OverviewView({ user, profile }: DashboardClientProps) {
    const displayName = profile?.username || profile?.full_name || user?.user_metadata?.username || user?.email?.split('@')[0] || "Runner";

    // State
    const [showTimer, setShowTimer] = useState(false);
    
    // ... rest of state
    const [stats, setStats] = useState([
        { id: 'dist', label: "Total Distance", value: 2432, unit: "km", icon: MapPin, color: "text-cyan-400", trend: "+12.5%", trendUp: true },
        { id: 'time', label: "Total Time", value: 186, unit: "hrs", icon: Timer, color: "text-purple-400", trend: "+5.2%", trendUp: true },
        { id: 'runs', label: "Total Runs", value: 142, unit: "", icon: Activity, color: "text-orange-400", trend: "+2", trendUp: true },
        { id: 'cal', label: "Calories", value: 12500, unit: "kcal", icon: Zap, color: "text-rose-400", trend: "-2.1%", trendUp: false },
    ]);

    const [activities, setActivities] = useState<ActivityItem[]>([
        { id: '1', title: "Morning Jog", desc: "5.2km in 28m", date: "2h ago", icon: Activity, color: "text-cyan-400", type: "run" },
        { id: '2', title: "Weekly Goal Met", desc: "40km Streak", date: "Yesterday", icon: Target, color: "text-yellow-400", type: "achievement" },
        { id: '3', title: "Club Run", desc: "Joined 'City Runners'", date: "2d ago", icon: Users, color: "text-purple-400", type: "social" },
    ]);

    const [weeklyGoal, setWeeklyGoal] = useState({ current: 28.5, target: 40 });

    const router = useRouter();

    // Handlers
    const handleStartRun = () => {
        router.push("/dashboard/run");
    };

    const handlePlanRoute = () => {
        router.push("/dashboard/routes");
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
             {/* Timer Modal */}
             <QuickTimer isOpen={showTimer} onClose={() => setShowTimer(false)} />

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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Magnetic intensity={0.2}>
                    <GradientButton
                        variant="cyan"
                        className="w-full justify-between group"
                        onClick={handleStartRun}
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-black/20 rounded-lg">
                                <Play className="w-5 h-5" />
                            </div>
                            <span className="font-bold">Quick Start Run</span>
                        </div>
                        <ArrowRight className="w-4 h-4 opacity-50 group-hover:translate-x-1 transition-transform" />
                    </GradientButton>
                </Magnetic>

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
                        onClick={() => setShowTimer(true)}
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-black/20 rounded-lg"><Timer className="w-5 h-5" /></div>
                            <span className="font-bold">Set Timer</span>
                        </div>
                        <ArrowRight className="w-4 h-4 opacity-50 group-hover:translate-x-1 transition-transform" />
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
                        trend={stat.trend}
                        trendUp={stat.trendUp}
                        delay={i * 0.1}
                    />
                ))}
            </OverviewGrid>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 gap-8">
                {/* Left Col: Goal & Chart (Placeholder for chart) */}
                <div className="space-y-8">
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

                    {/* Placeholder for future detailed chart */}
                    <div className="p-8 rounded-3xl bg-zinc-900/40 border border-white/5 min-h-[300px] flex items-center justify-center text-zinc-500">
                        <div className="text-center">
                            <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>Detailed Activity Chart coming soon...</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
