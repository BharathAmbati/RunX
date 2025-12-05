"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import {
    Play,
    BookOpen,
    HeartPulse,
    Zap,
    Clock,
    CheckCircle2,
    ChevronRight,
    Trophy,
    Target,
    Flame,
    Star,
    Lock,
    BarChart3,
} from "lucide-react";
import { Magnetic } from "@/components/ui/magnetic";

// Learning paths data
const learningPaths = [
    {
        id: "beginner",
        title: "Beginner",
        description: "Start your running journey",
        progress: 75,
        courses: 4,
        completedCourses: 3,
        color: "from-emerald-500 to-teal-600",
        bgColor: "bg-emerald-500/10",
        borderColor: "border-emerald-500/20",
        textColor: "text-emerald-400",
    },
    {
        id: "intermediate",
        title: "Intermediate",
        description: "Build endurance & speed",
        progress: 40,
        courses: 6,
        completedCourses: 2,
        color: "from-cyan-500 to-blue-600",
        bgColor: "bg-cyan-500/10",
        borderColor: "border-cyan-500/20",
        textColor: "text-cyan-400",
    },
    {
        id: "advanced",
        title: "Advanced",
        description: "Master elite techniques",
        progress: 0,
        courses: 5,
        completedCourses: 0,
        color: "from-purple-500 to-pink-600",
        bgColor: "bg-purple-500/10",
        borderColor: "border-purple-500/20",
        textColor: "text-purple-400",
        locked: true,
    },
];

// Featured course
const featuredCourse = {
    title: "Marathon Mastery",
    subtitle: "Complete Training Program",
    description: "A comprehensive 12-week program designed to take you from your first 5K to marathon-ready.",
    duration: "12 weeks",
    lessons: 48,
    enrolled: "2.4K",
    rating: 4.9,
    instructor: "Coach Sarah",
};

// Course lessons
const lessons = [
    { id: 1, title: "Running Form Fundamentals", duration: "12 min", completed: true, type: "video" },
    { id: 2, title: "Breathing Techniques", duration: "8 min", completed: true, type: "video" },
    { id: 3, title: "Warm-up Routines", duration: "15 min", completed: true, type: "practice" },
    { id: 4, title: "Building Your Base", duration: "18 min", completed: false, type: "video", current: true },
    { id: 5, title: "Injury Prevention", duration: "14 min", completed: false, type: "video" },
    { id: 6, title: "Nutrition Basics", duration: "20 min", completed: false, type: "article" },
];

// Stats
const stats = [
    { label: "Lessons Completed", value: "24", icon: CheckCircle2, color: "text-emerald-400" },
    { label: "Hours Learned", value: "8.5", icon: Clock, color: "text-cyan-400" },
    { label: "Current Streak", value: "7 days", icon: Flame, color: "text-orange-400" },
];

export default function LearnPage() {
    const [selectedPath, setSelectedPath] = useState("beginner");
    const [hoveredLesson, setHoveredLesson] = useState<number | null>(null);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <motion.h1 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-bold text-white mb-2 font-exo2"
                >
                    Learn
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-zinc-400"
                >
                    Master the art of running with expert-led courses.
                </motion.p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + index * 0.05 }}
                        className="p-4 rounded-xl bg-zinc-900/50 border border-white/5"
                    >
                        <div className="flex items-center gap-3">
                            <stat.icon className={`w-5 h-5 ${stat.color}`} />
                            <div>
                                <div className="text-xl font-bold text-white font-mono">{stat.value}</div>
                                <div className="text-xs text-zinc-500">{stat.label}</div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Featured Course Hero */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-500/10 via-blue-600/10 to-purple-600/10 border border-white/10"
            >
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-30">
                    <motion.div
                        animate={{ 
                            backgroundPosition: ["0% 0%", "100% 100%"],
                        }}
                        transition={{ 
                            duration: 20, 
                            repeat: Infinity, 
                            repeatType: "reverse" 
                        }}
                        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.1),transparent_50%)]"
                        style={{ backgroundSize: "200% 200%" }}
                    />
                </div>

                <div className="relative p-8">
                    <div className="flex items-start justify-between">
                        <div className="max-w-xl">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="px-2 py-1 rounded-md bg-cyan-500/20 text-cyan-400 text-xs font-medium">FEATURED</span>
                                <span className="flex items-center gap-1 text-yellow-400 text-sm">
                                    <Star className="w-4 h-4 fill-yellow-400" />
                                    {featuredCourse.rating}
                                </span>
                            </div>
                            
                            <h2 className="text-2xl font-bold text-white mb-1 font-exo2">
                                {featuredCourse.title}
                            </h2>
                            <p className="text-cyan-400 text-sm mb-4">{featuredCourse.subtitle}</p>
                            <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                                {featuredCourse.description}
                            </p>

                            <div className="flex items-center gap-6 text-sm text-zinc-400 mb-6">
                                <span className="flex items-center gap-1.5">
                                    <Clock className="w-4 h-4" />
                                    {featuredCourse.duration}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <BookOpen className="w-4 h-4" />
                                    {featuredCourse.lessons} lessons
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Target className="w-4 h-4" />
                                    {featuredCourse.enrolled} enrolled
                                </span>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-medium text-sm"
                            >
                                <Play className="w-4 h-4" />
                                Continue Learning
                            </motion.button>
                        </div>

                        {/* Progress Ring */}
                        <div className="hidden md:flex flex-col items-center">
                            <div className="relative w-32 h-32">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle
                                        cx="64"
                                        cy="64"
                                        r="56"
                                        stroke="currentColor"
                                        strokeWidth="8"
                                        fill="none"
                                        className="text-white/5"
                                    />
                                    <motion.circle
                                        cx="64"
                                        cy="64"
                                        r="56"
                                        stroke="url(#progressGradient)"
                                        strokeWidth="8"
                                        fill="none"
                                        strokeLinecap="round"
                                        initial={{ strokeDasharray: "0 352" }}
                                        animate={{ strokeDasharray: "176 352" }}
                                        transition={{ delay: 0.5, duration: 1.5, ease: "easeOut" }}
                                    />
                                    <defs>
                                        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#06b6d4" />
                                            <stop offset="100%" stopColor="#3b82f6" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-3xl font-bold text-white font-mono">50%</span>
                                    <span className="text-xs text-zinc-500">Complete</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Learning Paths */}
            <div>
                <h3 className="text-lg font-bold text-white mb-4 font-exo2">Learning Paths</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {learningPaths.map((path, index) => (
                        <Magnetic key={path.id} intensity={path.locked ? 0 : 0.4} range={120}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + index * 0.1 }}
                                whileHover={{ scale: path.locked ? 1 : 1.02 }}
                                onClick={() => !path.locked && setSelectedPath(path.id)}
                                className={`relative p-5 rounded-xl border cursor-pointer transition-all ${
                                    selectedPath === path.id 
                                        ? `${path.bgColor} ${path.borderColor}` 
                                        : "bg-zinc-900/50 border-white/5 hover:border-white/10"
                                } ${path.locked ? "opacity-60 cursor-not-allowed" : ""}`}
                            >
                                {path.locked && (
                                    <div className="absolute top-4 right-4">
                                        <Lock className="w-4 h-4 text-zinc-500" />
                                    </div>
                                )}
                                
                                <div className={`text-sm font-bold mb-1 ${path.textColor}`}>
                                    {path.title}
                                </div>
                                <p className="text-xs text-zinc-500 mb-4">{path.description}</p>
                                
                                <div className="flex items-center justify-between text-xs text-zinc-400 mb-3">
                                    <span>{path.completedCourses}/{path.courses} courses</span>
                                    <span>{path.progress}%</span>
                                </div>
                                
                                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${path.progress}%` }}
                                        transition={{ delay: 0.5 + index * 0.1, duration: 1, ease: "easeOut" }}
                                        className={`h-full bg-gradient-to-r ${path.color} rounded-full`}
                                    />
                                </div>
                            </motion.div>
                        </Magnetic>
                    ))}
                </div>
            </div>

            {/* Course Lessons */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white font-exo2">Up Next</h3>
                    <button className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1">
                        View All <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
                
                <div className="space-y-2">
                    {lessons.map((lesson, index) => (
                        <motion.div
                            key={lesson.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 + index * 0.05 }}
                            onHoverStart={() => setHoveredLesson(lesson.id)}
                            onHoverEnd={() => setHoveredLesson(null)}
                            className={`group relative flex items-center gap-4 p-4 rounded-xl transition-all cursor-pointer ${
                                lesson.current 
                                    ? "bg-cyan-500/10 border border-cyan-500/20" 
                                    : "bg-zinc-900/30 border border-transparent hover:bg-zinc-900/50 hover:border-white/5"
                            }`}
                        >
                            {/* Lesson Number / Status */}
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                                lesson.completed 
                                    ? "bg-emerald-500/20" 
                                    : lesson.current 
                                        ? "bg-cyan-500/20" 
                                        : "bg-white/5"
                            }`}>
                                {lesson.completed ? (
                                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                ) : lesson.current ? (
                                    <Play className="w-5 h-5 text-cyan-400" />
                                ) : (
                                    <span className="text-sm font-mono text-zinc-500">{lesson.id}</span>
                                )}
                            </div>

                            {/* Lesson Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className={`font-medium ${lesson.current ? "text-white" : lesson.completed ? "text-zinc-400" : "text-zinc-300"}`}>
                                        {lesson.title}
                                    </span>
                                    {lesson.current && (
                                        <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-400 text-xs">
                                            In Progress
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-3 mt-1 text-xs text-zinc-500">
                                    <span className="flex items-center gap-1">
                                        {lesson.type === "video" && <Play className="w-3 h-3" />}
                                        {lesson.type === "practice" && <Target className="w-3 h-3" />}
                                        {lesson.type === "article" && <BookOpen className="w-3 h-3" />}
                                        {lesson.type}
                                    </span>
                                    <span>{lesson.duration}</span>
                                </div>
                            </div>

                            {/* Hover Action */}
                            <AnimatePresence>
                                {hoveredLesson === lesson.id && !lesson.completed && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="flex items-center gap-2"
                                    >
                                        <span className="text-xs text-cyan-400">
                                            {lesson.current ? "Continue" : "Start"}
                                        </span>
                                        <ChevronRight className="w-4 h-4 text-cyan-400" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
