"use client";

import { useEffect } from "react";
import { motion } from "motion/react";
import { Users, MapPin, ExternalLink, UserPlus, Info, Check } from "lucide-react";
import { GradientButton } from "@/components/ui/gradient-button";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { clubs } from "@/components/dashboard/club/data";

export default function ClubPage() {
    const router = useRouter();
    const [joinedClubs, setJoinedClubs] = useState<number[]>([]);

    useEffect(() => {
        // Auto-redirect if already joined a club
        const joinedId = localStorage.getItem('joinedClubId');
        if (joinedId) {
            router.push(`/dashboard/club/${joinedId}`);
        }
    }, [router]);

    const handleJoin = (id: number, name: string) => {
        if (joinedClubs.includes(id)) {
            toast.info(`You are already a member of ${name}`);
            return;
        }
        
        toast.promise(new Promise(resolve => setTimeout(resolve, 1000)), {
            loading: 'Sending join request...',
            success: () => {
                setJoinedClubs([...joinedClubs, id]);
                // Persist joined state
                localStorage.setItem('joinedClubId', id.toString());
                // Redirect to club details page after joining
                setTimeout(() => {
                    router.push(`/dashboard/club/${id}`);
                }, 1500);
                return `Welcome to ${name}! Redirecting...`;
            },
            error: 'Failed to join club',
        });
    };

    const handleInfo = (id: number) => {
        router.push(`/dashboard/club/${id}`);
    };

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-bold text-white mb-2 font-exo2 tracking-wide">
                    Run Clubs
                </h1>
                <p className="text-zinc-400">
                    Discover local communities and find your running squad.
                </p>
            </div>

            {/* Clubs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clubs.map((club, i) => (
                    <motion.div
                        key={club.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`group relative p-6 rounded-3xl border ${club.border} ${club.bg} backdrop-blur-sm overflow-hidden hover:bg-zinc-900/80 transition-all duration-300`}
                    >
                        {/* Background Glow */}
                        <div className={`absolute top-0 right-0 w-32 h-32 ${club.bg.replace('/10', '/30')} rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                        <div className="relative z-10 flex flex-col h-full">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-xl bg-black/20 ${club.color}`}>
                                    <Users className="w-6 h-6" />
                                </div>
                                <div className="px-3 py-1 rounded-full bg-black/20 text-xs font-medium text-white/70">
                                    {club.members.toLocaleString()} Members
                                </div>
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-white/90 transition-colors">
                                {club.name}
                            </h3>
                            
                            <div className="flex items-center gap-2 text-zinc-400 text-sm mb-6">
                                <MapPin className="w-4 h-4" />
                                {club.location}
                            </div>

                            <div className="flex flex-wrap gap-2 mb-8">
                                {club.tags.map(tag => (
                                    <span key={tag} className="px-2 py-1 rounded-md bg-white/5 border border-white/5 text-xs text-zinc-300">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <div className="mt-auto grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => handleInfo(club.id)}
                                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-sm font-medium transition-colors flex items-center justify-center gap-2"
                                >
                                    <Info className="w-4 h-4" />
                                    Details
                                </button>
                                <button
                                    onClick={() => handleJoin(club.id, club.name)}
                                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                                        joinedClubs.includes(club.id)
                                            ? "bg-green-500/20 text-green-400 border border-green-500/20 cursor-default"
                                            : "bg-white text-black hover:scale-105"
                                    }`}
                                >
                                    {joinedClubs.includes(club.id) ? (
                                        <>
                                            <Check className="w-4 h-4" />
                                            Joined
                                        </>
                                    ) : (
                                        <>
                                            <UserPlus className="w-4 h-4" />
                                            Join
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
