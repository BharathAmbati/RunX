
"use client";

import { motion } from "motion/react";

import { MovingTrack } from "@/components/ui/moving-track";
import { useAuthModal } from "@/components/providers/auth-modal-provider";

export default function Hero() {
    const { openModal } = useAuthModal();

    return (
        <section id="home" className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black">
            {/* Background Elements */}
            <MovingTrack className="z-0" />

            <div className="relative z-10 text-center px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-cyan-400 font-bold tracking-[0.2em] uppercase mb-4">
                        The Future of Running
                    </h2>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tighter font-orbitron"
                >
                    RUN BEYOND
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600 dark:from-cyan-400 dark:to-blue-600">
                        LIMITS
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-10"
                >
                    Join the elite community of runners pushing the boundaries of human performance through technology and training.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="flex flex-col md:flex-row gap-4 justify-center"
                >
                    <motion.button 
                        onClick={openModal}
                        whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(6,182,212,0.8)" }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ boxShadow: "0 0 20px rgba(6,182,212,0.4)" }}
                        animate={{ 
                            boxShadow: ["0 0 20px rgba(6,182,212,0.4)", "0 0 40px rgba(6,182,212,0.6)", "0 0 20px rgba(6,182,212,0.4)"],
                        }}
                        transition={{
                            boxShadow: {
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }
                        }}
                        className="px-8 py-4 bg-cyan-500 text-white font-bold rounded-full hover:bg-cyan-400 transition-colors"
                    >
                        START YOUR JOURNEY
                    </motion.button>
                   
                </motion.div>
            </div>
        </section>
    );
}
