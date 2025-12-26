"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Play, Pause, Square, MapPin, Timer, Zap, ArrowLeft, Heart, Footprints, Flame } from "lucide-react";
import { GradientButton } from "@/components/ui/gradient-button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function RunTracker() {
    const router = useRouter();
    const [isRunning, setIsRunning] = useState(false);
    const [time, setTime] = useState(0); // in seconds
    const [distance, setDistance] = useState(0); // in km
    const [heartRate, setHeartRate] = useState(0); // bpm
    const [cadence, setCadence] = useState(0); // spm
    const [calories, setCalories] = useState(0); // kcal

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isRunning) {
            interval = setInterval(() => {
                setTime(t => t + 1);
                // Simulate distance: roughly 5 mins per km (12km/h) => 1km every 300s => 0.0033 km/s
                setDistance(d => d + 0.003 + (Math.random() * 0.001));
                
                // Simulate metrics
                setHeartRate(Math.floor(130 + Math.random() * 30)); // 130-160 bpm
                setCadence(Math.floor(160 + Math.random() * 20)); // 160-180 spm
                setCalories(c => c + 0.2 + (Math.random() * 0.1)); // ~12-18 kcal/min
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRunning]);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleCreateRun = () => {
        // Here you would save the run to Supabase
        toast.success("Run saved successfully!");
        router.push("/dashboard");
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => router.back()}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-zinc-400 hover:text-white"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-3xl font-bold text-white font-exo2">Active Run</h1>
            </div>

            {/* Main Tracker */}
            <div className="relative p-12 rounded-[3rem] bg-zinc-900/50 border border-white/5 backdrop-blur-xl flex flex-col items-center justify-center min-h-[500px]">
                {/* Circular Progress (Visual only for now) */}
                <div className="absolute inset-0 rounded-[3rem] overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-cyan-500/5 rounded-full blur-3xl opacity-50" />
                </div>

                <div className="relative z-10 text-center space-y-2 mb-12">
                    <p className="text-zinc-400 font-medium tracking-widest uppercase text-sm">Duration</p>
                    <div className="text-7xl md:text-8xl font-bold text-white font-mono tracking-tighter">
                        {formatTime(time)}
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="relative z-10 grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-12 w-full px-4">
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2 text-zinc-400 mb-1">
                            <MapPin className="w-4 h-4" />
                            <span className="text-xs font-medium uppercase tracking-wider">Distance</span>
                        </div>
                        <div className="text-2xl font-bold text-white font-mono">
                            {distance.toFixed(2)} <span className="text-sm text-zinc-500">km</span>
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2 text-zinc-400 mb-1">
                            <Zap className="w-4 h-4" />
                            <span className="text-xs font-medium uppercase tracking-wider">Pace</span>
                        </div>
                        <div className="text-2xl font-bold text-white font-mono">
                            {distance > 0 ? Math.floor(time / 60 / distance) : 0}'{(distance > 0 ? Math.floor((time / distance) % 60) : 0).toString().padStart(2, '0')}" <span className="text-sm text-zinc-500">/km</span>
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2 text-zinc-400 mb-1">
                            <Flame className="w-4 h-4" />
                            <span className="text-xs font-medium uppercase tracking-wider">Calories</span>
                        </div>
                        <div className="text-2xl font-bold text-white font-mono">
                            {calories.toFixed(0)} <span className="text-sm text-zinc-500">kcal</span>
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2 text-zinc-400 mb-1">
                            <Heart className="w-4 h-4" />
                            <span className="text-xs font-medium uppercase tracking-wider">Heart Rate</span>
                        </div>
                        <div className="text-2xl font-bold text-white font-mono">
                            {isRunning ? heartRate : '--'} <span className="text-sm text-zinc-500">bpm</span>
                        </div>
                    </div>
                    <div className="text-center md:col-start-2">
                        <div className="flex items-center justify-center gap-2 text-zinc-400 mb-1">
                            <Footprints className="w-4 h-4" />
                            <span className="text-xs font-medium uppercase tracking-wider">Cadence</span>
                        </div>
                        <div className="text-2xl font-bold text-white font-mono">
                            {isRunning ? cadence : '--'} <span className="text-sm text-zinc-500">spm</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-6">
                {!isRunning && time === 0 ? (
                    <GradientButton 
                        variant="cyan" 
                        className="w-full max-w-xs text-xl py-6 rounded-2xl"
                        onClick={() => setIsRunning(true)}
                    >
                        <Play className="w-6 h-6 mr-2 fill-current" />
                        Start Activity
                    </GradientButton>
                ) : (
                    <>
                         <button
                            onClick={() => setIsRunning(!isRunning)}
                            className="p-6 rounded-2xl bg-zinc-800 border border-white/5 text-white hover:bg-zinc-700 transition-colors"
                        >
                            {isRunning ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current" />}
                        </button>
                        
                        {!isRunning && (
                             <button
                                onClick={handleCreateRun}
                                className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500/20 transition-colors"
                            >
                                <Square className="w-8 h-8 fill-current" />
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
