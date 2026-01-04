"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { fetchExerciseVideo } from "@/utils/fetchExerciseVideo";
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
    X,
    Activity,
    Wind,
    Timer,
    Mountain,
    ShoppingBag,
    Heart,
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
        id: "pro",
        title: "Pro",
        description: "Mastering Marathon",
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
interface RunType {
    id: number;
    name: string;
    description: string;
    benefits: string[];
    tips: string;
    intensity: "low" | "medium" | "high";
    frequency: string;
}

interface VideoItem {
    title: string;
    duration: string;
    type: string;
    videoQuery: string;
}

interface CourseStage {
    id: string;
    title: string;
    description: string;
    runTypes: RunType[];
}

interface CourseDetail {
    title: string;
    subtitle: string;
    description: string;
    duration: string;
    runTypesCount: number | string;
    enrolled: string;
    rating: number;
    instructor: string;
    progress: number;
    runTypes: RunType[];
    stages?: CourseStage[];
    isSubscription?: boolean;
}

// Featured courses data
const courseDetails: Record<string, CourseDetail> = {
    beginner: {
        title: "Couch to 5K",
        subtitle: "Build Your Foundation",
        description: "Start your running journey with these essential run types. Master each one to build endurance and complete your first 5K.",
        duration: "8 weeks",
        runTypesCount: 6,
        enrolled: "12.5K",
        rating: 4.8,
        instructor: "Coach Mike",
        progress: 75,
        runTypes: [
            {
                id: 1,
                name: "Walk/Run Intervals",
                description: "Alternate between walking and running to build endurance gradually without overexertion.",
                benefits: ["Builds aerobic base safely", "Prevents injury", "Boosts confidence"],
                tips: "Start with 1 min run, 2 min walk. Gradually increase run time each week.",
                intensity: "low",
                frequency: "3x per week"
            },
            {
                id: 2,
                name: "Easy Runs",
                description: "Comfortable-paced runs where you can hold a conversation. The foundation of all running.",
                benefits: ["Develops endurance", "Improves fat burning", "Builds mental stamina"],
                tips: "Keep your heart rate at 60-70% max. If you can't talk, slow down.",
                intensity: "low",
                frequency: "2-3x per week"
            },
            {
                id: 3,
                name: "Recovery Walks",
                description: "Active recovery between run days to promote blood flow and muscle repair.",
                benefits: ["Speeds recovery", "Reduces soreness", "Maintains activity habit"],
                tips: "Keep a leisurely pace. Focus on breathing and enjoying the movement.",
                intensity: "low",
                frequency: "On rest days"
            },
            {
                id: 4,
                name: "Continuous Runs",
                description: "Sustained running without walk breaks. Start with 5 minutes and build up.",
                benefits: ["Builds running endurance", "Improves cardiovascular health", "Increases confidence"],
                tips: "Start slower than you think. It's better to finish strong than start too fast.",
                intensity: "medium",
                frequency: "2x per week"
            },
            {
                id: 5,
                name: "Long Slow Distance",
                description: "Your longest run of the week at an easy, conversational pace.",
                benefits: ["Builds stamina", "Prepares for race distance", "Mental toughness"],
                tips: "Add 5-10 minutes each week. Keep the pace comfortable.",
                intensity: "medium",
                frequency: "1x per week"
            },
            {
                id: 6,
                name: "Progression Run",
                description: "Start easy and gradually increase pace throughout the run.",
                benefits: ["Teaches pace control", "Builds finishing speed", "Simulates race fatigue"],
                tips: "Split your run into thirds: easy, moderate, comfortably hard.",
                intensity: "medium",
                frequency: "1x per week"
            }
        ]
    },
    intermediate: {
        title: "Intermediate Training",
        subtitle: "10K & Half Marathon",
        description: "Level up your running with these intermediate to advanced workout types. Build speed, endurance, and race-day readiness.",
        duration: "12 weeks",
        runTypesCount: 8,
        enrolled: "2.4K",
        rating: 4.9,
        instructor: "Coach Sarah",
        progress: 50,
        runTypes: [
            {
                id: 1,
                name: "Tempo Runs",
                description: "Sustained effort at 'comfortably hard' pace, just below race pace. Trains your lactate threshold.",
                benefits: ["Increases lactate threshold", "Builds race-pace endurance", "Mental toughness"],
                tips: "Run at a pace where you can speak in short phrases. Usually 25-40 minutes.",
                intensity: "high",
                frequency: "1x per week"
            },
            {
                id: 2,
                name: "Interval Training",
                description: "Short, intense bursts of running followed by recovery periods. Builds speed and VO2max.",
                benefits: ["Improves speed", "Increases VO2max", "Burns calories efficiently"],
                tips: "Try 400m repeats with equal rest. Start with 4-6 repeats, build to 8-10.",
                intensity: "high",
                frequency: "1x per week"
            },
            {
                id: 3,
                name: "Fartlek",
                description: "Swedish for 'speed play'. Unstructured intervals mixing fast and slow running.",
                benefits: ["Makes speed work fun", "Improves adaptability", "No equipment needed"],
                tips: "Pick landmarks to sprint to, then recover. Keep it playful and unstructured.",
                intensity: "medium",
                frequency: "1x per week"
            },
            {
                id: 4,
                name: "Hill Repeats",
                description: "Running up hills at hard effort, jogging down for recovery. Builds power and strength.",
                benefits: ["Builds leg strength", "Improves running economy", "Mental fortitude"],
                tips: "Find a 200-400m hill. Sprint up, jog down. Start with 4 repeats.",
                intensity: "high",
                frequency: "1x per week"
            },
            {
                id: 5,
                name: "Long Runs",
                description: "Your weekly cornerstone run. Extended distance at easy pace builds endurance.",
                benefits: ["Builds aerobic capacity", "Trains fat utilization", "Race simulation"],
                tips: "Keep pace conversational. Increase distance by 10% weekly, max.",
                intensity: "medium",
                frequency: "1x per week"
            },
            {
                id: 6,
                name: "Recovery Runs",
                description: "Very easy, short runs the day after hard workouts. Promotes active recovery.",
                benefits: ["Flushes metabolic waste", "Maintains running habit", "Easy mileage"],
                tips: "Run 2-3 minutes slower than normal pace. Keep it truly easy.",
                intensity: "low",
                frequency: "2-3x per week"
            },
            {
                id: 7,
                name: "Race Pace Runs",
                description: "Running at your goal race pace to dial in your target speed.",
                benefits: ["Calibrates race pace", "Builds confidence", "Tests race-day fueling"],
                tips: "Start with 2-3 miles at race pace, extend as race approaches.",
                intensity: "high",
                frequency: "1x every 2 weeks"
            },
            {
                id: 8,
                name: "Strides",
                description: "Short accelerations (80-100m) at fast but controlled pace. Great warmup or workout finisher.",
                benefits: ["Activates fast-twitch fibers", "Improves running form", "Low injury risk"],
                tips: "Do 4-6 strides after easy runs. Focus on form, not speed.",
                intensity: "medium",
                frequency: "3-4x per week"
            }
        ],
        stages: [
            {
                id: "10k",
                title: "10K Training",
                description: "Focus on speed and endurance for the 10K distance.",
                runTypes: [
                    {
                        id: 1,
                        name: "Tempo Runs",
                        description: "Sustained effort at 'comfortably hard' pace. Trains your lactate threshold for 10K speed.",
                        benefits: ["Increases lactate threshold", "Builds speed endurance", "Mental toughness"],
                        tips: "Run at a pace where you can speak in short phrases.",
                        intensity: "high",
                        frequency: "1x per week"
                    },
                    {
                        id: 2,
                        name: "Interval Training",
                        description: "Short, intense bursts of running. Builds VO2 max and turnover.",
                        benefits: ["Improves speed", "Increases VO2max", "Efficient leg turnover"],
                        tips: "400m-1km repeats. Recover equal to run time.",
                        intensity: "high",
                        frequency: "1x per week"
                    },
                    {
                        id: 3,
                        name: "Fartlek",
                        description: "Unstructured speed play. Mix fast and slow running.",
                        benefits: ["Adaptive speed", "Race simulation", "Fun workout"],
                        tips: "Sprint to landmarks, recover between.",
                        intensity: "medium",
                        frequency: "1x per week"
                    },
                    {
                        id: 4,
                        name: "Hill Repeats",
                        description: "Running up hills hard. Builds power.",
                        benefits: ["Leg strength", "Form efficiency", "Power development"],
                        tips: "Sprint up, jog down.",
                        intensity: "high",
                        frequency: "1x per week"
                    }
                ]
            },
            {
                id: "half-marathon",
                title: "Half Marathon",
                description: "Build the mileage and stamina for 21.1km.",
                runTypes: [
                    {
                        id: 5,
                        name: "Long Runs",
                        description: "Extended distance at easy pace. The most important run for HM.",
                        benefits: ["Aerobic capacity", "Muscular endurance", "Fat burning"],
                        tips: "Increase distance by 10% weekly -> up to 18-20km.",
                        intensity: "medium",
                        frequency: "1x per week"
                    },
                    {
                        id: 6,
                        name: "Recovery Runs",
                        description: "Easy runs to flush legs.",
                        benefits: ["Active recovery", "Mileage building", "Injury prevention"],
                        tips: "Keep it VERY easy.",
                        intensity: "low",
                        frequency: "2x per week"
                    },
                    {
                        id: 7,
                        name: "Race Pace Miles",
                        description: "Dialing in your target HM pace.",
                        benefits: ["Pace familiarity", "Confidence", "Race simulation"],
                        tips: "Insert 3-5 miles at goal pace into long run.",
                        intensity: "high",
                        frequency: "Every 2 weeks"
                    },
                    {
                        id: 8,
                        name: "Strides",
                        description: "Short accelerations to maintain turnover.",
                        benefits: ["Neuromuscular efficiency", "Form check", "Leg turnover"],
                        tips: "4-6x 100m after easy runs.",
                        intensity: "medium",
                        frequency: "2x per week"
                    }
                ]
            }
        ]
    },
    pro: {
        title: "Marathon Mastery",
        subtitle: "The Ultimate Challenge",
        description: "Advanced training for the 42.195km. High volume, specific workouts, and race strategy.",
        duration: "16 weeks",
        runTypesCount: 6,
        enrolled: "Elite Only",
        rating: 5.0,
        instructor: "Coach Kipchoge",
        progress: 0,
        isSubscription: true,
        runTypes: [
            {
                id: 1,
                name: "Marathon Long Run",
                description: "The bedrock of marathon training. 24-35km runs to build deep endurance.",
                benefits: ["Glycogen efficiency", "Mental hardening", "Muscular durability"],
                tips: "Practice nutrition/hydration during these runs.",
                intensity: "high",
                frequency: "1x per week"
            },
            {
                id: 2,
                name: "Yasso 800s",
                description: "Predictor workout. 10x 800m. Time in min/sec correlates to marathon hr/min.",
                benefits: ["VO2 max", "Pace prediction", "Speed endurance"],
                tips: "Aim for consistency across all 10 reps.",
                intensity: "high",
                frequency: "Every 3 weeks"
            },
            {
                id: 3,
                name: "Marathon Pace (MP)",
                description: "Extended blocks at goal race pace. E.g., 20km with 14km @ MP.",
                benefits: ["Race simulation", "Confidence", "Efficiency"],
                tips: "Don't race your workout. Hit the exact pace.",
                intensity: "high",
                frequency: "1x per week"
            },
            {
                id: 4,
                name: "Fueling Run",
                description: "Training the gut. Consuming gels/fluids at race rate.",
                benefits: ["Digestive adaptation", "Energy management", "Plan testing"],
                tips: "Test different gels to find what works.",
                intensity: "medium",
                frequency: "During Long Runs"
            },
            {
                id: 5,
                name: "Double Days",
                description: "Two runs in one day to increase volume without single-run stress.",
                benefits: ["Volume boost", "Recovery flush", "Cumulative fatigue"],
                tips: "Keep the second run very short and easy.",
                intensity: "low",
                frequency: "1-2x per week"
            },
            {
                id: 6,
                name: "Taper Run",
                description: "Reducing volume before race day while maintaining intensity.",
                benefits: ["Peak performance", "Muscle repair", "Glycogen load"],
                tips: "Trust the taper. Don't add extra miles.",
                intensity: "low",
                frequency: "Final 2 weeks"
            }
        ]
    }
};

// Stats
// How to Run Topics
const howToRunTopics = [
    {
        id: "form",
        title: "Perfect Form",
        description: "Master the art of efficient running posture",
        icon: Activity,
        videoQuery: "perfect running form technique explained",
        color: "from-blue-500 to-cyan-500"
    },
    {
        id: "breathing",
        title: "Rhythmic Breathing",
        description: "Optimizing oxygen intake for endurance",
        icon: Wind,
        videoQuery: "how to breathe while running without getting tired",
        color: "from-emerald-500 to-teal-500"
    },
    {
        id: "pacing",
        title: "Pacing Strategy",
        description: "Finding and maintaining your ideal speed",
        icon: Timer,
        videoQuery: "running pacing strategy for beginners",
        color: "from-orange-500 to-red-500"
    },
    {
        id: "hills",
        title: "Hill Mastery",
        description: "Techniques for climbing and descending",
        icon: Mountain,
        videoQuery: "how to run hills proper technique",
        color: "from-purple-500 to-pink-500"
    },
    {
        id: "gear",
        title: "Essential Gear",
        description: "Choosing the right shoes and apparel",
        icon: ShoppingBag,
        videoQuery: "running gear essentials for beginners",
        color: "from-yellow-500 to-orange-500"
    },
    {
        id: "warmup",
        title: "Warm-up & Cool-down",
        description: "Preventing injury and aiding recovery",
        icon: Heart,
        videoQuery: "running warm up and cool down routine",
        color: "from-rose-500 to-red-500"
    }
];

// Video Modal Component
function VideoModal({
    video,
    isOpen,
    onClose,
}: {
    video: VideoItem | null;
    isOpen: boolean;
    onClose: () => void;
}) {
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen && video?.videoQuery) {
            setIsLoading(true);
            setVideoUrl(null);
            fetchExerciseVideo(video.videoQuery).then((url) => {
                setVideoUrl(url);
                setIsLoading(false);
            });
        }
        if (!isOpen) {
            setVideoUrl(null);
            setIsLoading(false);
        }
    }, [isOpen, video?.videoQuery]);

    if (!video) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[60] flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-4xl bg-zinc-900 rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5 text-white" />
                        </button>

                        {/* Video Area */}
                        <div className="aspect-video bg-black flex items-center justify-center">
                            {isLoading ? (
                                <div className="flex flex-col items-center gap-4 text-cyan-400">
                                    <div className="w-10 h-10 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
                                    <span className="text-sm font-medium">Loading video...</span>
                                </div>
                            ) : videoUrl ? (
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={`${videoUrl}?autoplay=1&modestbranding=1&rel=0`}
                                    title={video.title}
                                    allow="autoplay; encrypted-media"
                                    allowFullScreen
                                    className="w-full h-full border-none"
                                />
                            ) : (
                                <div className="text-zinc-500">Video unavailable</div>
                            )}
                        </div>

                        {/* Video Info */}
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-white mb-2">{video.title}</h3>
                            <div className="flex items-center gap-4 text-sm text-zinc-400">
                                <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {video.duration}
                                </span>
                                <span className="capitalize">{video.type}</span>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// How to Run Modal (Topic Selection)
function HowToRunModal({
    isOpen,
    onClose,
    onTopicClick,
}: {
    isOpen: boolean;
    onClose: () => void;
    onTopicClick: (topic: typeof howToRunTopics[0]) => void;
}) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-5xl bg-zinc-900 rounded-2xl overflow-hidden border border-white/10 shadow-2xl flex flex-col max-h-[85vh]"
                    >
                        {/* Header */}
                        <div className="p-8 border-b border-white/10 flex items-center justify-between bg-zinc-900/50">
                            <div>
                                <h2 className="text-3xl font-bold text-white font-exo2 mb-2">How to Run</h2>
                                <p className="text-zinc-400">Master the fundamentals with our curated video guides</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6 text-white" />
                            </button>
                        </div>

                        {/* Grid Content */}
                        <div className="p-8 overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {howToRunTopics.map((topic, index) => (
                                    <motion.button
                                        key={topic.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        onClick={() => {
                                            onTopicClick(topic);
                                        }}
                                        className="group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-800/50 text-left hover:border-white/20 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10"
                                    >
                                        <div className={`absolute inset-0 bg-gradient-to-br ${topic.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                                        
                                        <div className="p-6 relative z-10">
                                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${topic.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                                <topic.icon className="w-6 h-6 text-white" />
                                            </div>
                                            
                                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                                                {topic.title}
                                            </h3>
                                            <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                                                {topic.description}
                                            </p>
                                            
                                            <div className="flex items-center text-xs font-medium text-white/50 group-hover:text-white transition-colors">
                                                <Play className="w-3 h-3 mr-2" />
                                                Watch Guide
                                            </div>
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}




function RunningIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M13.49 5.48C14.59 5.48 15.49 4.58 15.49 3.48C15.49 2.38 14.59 1.48 13.49 1.48C12.39 1.48 11.49 2.38 11.49 3.48C11.49 4.58 12.39 5.48 13.49 5.48ZM9.89 19.38L10.89 14.98L12.99 16.98V22.98H14.99V15.48L12.89 13.48L13.49 10.48C14.79 11.98 16.79 12.98 18.99 12.98V10.98C17.09 10.98 15.49 9.98 14.69 8.58L13.69 6.98C13.29 6.38 12.69 5.98 11.99 5.98C11.69 5.98 11.49 6.08 11.19 6.08L5.99 8.28V12.98H7.99V9.58L9.79 8.88L8.19 16.98L3.29 15.98L2.89 17.98L9.89 19.38Z" />
        </svg>
    );
}

export default function LearnPage() {
    const [selectedPath, setSelectedPath] = useState("beginner");
    const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showHowToRun, setShowHowToRun] = useState(false);
    const [selectedStage, setSelectedStage] = useState<string>("");

    const currentCourse = courseDetails[selectedPath as keyof typeof courseDetails];
    const currentPathConfig = learningPaths.find(p => p.id === selectedPath) || learningPaths[0];

    useEffect(() => {
        if (currentCourse?.stages && currentCourse.stages.length > 0) {
            setSelectedStage(currentCourse.stages[0].id);
        } else {
            setSelectedStage("");
        }
    }, [selectedPath, currentCourse]);

    const handleTopicClick = (topic: typeof howToRunTopics[0]) => {
        const video: VideoItem = {
            title: topic.title,
            duration: "Video Guide",
            type: "video",
            videoQuery: topic.videoQuery,
        };
        setSelectedVideo(video);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedVideo(null);
    };

    const displayedRunTypes = (currentCourse?.stages && selectedStage) 
        ? currentCourse.stages.find(s => s.id === selectedStage)?.runTypes || [] 
        : currentCourse?.runTypes || [];


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
            {/* How to Run Button (Relocated) */}
            <div className="mb-8">
                <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    onClick={() => setShowHowToRun(true)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full relative overflow-hidden rounded-2xl bg-gradient-to-r from-zinc-900 to-zinc-800 border border-white/10 p-6 group transition-all hover:border-cyan-500/30"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-110 transition-transform duration-300">
                                <RunningIcon className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-left">
                                <h3 className="text-lg font-bold text-white font-exo2 group-hover:text-cyan-400 transition-colors">
                                    How to Run
                                </h3>
                                <p className="text-sm text-zinc-400">
                                    Master form, breathing & technique
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm font-medium text-cyan-400">
                            <span>Watch Guides</span>
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </motion.button>
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
                                <p className="text-xs text-zinc-500">{path.description}</p>
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

                                {/* Stage Selector */}
                                {currentCourse.stages && (
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {currentCourse.stages.map((stage) => (
                                            <button
                                                key={stage.id}
                                                onClick={() => setSelectedStage(stage.id)}
                                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                                                    selectedStage === stage.id
                                                        ? `bg-gradient-to-r ${currentPathConfig.buttonGradient} text-white shadow-lg`
                                                        : "bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
                                                }`}
                                            >
                                                {stage.title}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                </div>
                            </div>
                        </div>
                    </motion.div>
            </AnimatePresence>

            {/* Run Types Grid */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white font-exo2">Run Types to Practice</h3>
                        <span className="text-sm text-zinc-500">{displayedRunTypes.length} types</span>
                    </div>
                    
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={selectedPath + selectedStage}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                        >
                            {displayedRunTypes.map((runType, index) => (
                                <motion.div
                                    key={runType.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="group relative p-5 rounded-xl bg-zinc-900/50 border border-white/5 hover:border-white/10 transition-all"
                                >
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-3">
                                        <h4 className="font-bold text-white group-hover:text-cyan-400 transition-colors">
                                            {runType.name}
                                        </h4>
                                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                            runType.intensity === 'low' 
                                                ? 'bg-emerald-500/20 text-emerald-400' 
                                                : runType.intensity === 'medium' 
                                                    ? 'bg-yellow-500/20 text-yellow-400'
                                                    : 'bg-red-500/20 text-red-400'
                                        }`}>
                                            {runType.intensity}
                                        </span>
                                    </div>

                                    {/* Description */}
                                    <p className="text-sm text-zinc-400 mb-4 leading-relaxed">
                                        {runType.description}
                                    </p>

                                    {/* Benefits */}
                                    <div className="mb-4">
                                        <div className="text-xs font-medium text-zinc-500 mb-2">Benefits</div>
                                        <div className="flex flex-wrap gap-2">
                                            {runType.benefits.map((benefit, i) => (
                                                <span 
                                                    key={i}
                                                    className="px-2 py-1 rounded-md bg-white/5 text-xs text-zinc-400"
                                                >
                                                    {benefit}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Tip */}
                                    <div className="p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/10">
                                        <div className="flex items-start gap-2">
                                            <Flame className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                                            <div>
                                                <span className="text-xs font-medium text-cyan-400">Pro Tip</span>
                                                <p className="text-xs text-zinc-400 mt-0.5">
                                                    {runType.tips}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Frequency */}
                                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                                        <span className="text-xs text-zinc-500">Recommended</span>
                                        <span className={`text-xs font-medium ${currentPathConfig.textColor}`}>
                                            {runType.frequency}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>

            {/* How to Run Modal */}
            <HowToRunModal
                isOpen={showHowToRun}
                onClose={() => setShowHowToRun(false)}
                onTopicClick={handleTopicClick}
            />

            {/* Video Modal */}
            <VideoModal
                video={selectedVideo}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />
        </div>
    );
}
