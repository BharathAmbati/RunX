"use client";

import { motion } from "motion/react";
import { Play, BookOpen, HeartPulse, Zap } from "lucide-react";

export default function LearnPage() {
    const courses = [
        { title: "Running Fundamentals", category: "Technique", duration: "45 min", icon: Play, color: "text-cyan-400" },
        { title: "Marathon Nutrition", category: "Health", duration: "1h 20m", icon: HeartPulse, color: "text-red-400" },
        { title: "Sprint Mechanics", category: "Performance", duration: "30 min", icon: Zap, color: "text-yellow-400" },
        { title: "Recovery Science", category: "Health", duration: "55 min", icon: BookOpen, color: "text-green-400" },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-orbitron text-white mb-2">Learn</h1>
                <p className="text-zinc-400">Master your running journey with expert guides.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course, index) => (
                    <motion.div
                        key={course.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group relative overflow-hidden rounded-2xl bg-zinc-900/50 border border-white/10 backdrop-blur-sm hover:bg-white/5 transition-colors cursor-pointer"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        <div className="p-6 relative z-10">
                            <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 ${course.color} group-hover:scale-110 transition-transform`}>
                                <course.icon className="w-6 h-6" />
                            </div>
                            
                            <div className="text-xs font-medium text-zinc-500 mb-2 uppercase tracking-wider">
                                {course.category} • {course.duration}
                            </div>
                            
                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                                {course.title}
                            </h3>
                            
                            <p className="text-sm text-zinc-400">
                                Comprehensive guide to improve your {course.title.toLowerCase()}.
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
