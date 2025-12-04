"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { Zap, Battery, Gauge, Flame, Wind, Activity, ArrowRight } from "lucide-react";
import { useRef } from "react";

const features = [
    {
        icon: <Wind className="w-6 h-6" />,
        title: "Aerodynamics",
        desc: "Master your form to cut through the air with minimal resistance.",
        color: "text-cyan-400",
        border: "group-hover:border-cyan-500/50",
        bg: "group-hover:bg-cyan-500/10",
        glow: "from-cyan-500",
        animation: { x: [0, 5, -5, 0], transition: { duration: 0.5 } } // Breezy slide
    },
    {
        icon: <Battery className="w-6 h-6" />,
        title: "Endurance Mode",
        desc: "Optimize energy output for long-distance runs.",
        color: "text-yellow-500",
        border: "group-hover:border-yellow-500/50",
        bg: "group-hover:bg-yellow-500/10",
        glow: "from-yellow-500",
        animation: { scale: [1, 1.2, 1], transition: { duration: 0.6, repeat: Infinity } } // Charging pulse
    },
    {
        icon: <Gauge className="w-6 h-6" />,
        title: "Sprint Boost",
        desc: "Maximum power delivery for short bursts.",
        color: "text-red-500",
        border: "group-hover:border-red-500/50",
        bg: "group-hover:bg-red-500/10",
        glow: "from-red-500",
        animation: { rotate: [0, -10, 10, -10, 10, 0], transition: { duration: 0.4 } } // Revving shake
    },
    {
        icon: <Activity className="w-6 h-6" />,
        title: "Bio-Metrics",
        desc: "Track and analyze your vital stats in real-time.",
        color: "text-green-400",
        border: "group-hover:border-green-500/50",
        bg: "group-hover:bg-green-500/10",
        glow: "from-green-500",
        animation: { scale: [1, 1.25, 1, 1.25, 1], transition: { duration: 1 } } // Heartbeat
    },
    {
        icon: <Flame className="w-6 h-6" />,
        title: "Burn Rate",
        desc: "Real-time calorie and metabolic tracking.",
        color: "text-orange-500",
        border: "group-hover:border-orange-500/50",
        bg: "group-hover:bg-orange-500/10",
        glow: "from-orange-500",
        animation: { y: [0, -5, 0, -3, 0], opacity: [1, 0.7, 1], transition: { duration: 0.8, repeat: Infinity } } // Fire flicker
    },
    {
        icon: <Zap className="w-6 h-6" />,
        title: "Energy Return",
        desc: "Optimize your stride to maximize energy efficiency.",
        color: "text-purple-500",
        border: "group-hover:border-purple-500/50",
        bg: "group-hover:bg-purple-500/10",
        glow: "from-purple-500",
        animation: { y: [0, -8, 0], transition: { duration: 0.6, repeat: Infinity, repeatType: "reverse" } } // Energetic bounce
    }
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 10
        }
    }
};

export default function PowerSection() {
    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

    return (
        <section id="power-section" ref={sectionRef} className="py-32 bg-zinc-950 relative overflow-hidden border-t border-white/10">
            {/* Dynamic Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black" />

            {/* Animated Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

            <div className="container mx-auto px-6 relative z-10">
                <motion.div
                    style={{ y, opacity }}
                    className="text-center mb-20"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        whileHover={{ rotate: [0, -10, 10, -10, 10, 0], transition: { duration: 0.5 } }}
                        className="inline-flex p-6 rounded-full bg-zinc-900/80 mb-8 ring-1 ring-white/10 shadow-[0_0_50px_rgba(255,255,255,0.1)] backdrop-blur-xl relative group cursor-pointer"
                    >
                        <motion.div
                            animate={{ opacity: [0.2, 0.5, 0.2] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 via-yellow-500 to-purple-500 blur-xl group-hover:opacity-60"
                        />
                        <Zap className="w-12 h-12 text-white fill-white relative z-10" />
                    </motion.div>

                    <h2 className="text-5xl md:text-7xl font-black text-white mb-6 font-orbitron tracking-wider">
                        UNLEASH YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-600">POTENTIAL</span>
                    </h2>

                    <p className="text-zinc-400 max-w-2xl mx-auto text-xl">
                        Combine advanced biomechanics with real-time energy management to break every limit.
                    </p>
                </motion.div>

                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    {features.map((item, i) => (
                        <motion.div
                            key={i}
                            variants={itemVariants}
                            whileHover={{ y: -10, scale: 1.02 }}
                            className={`p-8 rounded-3xl bg-zinc-900/40 border border-white/5 ${item.border} transition-all duration-500 group cursor-pointer relative overflow-hidden backdrop-blur-sm`}
                        >
                            {/* Hover Gradient Background */}
                            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/5 to-transparent`} />

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-6">
                                    <motion.div
                                        className={`p-3 rounded-xl bg-zinc-800/50 ${item.bg} ${item.color} transition-colors`}
                                        whileHover={item.animation}
                                    >
                                        {item.icon}
                                    </motion.div>
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        whileHover={{ opacity: 1, x: 0 }}
                                        className="text-white/50"
                                    >
                                        <ArrowRight className="w-5 h-5" />
                                    </motion.div>
                                </div>

                                <h3 className="text-2xl font-bold text-white mb-3 font-orbitron">{item.title}</h3>
                                <p className="text-zinc-400 leading-relaxed">{item.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
