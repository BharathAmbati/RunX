"use client";

import { motion, useScroll, useTransform, Variants, AnimatePresence } from "motion/react";
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
    Beef
} from "lucide-react";
import { useRef, useState } from "react";

// Pre-run and Post-run nutrition data with 3 meal plan options
const nutritionData = {
    veg: {
        preRun: [
            // Option 1
            [
                { icon: <Apple className="w-5 h-5" />, name: "Banana", benefit: "Quick energy + potassium", timing: "30 min before" },
                { icon: <Coffee className="w-5 h-5" />, name: "Oatmeal", benefit: "Sustained energy release", timing: "2-3 hrs before" },
                { icon: <Droplets className="w-5 h-5" />, name: "Water", benefit: "Optimal hydration", timing: "Throughout day" },
                { icon: <Salad className="w-5 h-5" />, name: "Toast + PB", benefit: "Fast-acting carbs + protein", timing: "1 hr before" },
            ],
            // Option 2
            [
                { icon: <Apple className="w-5 h-5" />, name: "Apple Slices", benefit: "Natural sugars + fiber", timing: "45 min before" },
                { icon: <Salad className="w-5 h-5" />, name: "Smoothie Bowl", benefit: "Blended nutrients", timing: "1.5 hrs before" },
                { icon: <Leaf className="w-5 h-5" />, name: "Rice Cakes", benefit: "Light carbs", timing: "30 min before" },
                { icon: <Droplets className="w-5 h-5" />, name: "Coconut Water", benefit: "Natural electrolytes", timing: "Throughout day" },
            ],
            // Option 3
            [
                { icon: <Salad className="w-5 h-5" />, name: "Overnight Oats", benefit: "Slow-release energy", timing: "2 hrs before" },
                { icon: <Apple className="w-5 h-5" />, name: "Dates", benefit: "Natural energy boost", timing: "30 min before" },
                { icon: <Leaf className="w-5 h-5" />, name: "Chia Pudding", benefit: "Omega-3 + fiber", timing: "1 hr before" },
                { icon: <Droplets className="w-5 h-5" />, name: "Green Tea", benefit: "Gentle caffeine", timing: "1 hr before" },
            ],
        ],
        postRun: [
            // Option 1
            [
                { icon: <Salad className="w-5 h-5" />, name: "Chickpeas", benefit: "Plant protein + fiber", timing: "Within 30 min" },
                { icon: <Leaf className="w-5 h-5" />, name: "Tofu Scramble", benefit: "Complete plant protein", timing: "Recovery meal" },
                { icon: <Leaf className="w-5 h-5" />, name: "Quinoa Bowl", benefit: "Complex carbs + amino acids", timing: "Within 2 hrs" },
                { icon: <Utensils className="w-5 h-5" />, name: "Lentil Soup", benefit: "Iron + protein repair", timing: "Any time" },
            ],
            // Option 2
            [
                { icon: <Salad className="w-5 h-5" />, name: "Hummus + Pita", benefit: "Protein + carbs combo", timing: "Within 30 min" },
                { icon: <Leaf className="w-5 h-5" />, name: "Tempeh Stir-fry", benefit: "Fermented protein", timing: "Recovery meal" },
                { icon: <Utensils className="w-5 h-5" />, name: "Black Bean Tacos", benefit: "Fiber + protein", timing: "Within 2 hrs" },
                { icon: <Apple className="w-5 h-5" />, name: "Banana Smoothie", benefit: "Quick recovery shake", timing: "Within 30 min" },
            ],
            // Option 3
            [
                { icon: <Leaf className="w-5 h-5" />, name: "Edamame", benefit: "Complete soy protein", timing: "Within 30 min" },
                { icon: <Salad className="w-5 h-5" />, name: "Buddha Bowl", benefit: "Balanced macro meal", timing: "Recovery meal" },
                { icon: <Utensils className="w-5 h-5" />, name: "Paneer Curry", benefit: "High protein + calcium", timing: "Within 2 hrs" },
                { icon: <Leaf className="w-5 h-5" />, name: "Greek Yogurt Parfait", benefit: "Probiotics + protein", timing: "Any time" },
            ],
        ]
    },
    nonVeg: {
        preRun: [
            // Option 1
            [
                { icon: <Apple className="w-5 h-5" />, name: "Banana", benefit: "Quick energy + potassium", timing: "30 min before" },
                { icon: <Coffee className="w-5 h-5" />, name: "Oatmeal", benefit: "Sustained energy release", timing: "2-3 hrs before" },
                { icon: <Egg className="w-5 h-5" />, name: "Boiled Egg", benefit: "High protein start", timing: "2 hrs before" },
                { icon: <Beef className="w-5 h-5" />, name: "Turkey Slice", benefit: "Lean protein boost", timing: "1 hr before" },
            ],
            // Option 2
            [
                { icon: <Egg className="w-5 h-5" />, name: "Egg White Omelette", benefit: "Pure protein", timing: "2 hrs before" },
                { icon: <Apple className="w-5 h-5" />, name: "Apple + Almond Butter", benefit: "Carbs + healthy fats", timing: "1 hr before" },
                { icon: <Beef className="w-5 h-5" />, name: "Chicken Wrap", benefit: "Protein + carbs", timing: "2-3 hrs before" },
                { icon: <Droplets className="w-5 h-5" />, name: "Sports Drink", benefit: "Electrolyte prep", timing: "30 min before" },
            ],
            // Option 3
            [
                { icon: <Fish className="w-5 h-5" />, name: "Tuna on Toast", benefit: "Lean protein + carbs", timing: "2 hrs before" },
                { icon: <Coffee className="w-5 h-5" />, name: "Greek Yogurt", benefit: "Protein + probiotics", timing: "1.5 hrs before" },
                { icon: <Apple className="w-5 h-5" />, name: "Energy Bar", benefit: "Convenient fuel", timing: "45 min before" },
                { icon: <Droplets className="w-5 h-5" />, name: "Bone Broth", benefit: "Minerals + collagen", timing: "1 hr before" },
            ],
        ],
        postRun: [
            // Option 1
            [
                { icon: <Egg className="w-5 h-5" />, name: "Eggs", benefit: "Complete protein repair", timing: "Within 30 min" },
                { icon: <Fish className="w-5 h-5" />, name: "Salmon", benefit: "Omega-3 anti-inflammatory", timing: "Recovery meal" },
                { icon: <Beef className="w-5 h-5" />, name: "Grilled Chicken", benefit: "Lean muscle rebuilding", timing: "Within 2 hrs" },
                { icon: <Beef className="w-5 h-5" />, name: "Lean Beef", benefit: "Iron + protein synthesis", timing: "Recovery meal" },
            ],
            // Option 2
            [
                { icon: <Fish className="w-5 h-5" />, name: "Tuna Steak", benefit: "High protein + B12", timing: "Within 30 min" },
                { icon: <Beef className="w-5 h-5" />, name: "Turkey Breast", benefit: "Low-fat protein", timing: "Recovery meal" },
                { icon: <Egg className="w-5 h-5" />, name: "Protein Shake", benefit: "Fast absorption", timing: "Within 30 min" },
                { icon: <Fish className="w-5 h-5" />, name: "Shrimp Stir-fry", benefit: "Lean seafood protein", timing: "Within 2 hrs" },
            ],
            // Option 3
            [
                { icon: <Beef className="w-5 h-5" />, name: "Lamb Chops", benefit: "Iron + zinc rich", timing: "Recovery meal" },
                { icon: <Fish className="w-5 h-5" />, name: "Mackerel", benefit: "Omega-3 powerhouse", timing: "Within 2 hrs" },
                { icon: <Egg className="w-5 h-5" />, name: "Scrambled Eggs", benefit: "Quick protein fix", timing: "Within 30 min" },
                { icon: <Beef className="w-5 h-5" />, name: "Chicken Soup", benefit: "Hydration + protein", timing: "Any time" },
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

// Muscle recovery exercises
const muscleExercises = [
    {
        muscle: "Quadriceps",
        icon: "🦵",
        color: "from-zinc-800 to-orange-900/30",
        exercises: [
            { name: "Foam Rolling", duration: "2-3 min per leg", description: "Roll from hip to knee, pausing on tight spots" },
            { name: "Standing Quad Stretch", duration: "30 sec each", description: "Pull heel to glute, keep knees together" },
            { name: "Couch Stretch", duration: "60 sec each", description: "Deep hip flexor and quad release" },
        ]
    },
    {
        muscle: "Hamstrings",
        icon: "🦿",
        color: "from-zinc-800 to-amber-900/30",
        exercises: [
            { name: "Seated Forward Fold", duration: "60 sec hold", description: "Hinge at hips, reach for toes" },
            { name: "Single Leg Deadlift", duration: "10 reps each", description: "Eccentric loading for strength" },
            { name: "Supine Hamstring Stretch", duration: "30 sec each", description: "Use strap or towel for deeper stretch" },
        ]
    },
    {
        muscle: "Calves",
        icon: "🦶",
        color: "from-zinc-800 to-emerald-900/30",
        exercises: [
            { name: "Eccentric Calf Raises", duration: "15 reps x 3", description: "Slow 3-second lowering phase" },
            { name: "Wall Calf Stretch", duration: "30 sec each", description: "Both straight and bent knee variations" },
            { name: "Tennis Ball Massage", duration: "2 min per foot", description: "Roll under arch and heel" },
        ]
    },
    {
        muscle: "Hip Flexors",
        icon: "🏃",
        color: "from-zinc-800 to-teal-900/30",
        exercises: [
            { name: "90/90 Hip Stretch", duration: "60 sec each", description: "External and internal rotation work" },
            { name: "Half Kneeling Stretch", duration: "30 sec each", description: "Squeeze glute, tuck pelvis slightly" },
            { name: "Leg Swings", duration: "20 each direction", description: "Dynamic mobility for warm-up/cooldown" },
        ]
    },
    {
        muscle: "IT Band",
        icon: "➰",
        color: "from-zinc-800 to-cyan-900/30",
        exercises: [
            { name: "Foam Roll IT Band", duration: "2 min per side", description: "Roll from hip to just above knee" },
            { name: "Pigeon Pose", duration: "60 sec each", description: "Opens hip and releases tension" },
            { name: "Side-Lying Leg Raises", duration: "15 reps x 3", description: "Strengthen hip abductors" },
        ]
    },
    {
        muscle: "Lower Back",
        icon: "🔙",
        color: "from-zinc-800 to-blue-900/30",
        exercises: [
            { name: "Cat-Cow Stretch", duration: "10 cycles", description: "Gentle spinal mobility" },
            { name: "Child's Pose", duration: "60 sec hold", description: "Decompresses spine, stretches lats" },
            { name: "Dead Bug", duration: "10 reps each side", description: "Core stability for back support" },
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

// Expandable Exercise Card Component
function ExerciseCard({ muscle }: { muscle: typeof muscleExercises[0] }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
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
                                <motion.div
                                    key={idx}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="p-4 rounded-xl bg-zinc-800/50 border border-white/5 hover:border-emerald-500/30 transition-colors"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h5 className="font-semibold text-white">{exercise.name}</h5>
                                        <span className="text-emerald-400 text-sm font-mono bg-emerald-500/10 px-2 py-1 rounded">
                                            {exercise.duration}
                                        </span>
                                    </div>
                                    <p className="text-zinc-400 text-sm">{exercise.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Gradient Line */}
            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${muscle.color} opacity-50`} />
        </motion.div>
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
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 rounded-xl bg-orange-500/5">
                            <Dumbbell className="w-6 h-6 text-orange-500/90" />
                        </div>
                        <h3 className="text-3xl font-bold text-white">Muscle Recovery Exercises</h3>
                    </div>

                    <p className="text-zinc-400 mb-8 max-w-2xl">
                        Click on each muscle group to reveal targeted exercises for pain relief and recovery.
                    </p>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        {muscleExercises.map((muscle, idx) => (
                            <ExerciseCard key={idx} muscle={muscle} />
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
