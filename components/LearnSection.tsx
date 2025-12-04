"use client";

import { motion } from "motion/react";
import { Activity, Wind, Zap, ArrowRight } from "lucide-react";

const features = [
    {
        icon: <Wind className="w-8 h-8 text-cyan-400" />,
        title: "Aerodynamics",
        description: "Master your form to cut through the air with minimal resistance.",
    },
    {
        icon: <Zap className="w-8 h-8 text-cyan-400" />,
        title: "Energy Return",
        description: "Optimize your stride to maximize energy efficiency and speed.",
    },
    {
        icon: <Activity className="w-8 h-8 text-cyan-400" />,
        title: "Bio-Metrics",
        description: "Track and analyze your vital stats in real-time for peak performance.",
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
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

export default function LearnSection() {
    return (
        <section className="py-24 bg-black relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-64 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/4 -right-64 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <motion.h2
                        className="text-4xl md:text-5xl font-bold text-white mb-4 font-orbitron"
                        whileInView={{ scale: [0.9, 1] }}
                        transition={{ duration: 0.5 }}
                    >
                        MASTER THE <span className="text-cyan-400 inline-block">TECHNIQUE</span>
                    </motion.h2>
                    <p className="text-zinc-400 max-w-2xl mx-auto">
                        Advanced training modules designed to elevate your running to the next level.
                    </p>
                </motion.div>

                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            whileHover={{ y: -10 }}
                            className="p-8 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-cyan-500/50 transition-colors group relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className="relative z-10">
                                <motion.div
                                    className="mb-6 p-4 rounded-full bg-zinc-800/50 w-fit group-hover:bg-cyan-500/10 transition-colors"
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                >
                                    {feature.icon}
                                </motion.div>
                                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">{feature.title}</h3>
                                <p className="text-zinc-400 mb-6">{feature.description}</p>

                                <div className="flex items-center gap-2 text-sm font-bold text-cyan-400 opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
                                    LEARN MORE <ArrowRight className="w-4 h-4" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
