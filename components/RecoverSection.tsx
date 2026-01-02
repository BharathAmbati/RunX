"use client";

import { motion, useScroll, useTransform, Variants, AnimatePresence } from "motion/react";
import Image from "next/image";
import { 
    Heart, 
    Utensils, 
    Pill, 
    Dumbbell, 
    ChevronDown, 
    Leaf, 
    Droplets, 
    Zap as ZapIcon,
    Sun,
    Bone,
    Apple,
    Fish,
    Egg,
    Coffee,
    Salad,
    Beef,
    X,
    Play,
    Clock,
    Info
} from "lucide-react";
import { useRef, useState } from "react";

// Pre-run and Post-run nutrition data with 3 meal plan options (Indian foods)
// ... (nutritionData remains unchanged)
const nutritionData = {
    veg: {
        preRun: [
            // Option 1
            [
                { icon: <Apple className="w-5 h-5" />, name: "Banana", benefit: "Quick energy + potassium", timing: "30 min before" },
                { icon: <Salad className="w-5 h-5" />, name: "Poha", benefit: "Light carbs + iron from peanuts", timing: "2 hrs before" },
                { icon: <Droplets className="w-5 h-5" />, name: "Nimbu Paani", benefit: "Natural electrolytes", timing: "Throughout day" },
                { icon: <Utensils className="w-5 h-5" />, name: "Idli + Chutney", benefit: "Easily digestible carbs", timing: "2-3 hrs before" },
            ],
            // Option 2
            [
                { icon: <Salad className="w-5 h-5" />, name: "Upma", benefit: "Complex carbs + veggies", timing: "2 hrs before" },
                { icon: <Apple className="w-5 h-5" />, name: "Chikoo", benefit: "Natural sugars + energy", timing: "45 min before" },
                { icon: <Droplets className="w-5 h-5" />, name: "Coconut Water", benefit: "Natural electrolytes", timing: "Throughout day" },
                { icon: <Leaf className="w-5 h-5" />, name: "Dry Fruits Mix", benefit: "Quick energy boost", timing: "30 min before" },
            ],
            // Option 3
            [
                { icon: <Salad className="w-5 h-5" />, name: "Dalia (Broken Wheat)", benefit: "Slow-release energy", timing: "2 hrs before" },
                { icon: <Apple className="w-5 h-5" />, name: "Dates (Khajoor)", benefit: "Instant energy boost", timing: "30 min before" },
                { icon: <Utensils className="w-5 h-5" />, name: "Sattu Drink", benefit: "Protein + cooling", timing: "1 hr before" },
                { icon: <Leaf className="w-5 h-5" />, name: "Makhana", benefit: "Light snack + protein", timing: "45 min before" },
            ],
        ],
        postRun: [
            // Option 1
            [
                { icon: <Utensils className="w-5 h-5" />, name: "Dal Chawal", benefit: "Complete protein + carbs", timing: "Within 30 min" },
                { icon: <Salad className="w-5 h-5" />, name: "Paneer Bhurji", benefit: "High protein + calcium", timing: "Recovery meal" },
                { icon: <Leaf className="w-5 h-5" />, name: "Curd Rice", benefit: "Probiotics + cooling", timing: "Within 2 hrs" },
                { icon: <Utensils className="w-5 h-5" />, name: "Rajma Chawal", benefit: "Fiber + plant protein", timing: "Recovery meal" },
            ],
            // Option 2
            [
                { icon: <Salad className="w-5 h-5" />, name: "Chole Kulche", benefit: "Protein + carbs combo", timing: "Within 30 min" },
                { icon: <Leaf className="w-5 h-5" />, name: "Palak Paneer", benefit: "Iron + protein", timing: "Recovery meal" },
                { icon: <Utensils className="w-5 h-5" />, name: "Masoor Dal", benefit: "Quick-cooking protein", timing: "Within 2 hrs" },
                { icon: <Apple className="w-5 h-5" />, name: "Lassi", benefit: "Probiotics + protein", timing: "Within 30 min" },
            ],
            // Option 3
            [
                { icon: <Salad className="w-5 h-5" />, name: "Sabudana Khichdi", benefit: "Instant energy replenish", timing: "Within 30 min" },
                { icon: <Utensils className="w-5 h-5" />, name: "Kadhi Chawal", benefit: "Probiotics + carbs", timing: "Recovery meal" },
                { icon: <Leaf className="w-5 h-5" />, name: "Sprouts Chaat", benefit: "Plant protein + fiber", timing: "Within 2 hrs" },
                { icon: <Utensils className="w-5 h-5" />, name: "Moong Dal Cheela", benefit: "Light protein meal", timing: "Any time" },
            ],
        ]
    },
    nonVeg: {
        preRun: [
            // Option 1
            [
                { icon: <Apple className="w-5 h-5" />, name: "Banana", benefit: "Quick energy + potassium", timing: "30 min before" },
                { icon: <Egg className="w-5 h-5" />, name: "Boiled Eggs", benefit: "High protein start", timing: "2 hrs before" },
                { icon: <Droplets className="w-5 h-5" />, name: "Nimbu Paani", benefit: "Natural electrolytes", timing: "Throughout day" },
                { icon: <Salad className="w-5 h-5" />, name: "Poha with Peanuts", benefit: "Carbs + protein", timing: "2 hrs before" },
            ],
            // Option 2
            [
                { icon: <Egg className="w-5 h-5" />, name: "Egg Bhurji + Roti", benefit: "Protein + carbs", timing: "2 hrs before" },
                { icon: <Apple className="w-5 h-5" />, name: "Chikoo", benefit: "Natural sugars", timing: "45 min before" },
                { icon: <Beef className="w-5 h-5" />, name: "Chicken Sandwich", benefit: "Lean protein + carbs", timing: "2-3 hrs before" },
                { icon: <Droplets className="w-5 h-5" />, name: "Coconut Water", benefit: "Electrolyte prep", timing: "30 min before" },
            ],
            // Option 3
            [
                { icon: <Fish className="w-5 h-5" />, name: "Fish Cutlet", benefit: "Omega-3 + protein", timing: "2 hrs before" },
                { icon: <Salad className="w-5 h-5" />, name: "Dalia Upma", benefit: "Slow-release energy", timing: "2 hrs before" },
                { icon: <Apple className="w-5 h-5" />, name: "Dates + Almonds", benefit: "Quick energy", timing: "30 min before" },
                { icon: <Egg className="w-5 h-5" />, name: "Egg Dosa", benefit: "Protein + carbs", timing: "2 hrs before" },
            ],
        ],
        postRun: [
            // Option 1
            [
                { icon: <Egg className="w-5 h-5" />, name: "Egg Curry + Rice", benefit: "Complete protein meal", timing: "Within 30 min" },
                { icon: <Beef className="w-5 h-5" />, name: "Chicken Tikka", benefit: "Lean protein repair", timing: "Recovery meal" },
                { icon: <Fish className="w-5 h-5" />, name: "Fish Fry", benefit: "Omega-3 + protein", timing: "Within 2 hrs" },
                { icon: <Utensils className="w-5 h-5" />, name: "Chicken Biryani", benefit: "Carbs + protein combo", timing: "Recovery meal" },
            ],
            // Option 2
            [
                { icon: <Beef className="w-5 h-5" />, name: "Butter Chicken", benefit: "High protein + fats", timing: "Recovery meal" },
                { icon: <Fish className="w-5 h-5" />, name: "Fish Curry + Rice", benefit: "Omega-3 recovery", timing: "Within 30 min" },
                { icon: <Egg className="w-5 h-5" />, name: "Anda Bhurji + Pav", benefit: "Quick protein fix", timing: "Within 30 min" },
                { icon: <Beef className="w-5 h-5" />, name: "Tandoori Chicken", benefit: "Lean grilled protein", timing: "Within 2 hrs" },
            ],
            // Option 3
            [
                { icon: <Beef className="w-5 h-5" />, name: "Mutton Keema", benefit: "Iron + zinc rich", timing: "Recovery meal" },
                { icon: <Fish className="w-5 h-5" />, name: "Pomfret Fry", benefit: "Light fish protein", timing: "Within 2 hrs" },
                { icon: <Egg className="w-5 h-5" />, name: "Omelette + Paratha", benefit: "Protein + carbs", timing: "Within 30 min" },
                { icon: <Beef className="w-5 h-5" />, name: "Chicken Shorba", benefit: "Hydration + protein", timing: "Any time" },
            ],
        ]
    }
};



// Supplements data
const supplements = [
    { 
        icon: <Fish className="w-6 h-6" />, 
        name: "Omega-3", 
        benefit: "Reduces inflammation & joint pain",
        dosage: "1-3g daily",
        color: "text-blue-500/90",
        bg: "bg-blue-500/5",
        border: "border-blue-500/20"
    },
    { 
        icon: <Bone className="w-6 h-6" />, 
        name: "Magnesium", 
        benefit: "Muscle relaxation & cramp prevention",
        dosage: "200-400mg before bed",
        color: "text-purple-500/90",
        bg: "bg-purple-500/5",
        border: "border-purple-500/20"
    },
    { 
        icon: <Sun className="w-6 h-6" />, 
        name: "Vitamin D3", 
        benefit: "Bone health & immune support",
        dosage: "2000-5000 IU daily",
        color: "text-amber-500/90",
        bg: "bg-amber-500/5",
        border: "border-amber-500/20"
    },
    { 
        icon: <ZapIcon className="w-6 h-6" />, 
        name: "BCAAs", 
        benefit: "Muscle recovery & protein synthesis",
        dosage: "5-10g post-workout",
        color: "text-emerald-500/90",
        bg: "bg-emerald-500/5",
        border: "border-emerald-500/20"
    },
    { 
        icon: <Droplets className="w-6 h-6" />, 
        name: "Electrolytes", 
        benefit: "Hydration & nerve function",
        dosage: "During & after runs",
        color: "text-cyan-500/90",
        bg: "bg-cyan-500/5",
        border: "border-cyan-500/20"
    },
    { 
        icon: <Bone className="w-6 h-6" />, 
        name: "Collagen", 
        benefit: "Joint & tendon repair",
        dosage: "10-15g daily",
        color: "text-rose-500/90",
        bg: "bg-rose-500/5",
        border: "border-rose-500/20"
    },
];

// Muscle recovery exercises with demonstration images and videos
const muscleExercises = [
    {
        muscle: "Quadriceps",
        icon: "🦵",
        color: "from-zinc-800 to-orange-900/30",
        exercises: [
            { 
                name: "Foam Rolling", 
                duration: "2-3 min per leg", 
                description: "Roll from hip to knee, pausing on tight spots",
                images: {
                    male: "/exercises/male/quad_foam_roll.png",
                    female: "/exercises/female/quad_foam_roll.png"
                },
                video: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4", // Sample placeholder
                steps: ["Position roller under thigh", "Roll slowly from hip to knee", "Pause 20-30 sec on tender areas", "Repeat 8-10 passes"]
            },
            { 
                name: "Standing Quad Stretch", 
                duration: "30 sec each", 
                description: "Pull heel to glute, keep knees together",
                images: {
                    male: "/exercises/male/quad_stretch.png",
                    female: "/exercises/female/quad_stretch.png"
                },
                video: "",
                steps: ["Stand on one leg near wall", "Grab ankle behind you", "Pull heel toward glute", "Keep knees close together"]
            },
            { 
                name: "Couch Stretch", 
                duration: "60 sec each", 
                description: "Deep hip flexor and quad release",
                images: {
                    male: "/exercises/male/couch_stretch.png",
                    female: "/exercises/female/couch_stretch.png"
                },
                video: "",
                steps: ["Kneel facing away from wall", "Place back foot against wall", "Front leg at 90 degrees", "Lean back into stretch"]
            },
        ]
    },
    {
        muscle: "Hamstrings",
        icon: "🦿",
        color: "from-zinc-800 to-amber-900/30",
        exercises: [
            { 
                name: "Seated Forward Fold", 
                duration: "60 sec hold", 
                description: "Hinge at hips, reach for toes",
                images: {
                    male: "/exercises/male/forward_fold.png",
                    female: "/exercises/female/forward_fold.png"
                },
                video: "",
                steps: ["Sit with legs extended", "Inhale, lengthen spine", "Exhale, fold from hips", "Reach for feet or shins"]
            },
            { 
                name: "Single Leg Deadlift", 
                duration: "10 reps each", 
                description: "Eccentric loading for strength",
                images: {
                    male: "/exercises/male/single_leg_deadlift.png",
                    female: "/exercises/female/single_leg_deadlift.png"
                },
                video: "",
                steps: ["Stand on one leg", "Hinge forward at hips", "Extend back leg behind", "Return to standing slowly"]
            },
            { 
                name: "Supine Hamstring Stretch", 
                duration: "30 sec each", 
                description: "Use strap or towel for deeper stretch",
                images: {
                    male: "/exercises/male/supine_stretch.png",
                    female: "/exercises/female/supine_stretch.png"
                },
                video: "",
                steps: ["Lie on back", "Raise one leg up", "Use strap around foot", "Gently pull leg toward you"]
            },
        ]
    },
    {
        muscle: "Calves",
        icon: "🦶",
        color: "from-zinc-800 to-emerald-900/30",
        exercises: [
            { 
                name: "Eccentric Calf Raises", 
                duration: "15 reps x 3", 
                description: "Slow 3-second lowering phase",
                images: {
                    male: "/exercises/male/calf_raise.png",
                    female: "/exercises/female/calf_raise.png"
                },
                video: "",
                steps: ["Stand on edge of step", "Rise up on toes", "Lower heels slowly (3 sec)", "Feel stretch at bottom"]
            },
            { 
                name: "Wall Calf Stretch", 
                duration: "30 sec each", 
                description: "Both straight and bent knee variations",
                images: {
                    male: "/exercises/male/wall_calf_stretch.png",
                    female: "/exercises/female/wall_calf_stretch.png"
                },
                video: "",
                steps: ["Face wall, hands on wall", "Step one foot back", "Keep back heel down", "Lean into wall"]
            },
            { 
                name: "Tennis Ball Massage", 
                duration: "2 min per foot", 
                description: "Roll under arch and heel",
                images: {
                    male: "/exercises/male/tennis_ball_roll.png",
                    female: "/exercises/female/tennis_ball_roll.png"
                },
                video: "",
                steps: ["Stand on tennis ball", "Roll under arch", "Apply pressure to sore spots", "Move to heel and toes"]
            },
        ]
    },
    {
        muscle: "Hip Flexors",
        icon: "🏃",
        color: "from-zinc-800 to-teal-900/30",
        exercises: [
            { 
                name: "90/90 Hip Stretch", 
                duration: "60 sec each", 
                description: "External and internal rotation work",
                images: {
                    male: "/exercises/male/hip_90_90.png",
                    female: "/exercises/female/hip_90_90.png"
                },
                video: "",
                steps: ["Sit with legs in 90-90 position", "Front leg bent 90 degrees out", "Back leg bent 90 degrees in", "Rotate torso over front leg"]
            },
            { 
                name: "Half Kneeling Stretch", 
                duration: "30 sec each", 
                description: "Squeeze glute, tuck pelvis slightly",
                images: {
                    male: "/exercises/male/kneeling_hip.png",
                    female: "/exercises/female/kneeling_hip.png"
                },
                video: "",
                steps: ["Kneel on one knee", "Front foot flat on floor", "Squeeze back glute", "Shift weight forward slightly"]
            },
            { 
                name: "Leg Swings", 
                duration: "20 each direction", 
                description: "Dynamic mobility for warm-up/cooldown",
                images: {
                    male: "/exercises/male/leg_swings.png",
                    female: "/exercises/female/leg_swings.png"
                },
                video: "",
                steps: ["Stand beside wall for balance", "Swing leg forward and back", "Keep core engaged", "Increase range gradually"]
            },
        ]
    },
    {
        muscle: "IT Band",
        icon: "➰",
        color: "from-zinc-800 to-cyan-900/30",
        exercises: [
            { 
                name: "Foam Roll IT Band", 
                duration: "2 min per side", 
                description: "Roll from hip to just above knee",
                images: {
                    male: "/exercises/male/it_band_roll.png",
                    female: "/exercises/female/it_band_roll.png"
                },
                video: "",
                steps: ["Lie on side on roller", "Position at outer thigh", "Roll from hip to knee", "Pause on tight spots"]
            },
            { 
                name: "Pigeon Pose", 
                duration: "60 sec each", 
                description: "Opens hip and releases tension",
                images: {
                    male: "/exercises/male/pigeon_pose.png",
                    female: "/exercises/female/pigeon_pose.png"
                },
                video: "",
                steps: ["Start in downward dog", "Bring knee behind wrist", "Extend back leg straight", "Fold forward over front leg"]
            },
            { 
                name: "Side-Lying Leg Raises", 
                duration: "15 reps x 3", 
                description: "Strengthen hip abductors",
                images: {
                    male: "/exercises/male/side_leg_raise.png",
                    female: "/exercises/female/side_leg_raise.png"
                },
                video: "",
                steps: ["Lie on side, legs stacked", "Lift top leg 45 degrees", "Keep hips stacked", "Lower with control"]
            },
        ]
    },
    {
        muscle: "Lower Back",
        icon: "🔙",
        color: "from-zinc-800 to-blue-900/30",
        exercises: [
            { 
                name: "Cat-Cow Stretch", 
                duration: "10 cycles", 
                description: "Gentle spinal mobility",
                images: {
                    male: "/exercises/male/cat_cow.png",
                    female: "/exercises/female/cat_cow.png"
                },
                video: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", // Sample placeholder
                steps: ["Start on hands and knees", "Inhale, arch back (cow)", "Exhale, round spine (cat)", "Move slowly with breath"]
            },
            { 
                name: "Child's Pose", 
                duration: "60 sec hold", 
                description: "Decompresses spine, stretches lats",
                images: {
                    male: "/exercises/male/child_pose.png",
                    female: "/exercises/female/child_pose.png"
                },
                video: "",
                steps: ["Kneel on floor", "Sit back on heels", "Reach arms forward", "Rest forehead on floor"]
            },
            { 
                name: "Dead Bug", 
                duration: "10 reps each side", 
                description: "Core stability for back support",
                images: {
                    male: "/exercises/male/dead_bug.png",
                    female: "/exercises/female/dead_bug.png"
                },
                video: "",
                steps: ["Lie on back, arms up", "Legs at 90 degrees", "Extend opposite arm/leg", "Keep lower back pressed down"]
            },
        ]
    },
];

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants: Variants = {
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

// Exercise Demonstration Modal Component
function ExerciseModal({ 
    exercise, 
    isOpen, 
    onClose,
    gender 
}: { 
    exercise: typeof muscleExercises[0]['exercises'][0] | null;
    isOpen: boolean;
    onClose: () => void;
    gender: 'male' | 'female';
}) {
    const [isPlaying, setIsPlaying] = useState(false);

    if (!exercise) return null;

    // Reset state when modal opens/closes
    if (!isOpen && isPlaying) setIsPlaying(false);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    onClick={() => {
                        onClose();
                        setIsPlaying(false);
                    }}
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-md" />
                    
                    {/* Modal Content */}
                    <motion.div
                        layout
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ 
                            scale: 1, 
                            opacity: 1, 
                            y: 0,
                            width: isPlaying ? "100%" : "100%",
                            maxWidth: isPlaying ? "1024px" : "42rem"
                        }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25, layout: { duration: 0.4 } }}
                        onClick={(e) => e.stopPropagation()}
                        className={`relative bg-zinc-900 rounded-3xl border border-white/10 overflow-hidden shadow-2xl shadow-emerald-500/10 ${isPlaying ? 'h-[80vh] flex flex-col' : ''}`}
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => {
                                onClose();
                                setIsPlaying(false);
                            }}
                            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Video / Image Section */}
                        <motion.div 
                            layout
                            className={`relative bg-black overflow-hidden ${isPlaying ? 'flex-1 h-full' : 'h-64 md:h-80 bg-gradient-to-b from-zinc-800 to-zinc-900'}`}
                        >
                            <AnimatePresence mode="wait">
                                {isPlaying && exercise.video ? (
                                    <motion.div
                                        key="video"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="w-full h-full flex items-center justify-center"
                                    >
                                        <video
                                            src={exercise.video}
                                            autoPlay
                                            controls
                                            loop
                                            className="w-full h-full object-contain"
                                        />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="image"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="w-full h-full relative"
                                    >
                                        <div className="absolute inset-0 bg-gradient-radial from-emerald-500/10 to-transparent" />
                                        <Image
                                            src={exercise.images[gender]}
                                            alt={exercise.name}
                                            fill
                                            className="object-contain p-4"
                                            priority
                                        />
                                        {/* Animated Glow */}
                                        <motion.div
                                            className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-zinc-900 to-transparent"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        {/* Content Section (Hidden when playing, or pushed down? User asked to "expand in the full box and showcase a video", so I assume details can be hidden or minimized) */}
                        {!isPlaying && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="p-6 space-y-6"
                            >
                                {/* Title & Duration */}
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-2xl font-bold text-white mb-2">{exercise.name}</h3>
                                        <p className="text-zinc-400">{exercise.description}</p>
                                    </div>
                                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                                        <Clock className="w-4 h-4 text-emerald-400" />
                                        <span className="text-emerald-400 font-mono font-medium">{exercise.duration}</span>
                                    </div>
                                </div>

                                {/* Step-by-Step Instructions */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-white font-semibold">
                                        <Info className="w-4 h-4 text-cyan-400" />
                                        <span>How to perform</span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {exercise.steps.map((step, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.1 }}
                                                className="flex items-start gap-3 p-3 bg-zinc-800/50 rounded-xl border border-white/5"
                                            >
                                                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-emerald-500/20 text-emerald-400 text-sm font-bold rounded-full">
                                                    {idx + 1}
                                                </span>
                                                <span className="text-zinc-300 text-sm">{step}</span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                {/* Start Button */}
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setIsPlaying(true)}
                                    className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                                >
                                    <Play className="w-5 h-5 fill-white" />
                                    Start Exercise
                                </motion.button>
                            </motion.div>
                        )}
                        
                        {/* Playing State Controls (Minimal overlay when video is playing to stop/close) */}
                        {isPlaying && (
                             <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute bottom-6 left-0 right-0 flex justify-center gap-4 z-20 pointer-events-none"
                             >
                                <button
                                    onClick={() => setIsPlaying(false)}
                                    className="pointer-events-auto px-6 py-3 bg-black/60 hover:bg-black/80 backdrop-blur-md rounded-xl text-white font-semibold border border-white/10 flex items-center gap-2 transition-all"
                                >
                                    <Info className="w-4 h-4" />
                                    View Details
                                </button>
                             </motion.div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// Expandable Exercise Card Component
function ExerciseCard({ muscle, gender }: { muscle: typeof muscleExercises[0], gender: 'male' | 'female' }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedExercise, setSelectedExercise] = useState<typeof muscle.exercises[0] | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleExerciseClick = (exercise: typeof muscle.exercises[0]) => {
        setSelectedExercise(exercise);
        setIsModalOpen(true);
    };

    return (
        <>
            {/* Exercise Modal */}
            <ExerciseModal
                exercise={selectedExercise}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                gender={gender}
            />

            <motion.div
                variants={itemVariants}
                className="relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/50 backdrop-blur-sm"
            >
                {/* Header */}
                <motion.button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full p-6 flex items-center justify-between text-left group"
                    whileHover={{ backgroundColor: "rgba(255,255,255,0.02)" }}
                >
                    <div className="flex items-center gap-4">
                        <motion.div 
                            className={`text-3xl p-3 rounded-xl bg-gradient-to-br ${muscle.color} bg-opacity-20`}
                            whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                            {muscle.icon}
                        </motion.div>
                        <div>
                            <h4 className="text-xl font-bold text-white">{muscle.muscle}</h4>
                            <p className="text-zinc-500 text-sm">{muscle.exercises.length} exercises</p>
                        </div>
                    </div>
                    <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-zinc-400"
                    >
                        <ChevronDown className="w-6 h-6" />
                    </motion.div>
                </motion.button>

                {/* Expandable Content */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden"
                        >
                            <div className="px-6 pb-6 space-y-4">
                                {muscle.exercises.map((exercise, idx) => (
                                    <motion.button
                                        key={idx}
                                        onClick={() => handleExerciseClick(exercise)}
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="w-full p-4 rounded-xl bg-zinc-800/50 border border-white/5 hover:border-emerald-500/30 hover:bg-zinc-800/80 transition-all text-left group cursor-pointer"
                                    >
                                        <div className="flex justify-between items-center">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h5 className="font-semibold text-white group-hover:text-emerald-400 transition-colors">{exercise.name}</h5>
                                                    <Play className="w-4 h-4 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </div>
                                                <p className="text-zinc-400 text-sm">{exercise.description}</p>
                                            </div>
                                            <span className="text-emerald-400 text-sm font-mono bg-emerald-500/10 px-2 py-1 rounded">
                                                {exercise.duration}
                                            </span>
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Gradient Line */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${muscle.color} opacity-50`} />
            </motion.div>
        </>
    );
}

export default function RecoverSection() {
    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

    const [nutritionType, setNutritionType] = useState<'veg' | 'nonVeg'>('veg');
    const [gender, setGender] = useState<'male' | 'female'>('male');
    const [preRunOption, setPreRunOption] = useState(0);
    const [postRunOption, setPostRunOption] = useState(0);

    return (
        <section id="recover-section" ref={sectionRef} className="py-20 bg-black relative overflow-hidden border-t border-white/10">
            {/* Dynamic Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_var(--tw-gradient-stops))] from-emerald-950/20 via-black to-black" />

            {/* Animated Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98112_1px,transparent_1px),linear-gradient(to_bottom,#10b98112_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

            {/* Floating Orbs */}
            <motion.div
                animate={{ 
                    y: [0, -20, 0],
                    opacity: [0.1, 0.2, 0.1]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-20 left-1/4 w-64 h-64 bg-emerald-900/10 rounded-full blur-[100px]"
            />
            <motion.div
                animate={{ 
                    y: [0, 20, 0],
                    opacity: [0.1, 0.3, 0.1]
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-40 right-1/4 w-96 h-96 bg-teal-900/10 rounded-full blur-[120px]"
            />

            <div className="container mx-auto px-6 relative z-10">
                {/* Section Header */}
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
                        className="inline-flex p-6 rounded-full bg-zinc-900/80 mb-8 ring-1 ring-white/10 shadow-[0_0_50px_rgba(16,185,129,0.2)] backdrop-blur-xl relative group cursor-pointer"
                    >
                        <motion.div
                            animate={{ opacity: [0.2, 0.5, 0.2] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 blur-xl group-hover:opacity-60"
                        />
                        <Heart className="w-12 h-12 text-emerald-400 fill-emerald-400/30 relative z-10" />
                    </motion.div>

                    <h2 className="font-exo2 text-5xl md:text-7xl font-black text-white mb-6 tracking-wider">
                        RECOVER <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">STRONGER</span>
                    </h2>

                    <p className="text-zinc-400 max-w-2xl mx-auto text-xl">
                        Optimize your recovery with the right nutrition, supplements, and targeted exercises.
                    </p>
                </motion.div>

                {/* Muscle Recovery Exercises */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-20"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-xl bg-orange-500/5">
                                <Dumbbell className="w-6 h-6 text-orange-500/90" />
                            </div>
                            <h3 className="text-3xl font-bold text-white">Muscle Recovery Exercises</h3>
                        </div>

                        {/* Gender Toggle */}
                        <div className="flex items-center gap-1 p-1 rounded-xl bg-zinc-900 border border-white/10">
                            <button
                                onClick={() => setGender('male')}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                                    gender === 'male' 
                                    ? 'bg-zinc-800 text-white shadow-lg' 
                                    : 'text-zinc-500 hover:text-zinc-300'
                                }`}
                            >
                                Male
                            </button>
                            <button
                                onClick={() => setGender('female')}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                                    gender === 'female' 
                                    ? 'bg-zinc-800 text-white shadow-lg' 
                                    : 'text-zinc-500 hover:text-zinc-300'
                                }`}
                            >
                                Female
                            </button>
                        </div>
                    </div>

                    <p className="text-zinc-400 mb-8 max-w-2xl">
                        Click on each muscle group to reveal targeted exercises for pain relief and recovery.
                    </p>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        {muscleExercises.map((muscle, idx) => (
                            <ExerciseCard key={idx} muscle={muscle} gender={gender} />
                        ))}
                    </motion.div>
                </motion.div>

                {/* Nutrition Section */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-20"
                >
                    <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-xl bg-emerald-500/5">
                                <Utensils className="w-6 h-6 text-emerald-500/90" />
                            </div>
                            <h3 className="text-3xl font-bold text-white">Nutrition Hub</h3>
                        </div>

                        {/* Veg/Non-Veg Toggle */}
                        <div className="flex bg-zinc-900 p-1 rounded-xl border border-white/10">
                            <button
                                onClick={() => setNutritionType('veg')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                    nutritionType === 'veg' 
                                        ? 'bg-emerald-500/10 text-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.1)]' 
                                        : 'text-zinc-500 hover:text-white'
                                }`}
                            >
                                <Leaf className="w-4 h-4 ml-2" />
                                Veg
                            </button>
                            <button
                                onClick={() => setNutritionType('nonVeg')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                    nutritionType === 'nonVeg' 
                                        ? 'bg-red-500/10 text-red-400 shadow-[0_0_20px_rgba(248,113,113,0.1)]' 
                                        : 'text-zinc-500 hover:text-white'
                                }`}
                            >
                                <Beef className="w-4 h-4 ml-2" />
                                Non-Veg
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Pre-Run */}
                        <motion.div
                            key={`pre-${nutritionType}-${preRunOption}`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                            className="p-6 rounded-2xl bg-zinc-900/50 border border-white/10 hover:border-emerald-500/20 transition-all"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl">⚡</span>
                                    <h4 className="text-xl font-bold text-emerald-500/90">Pre-Run Fuel</h4>
                                </div>
                                {/* Plan Selector */}
                                <div className="flex bg-zinc-800 p-0.5 rounded-lg border border-white/5">
                                    {[1, 2, 3].map((num) => (
                                        <button
                                            key={num}
                                            onClick={() => setPreRunOption(num - 1)}
                                            className={`w-8 h-8 rounded-md text-sm font-bold transition-all ${
                                                preRunOption === num - 1
                                                    ? 'bg-emerald-500/20 text-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.2)]'
                                                    : 'text-zinc-500 hover:text-white'
                                            }`}
                                        >
                                            {num}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-4">
                                {nutritionData[nutritionType].preRun[preRunOption].map((item, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="flex items-center gap-4 p-3 rounded-xl bg-zinc-800/50 hover:bg-zinc-800 transition-colors group"
                                    >
                                        <div className="p-2 rounded-lg bg-emerald-500/5 text-emerald-500/90 group-hover:bg-emerald-500/10 transition-colors">
                                            {item.icon}
                                        </div>
                                        <div className="flex-1">
                                            <h5 className="font-semibold text-white">{item.name}</h5>
                                            <p className="text-zinc-500 text-sm">{item.benefit}</p>
                                        </div>
                                        <span className="text-xs text-emerald-500/70 font-mono">{item.timing}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Post-Run */}
                        <motion.div
                            key={`post-${nutritionType}-${postRunOption}`}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                            className="p-6 rounded-2xl bg-zinc-900/50 border border-white/10 hover:border-teal-500/20 transition-all"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl">🔄</span>
                                    <h4 className="text-xl font-bold text-teal-500/90">Post-Run Recovery</h4>
                                </div>
                                {/* Plan Selector */}
                                <div className="flex bg-zinc-800 p-0.5 rounded-lg border border-white/5">
                                    {[1, 2, 3].map((num) => (
                                        <button
                                            key={num}
                                            onClick={() => setPostRunOption(num - 1)}
                                            className={`w-8 h-8 rounded-md text-sm font-bold transition-all ${
                                                postRunOption === num - 1
                                                    ? 'bg-teal-500/20 text-teal-400 shadow-[0_0_10px_rgba(94,234,212,0.2)]'
                                                    : 'text-zinc-500 hover:text-white'
                                            }`}
                                        >
                                            {num}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-4">
                                {nutritionData[nutritionType].postRun[postRunOption].map((item, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="flex items-center gap-4 p-3 rounded-xl bg-zinc-800/50 hover:bg-zinc-800 transition-colors group"
                                    >
                                        <div className="p-2 rounded-lg bg-teal-500/5 text-teal-500/90 group-hover:bg-teal-500/10 transition-colors">
                                            {item.icon}
                                        </div>
                                        <div className="flex-1">
                                            <h5 className="font-semibold text-white">{item.name}</h5>
                                            <p className="text-zinc-500 text-sm">{item.benefit}</p>
                                        </div>
                                        <span className="text-xs text-teal-500/70 font-mono">{item.timing}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Supplements Section */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 rounded-xl bg-purple-500/5">
                            <Pill className="w-6 h-6 text-purple-500/90" />
                        </div>
                        <h3 className="text-3xl font-bold text-white">Supplements Guide</h3>
                    </div>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        {supplements.map((supp, idx) => (
                            <motion.div
                                key={idx}
                                variants={itemVariants}
                                whileHover={{ y: -8, scale: 1.02 }}
                                className={`p-6 rounded-2xl bg-zinc-900/50 border ${supp.border} transition-all duration-300 group cursor-pointer`}
                            >
                                <div className={`p-3 rounded-xl ${supp.bg} ${supp.color} w-fit mb-4 group-hover:scale-110 transition-transform`}>
                                    {supp.icon}
                                </div>
                                <h4 className={`text-xl font-bold ${supp.color} mb-2`}>{supp.name}</h4>
                                <p className="text-zinc-400 text-sm mb-4">{supp.benefit}</p>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-zinc-500">Dosage:</span>
                                    <span className={`text-xs font-mono ${supp.color} bg-zinc-800 px-2 py-1 rounded`}>
                                        {supp.dosage}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
