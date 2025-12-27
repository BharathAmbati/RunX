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
const learningPaths: LearningPath[] = [
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
        heroGradient: "from-emerald-500/10 via-teal-500/10 to-green-500/10",
        buttonGradient: "from-emerald-500 to-teal-600",
        completedBg: "bg-emerald-500/20",
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
        heroGradient: "from-cyan-500/10 via-blue-600/10 to-purple-600/10",
        buttonGradient: "from-cyan-500 to-blue-600",
        completedBg: "bg-cyan-500/20",
    },
    {
        id: "advanced",
        title: "Personal Coaching",
        description: "1-on-1 Expert Guidance",
        progress: 0,
        courses: 0,
        completedCourses: 0,
        color: "from-orange-500 to-red-600",
        bgColor: "bg-orange-500/10",
        borderColor: "border-orange-500/20",
        textColor: "text-orange-400",
        heroGradient: "from-orange-500/10 via-red-500/10 to-amber-500/10",
        buttonGradient: "from-orange-500 to-red-600",
        completedBg: "bg-orange-500/20",
    },
];

interface LearningPath {
    id: string;
    title: string;
    description: string;
    progress: number;
    courses: number;
    completedCourses: number;
    color: string;
    bgColor: string;
    borderColor: string;
    textColor: string;
    heroGradient: string;
    buttonGradient: string;
    completedBg?: string; // Made optional if needed, or keep consistent
    locked?: boolean;
}

// Types
interface Lesson {
    id: number;
    title: string;
    duration: string;
    completed: boolean;
    type: string;
    current?: boolean;
}

interface CourseDetail {
    title: string;
    subtitle: string;
    description: string;
    duration: string;
    lessonsCount: number | string;
    enrolled: string;
    rating: number;
    instructor: string;
    progress: number;
    lessons: Lesson[];
    isSubscription?: boolean;
}

// Featured courses data
const courseDetails: Record<string, CourseDetail> = {
    beginner: {
        title: "Couch to 5K",
        subtitle: "Your First Steps",
        description: "The perfect starting point for new runners. Build stamina gradually with walk-run intervals to complete your first 5K with confidence.",
        duration: "8 weeks",
        lessonsCount: 24,
        enrolled: "12.5K",
        rating: 4.8,
        instructor: "Coach Mike",
        progress: 75,
        lessons: [
            { id: 1, title: "Walking Intervals", duration: "20 min", completed: true, type: "practice" },
            { id: 2, title: "Proper Footwear", duration: "10 min", completed: true, type: "video" },
            { id: 3, title: "Breathing Basics", duration: "8 min", completed: true, type: "video" },
            { id: 4, title: "First Non-Stop Run", duration: "15 min", completed: false, type: "practice", current: true },
            { id: 5, title: "Post-Run Stretch", duration: "12 min", completed: false, type: "video" },
        ]
    },
    intermediate: {
        title: "Marathon Mastery",
        subtitle: "Complete Training Program",
        description: "A comprehensive 12-week program designed to take you from your first 5K to marathon-ready. Focuses on endurance building and pace management.",
        duration: "12 weeks",
        lessonsCount: 48,
        enrolled: "2.4K",
        rating: 4.9,
        instructor: "Coach Sarah",
        progress: 50,
        lessons: [
            { id: 1, title: "Running Form Fundamentals", duration: "12 min", completed: true, type: "video" },
            { id: 2, title: "Breathing Techniques", duration: "8 min", completed: true, type: "video" },
            { id: 3, title: "Warm-up Routines", duration: "15 min", completed: true, type: "practice" },
            { id: 4, title: "Building Your Base", duration: "18 min", completed: false, type: "video", current: true },
            { id: 5, title: "Injury Prevention", duration: "14 min", completed: false, type: "video" },
            { id: 6, title: "Nutrition Basics", duration: "20 min", completed: false, type: "article" },
        ]
    },
    advanced: {
        title: "Elite Personal Coaching",
        subtitle: "Direct access to Olympic-level coaches",
        description: "Get a fully personalized training plan adapted to your life and goals. Weekly video calls, daily form analysis, and 24/7 expert support to smash your PBs.",
        duration: "Monthly",
        lessonsCount: "Unique",
        enrolled: "Limited",
        rating: 5.0,
        instructor: "Elite Team",
        progress: 0,
        isSubscription: true,
        lessons: [
            { id: 1, title: "Initial Consultation", duration: "45 min", completed: false, type: "video" },
            { id: 2, title: "Goal Setting Workshop", duration: "30 min", completed: false, type: "call" },
            { id: 3, title: "Performance Assessment", duration: "60 min", completed: false, type: "practice" },
        ]
    }
};

// Stats
const stats = [
    { label: "Lessons Completed", value: "24", icon: CheckCircle2, color: "text-emerald-400" },
    { label: "Hours Learned", value: "8.5", icon: Clock, color: "text-cyan-400" },
    { label: "Current Streak", value: "7 days", icon: Flame, color: "text-orange-400" },
];

export default function LearnPage() {
    const [selectedPath, setSelectedPath] = useState("beginner");
    const [hoveredLesson, setHoveredLesson] = useState<number | null>(null);

    const currentCourse = courseDetails[selectedPath as keyof typeof courseDetails];
    const currentPathConfig = learningPaths.find(p => p.id === selectedPath) || learningPaths[0];

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

            {/* Featured Course Hero (Dynamic) */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={selectedPath}
                    initial={{ opacity: 0, scale: 0.98, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${currentPathConfig.heroGradient} border border-white/10`}
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
                            className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"
                            style={{ backgroundSize: "200% 200%" }}
                        />
                    </div>

                    <div className="relative p-8">
                        <div className="flex items-start justify-between">
                            <div className="max-w-xl">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className={`px-2 py-1 rounded-md ${currentPathConfig.bgColor} ${currentPathConfig.textColor} text-xs font-medium`}>FEATURED</span>
                                    <span className="flex items-center gap-1 text-yellow-400 text-sm">
                                        <Star className="w-4 h-4 fill-yellow-400" />
                                        {currentCourse.rating}
                                    </span>
                                </div>
                                
                                <h2 className="text-2xl font-bold text-white mb-1 font-exo2">
                                    {currentCourse.title}
                                </h2>
                                <p className={currentPathConfig.textColor + " text-sm mb-4"}>{currentCourse.subtitle}</p>
                                <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                                    {currentCourse.description}
                                </p>

                                <div className="flex items-center gap-6 text-sm text-zinc-400 mb-6">
                                    <span className="flex items-center gap-1.5">
                                        <Clock className="w-4 h-4" />
                                        {currentCourse.duration}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <BookOpen className="w-4 h-4" />
                                        {currentCourse.lessonsCount} {typeof currentCourse.lessonsCount === 'number' ? 'lessons' : ''}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Target className="w-4 h-4" />
                                        {currentCourse.enrolled} {currentCourse.isSubscription ? 'spots' : 'enrolled'}
                                    </span>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${currentPathConfig.buttonGradient} text-white rounded-xl font-medium text-sm`}
                                >
                                    {currentCourse.isSubscription ? (
                                        <Zap className="w-4 h-4" />
                                    ) : (
                                        <Play className="w-4 h-4" />
                                    )}
                                    {currentCourse.isSubscription ? "Subscribe to Pro" : "Continue Learning"}
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
                                            stroke={`url(#progressGradient-${selectedPath})`}
                                            strokeWidth="8"
                                            fill="none"
                                            strokeLinecap="round"
                                            initial={{ strokeDasharray: "0 352" }}
                                            animate={{ strokeDasharray: `${(currentCourse.progress / 100) * 352} 352` }}
                                            transition={{ delay: 0.5, duration: 1.5, ease: "easeOut" }}
                                        />
                                        <defs>
                                            <linearGradient id={`progressGradient-${selectedPath}`} x1="0%" y1="0%" x2="100%" y2="0%">
                                                {/* Start/End colors approximation based on path */}
                                                <stop offset="0%" stopColor={selectedPath === 'beginner' ? '#10b981' : selectedPath === 'intermediate' ? '#06b6d4' : '#f97316'} />
                                                <stop offset="100%" stopColor={selectedPath === 'beginner' ? '#0d9488' : selectedPath === 'intermediate' ? '#3b82f6' : '#dc2626'} />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-3xl font-bold text-white font-mono">{currentCourse.progress}%</span>
                                        <span className="text-xs text-zinc-500">Complete</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Course Lessons */}
            {!currentCourse.isSubscription && (
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white font-exo2">Up Next</h3>
                        <button className={`text-sm ${currentPathConfig.textColor} hover:opacity-80 transition-colors flex items-center gap-1`}>
                            View All <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                    
                    <div className="space-y-2">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={selectedPath}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {currentCourse.lessons.map((lesson, index) => (
                                    <motion.div
                                        key={lesson.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        onHoverStart={() => setHoveredLesson(lesson.id)}
                                        onHoverEnd={() => setHoveredLesson(null)}
                                        className={`group relative flex items-center gap-4 p-4 rounded-xl transition-all cursor-pointer mb-2 ${
                                            lesson.current 
                                                ? `${currentPathConfig.bgColor} ${currentPathConfig.borderColor} border`
                                                : "bg-zinc-900/30 border border-transparent hover:bg-zinc-900/50 hover:border-white/5"
                                        }`}
                                    >
                                        {/* Lesson Number / Status */}
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                                            lesson.completed 
                                                ? currentPathConfig.completedBg
                                                : lesson.current 
                                                    ? currentPathConfig.bgColor
                                                    : "bg-white/5"
                                        }`}>
                                            {lesson.completed ? (
                                                <CheckCircle2 className={`w-5 h-5 ${currentPathConfig.textColor}`} />
                                            ) : lesson.current ? (
                                                <Play className={`w-5 h-5 ${currentPathConfig.textColor}`} />
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
                                                    <span className={`px-2 py-0.5 rounded-md ${currentPathConfig.bgColor} ${currentPathConfig.textColor} text-xs`}>
                                                        In Progress
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-3 mt-1 text-xs text-zinc-500">
                                                <span className="flex items-center gap-1">
                                                    {lesson.type === "video" && <Play className="w-3 h-3" />}
                                                    {lesson.type === "practice" && <Target className="w-3 h-3" />}
                                                    {lesson.type === "article" && <BookOpen className="w-3 h-3" />}
                                                    {lesson.type === "call" && <Zap className="w-3 h-3" />}
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
                                                    <span className={`text-xs ${currentPathConfig.textColor}`}>
                                                        {lesson.current ? "Continue" : "Start"}
                                                    </span>
                                                    <ChevronRight className={`w-4 h-4 ${currentPathConfig.textColor}`} />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            )}
        </div>
    );
}
