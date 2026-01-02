"use client";

import dynamic from 'next/dynamic';
import { useMemo, useState, useEffect } from 'react';
import { ArrowLeft, Play, Timer, MapPin, Activity, Pause, Square } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { GradientButton } from '@/components/ui/gradient-button';
import { motion, AnimatePresence } from 'motion/react';
import RunTracker from '@/components/dashboard/run/RunTracker'; // We reuse the metric grid logic or visuals if possible, or build a simplified one.

// Simplified Tracker for the Left Panel (to match user request "same design as overview section quick start run")
// We can actually just import RunTracker but constrain its width or build a focused version.
// For now, let's build a focused "Active Run" panel.

const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) {
        return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

const ActiveRunPanel = ({
    distance,
    time,
    heartRate,
    calories,
    pace,
    isPaused,
    onPauseToggle,
    onEndRun
}: {
    distance: number,
    time: string,
    heartRate: number,
    calories: number,
    pace: string,
    isPaused: boolean,
    onPauseToggle: () => void,
    onEndRun: () => void
}) => (
    <div className="h-full flex flex-col justify-center space-y-8 p-8 relative">
        <div className="space-y-2">
            <h2 className="text-zinc-500 text-sm tracking-widest uppercase font-medium">Time Elapsed</h2>
            <div className="text-6xl font-bold text-white font-mono">{time}</div>
        </div>

        <div className="grid grid-cols-2 gap-8">
            <div className="space-y-1">
                <h2 className="text-zinc-500 text-xs tracking-widest uppercase font-medium">Distance Left</h2>
                <div className="text-3xl font-bold text-cyan-400 font-mono">{distance.toFixed(2)} km</div>
            </div>
            <div className="space-y-1">
                <h2 className="text-zinc-500 text-xs tracking-widest uppercase font-medium">Pace</h2>
                <div className="text-3xl font-bold text-white font-mono">{pace} <span className="text-sm text-zinc-500">/km</span></div>
            </div>
            <div className="space-y-1">
                <h2 className="text-zinc-500 text-xs tracking-widest uppercase font-medium">Heart Rate</h2>
                <div className="text-3xl font-bold text-rose-400 font-mono">{heartRate} <span className="text-sm text-zinc-500">bpm</span></div>
            </div>
            <div className="space-y-1">
                <h2 className="text-zinc-500 text-xs tracking-widest uppercase font-medium">Calories</h2>
                <div className="text-3xl font-bold text-orange-400 font-mono">{calories}</div>
            </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 mt-8 pt-8 border-t border-white/5">
            <button
                onClick={onPauseToggle}
                className="flex-1 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors flex items-center justify-center gap-2 border border-white/5"
            >
                {isPaused ? <Play className="w-5 h-5 fill-current" /> : <Pause className="w-5 h-5 fill-current" />}
                {isPaused ? "Resume" : "Pause"}
            </button>
            <button
                onClick={onEndRun}
                className="flex-1 py-4 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 font-medium transition-colors flex items-center justify-center gap-2 border border-rose-500/20"
            >
                <Square className="w-5 h-5 fill-current" />
                End Run
            </button>
        </div>
    </div>
);

export default function RoutePlannerPage() {
    const router = useRouter();
    const [isRunning, setIsRunning] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [currentDist, setCurrentDist] = useState(0);
    const [timeElapsed, setTimeElapsed] = useState(0);

    // Dynamic Metrics State
    const [heartRate, setHeartRate] = useState(145);
    const [calories, setCalories] = useState(0);
    const [pace, setPace] = useState("5:30");

    // Timer and Simulation effect
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isRunning && !isPaused) {
            interval = setInterval(() => {
                setTimeElapsed(prev => {
                    const newTime = prev + 1;

                    // Simulate Calories (approx 12 kcal/min for running)
                    setCalories(Math.floor(newTime * 0.2));

                    return newTime;
                });

                // Simulate Heart Rate Fluctuation every second
                setHeartRate(prev => {
                    const change = Math.random() > 0.5 ? 1 : -1;
                    const next = prev + change;
                    // Keep between 140 and 160
                    return Math.min(Math.max(next, 140), 160);
                });

                // Simulate Pace Fluctuation
                setPace(prev => {
                    // occasional change
                    if (Math.random() > 0.7) {
                        const seconds = 330 + Math.floor(Math.random() * 20 - 10); // 5:30 +/- 10s
                        const m = Math.floor(seconds / 60);
                        const s = seconds % 60;
                        return `${m}:${s.toString().padStart(2, '0')}`;
                    }
                    return prev;
                });

            }, 1000);
        } else if (!isRunning) {
            setTimeElapsed(0);
            setCalories(0);
            setHeartRate(145);
            setPace("5:30");
            setIsPaused(false);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isRunning, isPaused]);

    const Map = useMemo(() => dynamic(
        () => import('@/components/dashboard/routes/RouteMap'),
        {
            loading: () => <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-500">Loading Map...</div>,
            ssr: false
        }
    ), []);

    const handleEndRun = () => {
        setIsRunning(false);
        setIsPaused(false);
        setTimeElapsed(0);
        setCalories(0);
    };

    return (
        <div className="relative w-full h-[calc(100vh-2rem)] rounded-3xl overflow-hidden border border-white/5 bg-zinc-900 flex">
            {/* Back Button Overlay */}
            <div className="absolute top-6 left-6 z-[1000]">
                <button
                    onClick={() => {
                        if (isRunning) {
                            handleEndRun();
                        } else {
                            router.back();
                        }
                    }}
                    className="p-3 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors backdrop-blur-md border border-white/10"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
            </div>

            {/* Left Panel - Active Run Stats (Visible only when running) */}
            <AnimatePresence>
                {isRunning && (
                    <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: "40%", opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        className="h-full bg-zinc-900 border-r border-white/5 relative z-10 hidden md:block" // Hidden on small screens or stack? User asked for "Map right side", implies split.
                    >
                        <ActiveRunPanel
                            distance={currentDist}
                            time={formatTime(timeElapsed)}
                            heartRate={heartRate}
                            calories={calories}
                            pace={pace}
                            isPaused={isPaused}
                            onPauseToggle={() => setIsPaused(prev => !prev)}
                            onEndRun={handleEndRun}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Right Panel (or Full) - Map */}
            <div className="flex-1 relative h-full">
                <Map isRunning={isRunning} onDistanceUpdate={setCurrentDist} />

                {/* Start Button Overlay (Only when NOT running) */}
                {!isRunning && (
                    <div className="absolute top-6 right-6 z-[1000]">
                        <GradientButton
                            variant="cyan"
                            onClick={() => setIsRunning(true)}
                            className="shadow-xl shadow-cyan-500/20"
                        >
                            <Play className="w-4 h-4 mr-2 fill-white" />
                            Start Run
                        </GradientButton>
                    </div>
                )}
            </div>
        </div>
    );
}
