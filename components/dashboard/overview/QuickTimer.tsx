"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react"; 
import { Play, Pause, X, RefreshCw, Clock, Trash2 } from "lucide-react";
import { GradientButton } from "@/components/ui/gradient-button";

interface QuickTimerProps {
    isOpen: boolean;
    onClose: () => void;
}

const RECENT_TIMERS_KEY = "runx_recent_timers";
const MAX_RECENT = 5;

// Helper to format seconds to display
const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

// Generate array for picker
const hours = Array.from({ length: 24 }, (_, i) => i);
const minutes = Array.from({ length: 60 }, (_, i) => i);
const seconds = Array.from({ length: 60 }, (_, i) => i);

export function QuickTimer({ isOpen, onClose }: QuickTimerProps) {
    // Picker state
    const [selectedHours, setSelectedHours] = useState(0);
    const [selectedMinutes, setSelectedMinutes] = useState(0);
    const [selectedSeconds, setSelectedSeconds] = useState(0);
    
    // Timer state
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [isPickerMode, setIsPickerMode] = useState(true); // Toggle between picker and countdown

    // Recent timers
    const [recentTimers, setRecentTimers] = useState<number[]>([]);

    // Load recent timers from localStorage
    useEffect(() => {
        const stored = localStorage.getItem(RECENT_TIMERS_KEY);
        if (stored) {
            try {
                setRecentTimers(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse recent timers", e);
            }
        }
    }, []);

    // Save recent timer
    const saveRecentTimer = (duration: number) => {
        if (duration <= 0) return;
        setRecentTimers(prev => {
            const filtered = prev.filter(t => t !== duration); // Remove duplicates
            const updated = [duration, ...filtered].slice(0, MAX_RECENT);
            localStorage.setItem(RECENT_TIMERS_KEY, JSON.stringify(updated));
            return updated;
        });
    };

    // Countdown logic
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isRunning && timeRemaining > 0) {
            interval = setInterval(() => {
                setTimeRemaining(prev => {
                    if (prev <= 1) {
                        setIsRunning(false);
                        // Could add audio notification here
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRunning, timeRemaining]);

    // Start countdown
    const handleStart = () => {
        const totalSeconds = selectedHours * 3600 + selectedMinutes * 60 + selectedSeconds;
        if (totalSeconds > 0) {
            saveRecentTimer(totalSeconds);
            setTimeRemaining(totalSeconds);
            setIsPickerMode(false);
            setIsRunning(true);
        }
    };

    // Use a recent timer
    const handleUseRecent = (duration: number) => {
        const h = Math.floor(duration / 3600);
        const m = Math.floor((duration % 3600) / 60);
        const s = duration % 60;
        setSelectedHours(h);
        setSelectedMinutes(m);
        setSelectedSeconds(s);
        setTimeRemaining(duration);
        setIsPickerMode(false);
        setIsRunning(true);
    };

    // Reset
    const handleReset = () => {
        setIsRunning(false);
        setTimeRemaining(0);
        setIsPickerMode(true);
    };

    // Clear recent timers
    const handleClearRecent = () => {
        setRecentTimers([]);
        localStorage.removeItem(RECENT_TIMERS_KEY);
    };

    // Reset on close
    useEffect(() => {
        if (!isOpen) {
            setIsRunning(false);
            setTimeRemaining(0);
            setIsPickerMode(true);
        }
    }, [isOpen]);

    // Picker Wheel Component
    const PickerWheel = ({ 
        values, 
        selected, 
        onSelect, 
        label 
    }: { 
        values: number[], 
        selected: number, 
        onSelect: (v: number) => void,
        label: string 
    }) => {
        const containerRef = useRef<HTMLDivElement>(null);

        // Scroll to selected on mount
        useEffect(() => {
            if (containerRef.current) {
                const itemHeight = 48; // h-12
                containerRef.current.scrollTop = selected * itemHeight;
            }
        }, [selected]);

        return (
            <div className="flex flex-col items-center">
                <div 
                    ref={containerRef}
                    className="h-36 w-20 overflow-y-scroll scrollbar-hide snap-y snap-mandatory relative"
                    style={{ scrollSnapType: 'y mandatory' }}
                    onScroll={(e) => {
                        const target = e.target as HTMLDivElement;
                        const index = Math.round(target.scrollTop / 48);
                        if (values[index] !== undefined && values[index] !== selected) {
                            onSelect(values[index]);
                        }
                    }}
                >
                    {/* Padding for centering */}
                    <div className="h-12" />
                    {values.map((v) => (
                        <div 
                            key={v}
                            className={`h-12 flex items-center justify-center text-3xl font-mono font-bold snap-center transition-colors ${v === selected ? 'text-white' : 'text-zinc-600'}`}
                        >
                            {v.toString().padStart(2, '0')}
                        </div>
                    ))}
                    <div className="h-12" />
                </div>
                <span className="text-xs text-zinc-500 uppercase mt-1">{label}</span>
            </div>
        );
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                         {/* Prevent Click from closing */}
                         <div onClick={e => e.stopPropagation()} className="w-full max-w-md">
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                                className="bg-zinc-900 border border-white/10 rounded-3xl p-6 relative shadow-2xl overflow-hidden"
                            >
                                {/* Decorative Glow */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                                {/* Header */}
                                <div className="flex justify-between items-center mb-6 relative z-10">
                                    <h2 className="text-xl font-bold text-white font-exo2">Timer</h2>
                                    <button 
                                        onClick={onClose}
                                        className="p-2 hover:bg-white/10 rounded-full transition-colors text-zinc-400 hover:text-white"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="relative z-10">
                                    {isPickerMode ? (
                                        <>
                                            {/* Time Picker Wheels */}
                                            <div className="flex justify-center items-center gap-2 py-4 mb-4 bg-zinc-800/50 rounded-2xl">
                                                <PickerWheel 
                                                    values={hours} 
                                                    selected={selectedHours} 
                                                    onSelect={setSelectedHours} 
                                                    label="Hours" 
                                                />
                                                <span className="text-4xl font-bold text-white">:</span>
                                                <PickerWheel 
                                                    values={minutes} 
                                                    selected={selectedMinutes} 
                                                    onSelect={setSelectedMinutes} 
                                                    label="Min" 
                                                />
                                                <span className="text-4xl font-bold text-white">:</span>
                                                <PickerWheel 
                                                    values={seconds} 
                                                    selected={selectedSeconds} 
                                                    onSelect={setSelectedSeconds} 
                                                    label="Sec" 
                                                />
                                            </div>

                                            {/* Recent Timers */}
                                            {recentTimers.length > 0 && (
                                                <div className="mb-6">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-xs text-zinc-500 uppercase tracking-widest">Recent</span>
                                                        <button 
                                                            onClick={handleClearRecent}
                                                            className="text-xs text-zinc-500 hover:text-red-400 flex items-center gap-1"
                                                        >
                                                            <Trash2 className="w-3 h-3" /> Clear
                                                        </button>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {recentTimers.map((t, i) => (
                                                            <button
                                                                key={i}
                                                                onClick={() => handleUseRecent(t)}
                                                                className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-mono text-sm transition-colors flex items-center gap-1.5"
                                                            >
                                                                <Clock className="w-3.5 h-3.5 text-orange-400" />
                                                                {formatTime(t)}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Start Button */}
                                            <GradientButton 
                                                variant="orange"
                                                className="w-full justify-center py-4"
                                                onClick={handleStart}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Play className="w-6 h-6 fill-current" />
                                                    <span className="font-bold text-lg">Start</span>
                                                </div>
                                            </GradientButton>
                                        </>
                                    ) : (
                                        <>
                                            {/* Countdown Display */}
                                            <div className="flex justify-center items-center py-10 mb-6">
                                                <div className="text-7xl font-mono font-bold text-white tracking-widest tabular-nums">
                                                    {formatTime(timeRemaining)}
                                                </div>
                                            </div>

                                            {/* Controls */}
                                            <div className="flex items-center gap-4">
                                                <button
                                                    onClick={handleReset}
                                                    className="p-4 rounded-2xl bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white transition-colors"
                                                >
                                                    <RefreshCw className="w-6 h-6" />
                                                </button>
                                                
                                                <GradientButton 
                                                    variant={isRunning ? "purple" : "orange"}
                                                    className="flex-1 justify-center py-4"
                                                    onClick={() => setIsRunning(!isRunning)}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        {isRunning ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
                                                        <span className="font-bold text-lg">{isRunning ? "Pause" : "Resume"}</span>
                                                    </div>
                                                </GradientButton>
                                            </div>
                                        </>
                                    )}
                                </div>

                            </motion.div>
                         </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
