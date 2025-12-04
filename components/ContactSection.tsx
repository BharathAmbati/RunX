"use client";

import { motion } from "motion/react";
import { Mail, MapPin, Phone, Send } from "lucide-react";

export default function ContactSection() {
    return (
        <section className="py-24 bg-black relative overflow-hidden border-t border-white/10">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-zinc-900 to-transparent opacity-50" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />

            <div className="container mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 font-orbitron">
                        GET IN <span className="text-cyan-400">TOUCH</span>
                    </h2>
                    <p className="text-zinc-400 max-w-2xl mx-auto">
                        Have questions or ready to start your journey? We're here to help.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        <div className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5 backdrop-blur-sm">
                            <h3 className="text-2xl font-bold text-white mb-6 font-orbitron">Contact Info</h3>
                            <div className="space-y-6">
                                <div className="flex items-center gap-4 group">
                                    <div className="p-3 rounded-xl bg-zinc-800 group-hover:bg-cyan-500/20 group-hover:text-cyan-400 transition-colors text-zinc-400">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-zinc-500">Email Us</p>
                                        <p className="text-white font-medium">hello@runx.com</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 group">
                                    <div className="p-3 rounded-xl bg-zinc-800 group-hover:bg-cyan-500/20 group-hover:text-cyan-400 transition-colors text-zinc-400">
                                        <Phone className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-zinc-500">Call Us</p>
                                        <p className="text-white font-medium">+1 (555) 123-4567</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 group">
                                    <div className="p-3 rounded-xl bg-zinc-800 group-hover:bg-cyan-500/20 group-hover:text-cyan-400 transition-colors text-zinc-400">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-zinc-500">Visit Us</p>
                                        <p className="text-white font-medium">123 Runner's Way, NY</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5 backdrop-blur-sm"
                    >
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm text-zinc-400">First Name</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-white/10 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none text-white transition-all"
                                        placeholder="John"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-zinc-400">Last Name</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-white/10 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none text-white transition-all"
                                        placeholder="Doe"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-zinc-400">Email Address</label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-white/10 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none text-white transition-all"
                                    placeholder="john@example.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-zinc-400">Message</label>
                                <textarea
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-white/10 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none text-white transition-all resize-none"
                                    placeholder="How can we help you?"
                                />
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold font-orbitron tracking-wider flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-shadow"
                            >
                                SEND MESSAGE
                                <Send className="w-4 h-4" />
                            </motion.button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
