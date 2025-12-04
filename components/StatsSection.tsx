"use client";

import { motion, useInView, useSpring, useMotionValue, useTransform, animate } from "motion/react";
import { Users, Trophy, MapPin, Target } from "lucide-react";
import { useEffect, useRef } from "react";

const stats = [
    {
        icon: <Users className="w-8 h-8" />,
        value: 50000,
        suffix: "+",
        label: "Active Runners",
    },
    {
        icon: <MapPin className="w-8 h-8" />,
        value: 2000000,
        suffix: "+",
        label: "Miles Tracked",
    },
    {
        icon: <Trophy className="w-8 h-8" />,
        value: 1200,
        suffix: "+",
        label: "Events Hosted",
    },
    {
        icon: <Target className="w-8 h-8" />,
        value: 98,
        suffix: "%",
        label: "Goal Achievement",
    },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-100px" });
    const motionValue = useMotionValue(0);
    const rounded = useTransform(motionValue, (latest) => {
        if (value > 1000000) return `${(latest / 1000000).toFixed(1)}M`;
        if (value > 1000) return `${Math.floor(latest / 1000)}K`;
        return Math.floor(latest);
    });

    useEffect(() => {
        if (inView) {
            animate(motionValue, value, { duration: 2, ease: "easeOut" });
        }
    }, [inView, value, motionValue]);

    return <motion.span ref={ref}>{rounded as any}</motion.span>;
}

export default function StatsSection() {
    return (
        <section id="leaderboard" className="py-24 bg-gradient-to-b from-black to-zinc-950 relative overflow-hidden">
            {/* Background gradient effects */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent" />

            <div className="container mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-orbitron">
                        JOIN THE <span className="text-cyan-400">MOVEMENT</span>
                    </h2>
                    <p className="text-zinc-400 max-w-2xl mx-auto">
                        Thousands of runners worldwide are already pushing their limits with RUNX
                    </p>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                            whileHover={{ y: -10, scale: 1.05 }}
                            className="relative group"
                        >
                            <div className="text-center p-8 rounded-2xl bg-zinc-900/50 border border-white/5 group-hover:border-cyan-500/50 transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(6,182,212,0.2)] backdrop-blur-sm">
                                {/* Icon */}
                                <motion.div
                                    className="mb-4 inline-flex p-4 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 text-cyan-400 group-hover:from-cyan-500/30 group-hover:to-blue-600/30 transition-all"
                                    whileHover={{ rotate: 360 }}
                                    transition={{ duration: 0.6 }}
                                >
                                    {stat.icon}
                                </motion.div>

                                {/* Value */}
                                <div className="text-4xl md:text-5xl font-black text-white mb-2 font-orbitron flex justify-center items-center gap-1">
                                    <Counter value={stat.value} suffix={stat.suffix} />
                                    <span>{stat.suffix}</span>
                                </div>

                                {/* Label */}
                                <div className="text-sm text-zinc-400 uppercase tracking-wider group-hover:text-cyan-400 transition-colors">
                                    {stat.label}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
