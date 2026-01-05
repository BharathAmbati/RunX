"use client";

import { useParams, useRouter } from "next/navigation";
import { motion } from "motion/react";
import { ArrowLeft, MapPin, Users, Calendar, Trophy, Share2, MessageSquare, Clock } from "lucide-react";
import { GradientButton } from "@/components/ui/gradient-button";
import { clubs } from "@/components/dashboard/club/data";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { ClubLeaderboard } from "@/components/dashboard/club/ClubLeaderboard";

export default function ClubDetailPage() {
    const params = useParams();
    const router = useRouter();
    // In a real app, this would be a server component or useQuery
    // For now, we safely handle the potentially missing ID
    const clubId = params?.id ? Number(params.id) : 0;
    const club = clubs.find(c => c.id === clubId);
    
    const [isJoined, setIsJoined] = useState(false);

    useEffect(() => {
        const joinedId = localStorage.getItem('joinedClubId');
        if (joinedId && Number(joinedId) === clubId) {
            setIsJoined(true);
        }
    }, [clubId]);

    if (!club) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
                <h1 className="text-2xl font-bold text-white">Club Not Found</h1>
                <button 
                    onClick={() => router.back()}
                    className="text-cyan-400 hover:underline"
                >
                    Go back to Clubs
                </button>
            </div>
        );
    }

    const handleJoin = () => {
        if (isJoined) {
            // Leave Logic
            setIsJoined(false);
            localStorage.removeItem('joinedClubId');
            toast.success("You have left the club.");
            router.push("/dashboard/club");
        } else {
             // Join Logic
            setIsJoined(true);
            localStorage.setItem('joinedClubId', clubId.toString());
            toast.success("Welcome to the club! Members info unlocked.");
        }
    };

    return (
        <div className="space-y-8 pb-20 max-w-5xl mx-auto">
            {/* Header / Hero */}
            <div className="relative rounded-[3rem] overflow-hidden bg-zinc-900 border border-white/5">
                {/* Background Art */}
                <div className={`absolute top-0 right-0 w-[500px] h-[500px] ${club.bg.replace('/10', '/20')} rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2`} />
                
                <div className="relative z-10 p-8 md:p-10 flex flex-col items-start justify-center">
                    {/* Back Button - In flow */}


                    <div className="space-y-4 w-full">
                        <div className="flex flex-wrap gap-2">
                            {club.tags.map(tag => (
                                <span key={tag} className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-sm font-medium text-white">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold text-white font-exo2 tracking-tight">
                            {club.name}
                        </h1>
                        <div className="flex items-center gap-6 text-zinc-300">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-zinc-500" />
                                {club.location}
                            </div>
                            <div className="flex items-center gap-2">
                                <Users className="w-5 h-5 text-zinc-500" />
                                {club.members.toLocaleString()} Members
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-4">
                <GradientButton 
                    variant={isJoined ? "purple" : "cyan"}
                    className="flex-1 md:flex-none min-w-[200px]"
                    onClick={handleJoin}
                >
                    {isJoined ? "Exit Club" : "Join Club"}
                </GradientButton>
                <button className="px-6 py-3 rounded-xl bg-zinc-800 border border-white/5 text-white hover:bg-zinc-700 transition-colors font-medium flex items-center gap-2">
                    <Share2 className="w-4 h-4" />
                    Share
                </button>
                <button className="px-6 py-3 rounded-xl bg-zinc-800 border border-white/5 text-white hover:bg-zinc-700 transition-colors font-medium flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Contact
                </button>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-8">
                    {/* About */}
                    <div className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5">
                        <h2 className="text-2xl font-bold text-white mb-4 font-exo2">About Us</h2>
                        <p className="text-zinc-400 leading-relaxed text-lg">
                            {club.description}
                        </p>
                    </div>

                    {/* Combined Leaderboard Section */}
                    <div id="leaderboard-section">
                         <ClubLeaderboard />
                    </div>

                    {/* Members Section (Unlocked when joined) - Keeping mock logic simple for now, can be removed if Leaderboard covers it */}
                    {isJoined && club.memberList && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5 overflow-hidden"
                        >
                            <h2 className="text-2xl font-bold text-white mb-6 font-exo2">Club Members</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {club.memberList.length > 0 ? club.memberList.map(member => (
                                    <div key={member.id} className="flex items-center gap-4 p-4 rounded-xl bg-black/20 border border-white/5">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                                            {member.avatar}
                                        </div>
                                        <div>
                                            <div className="font-medium text-white">{member.name}</div>
                                            <div className="text-xs text-zinc-500">{member.role}</div>
                                        </div>
                                    </div>
                                )) : (
                                    <p className="text-zinc-500 col-span-2">No members info available.</p>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* Stats Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5 text-center">
                            <div className={`w-10 h-10 mx-auto mb-3 rounded-full bg-black/30 flex items-center justify-center ${club.color}`}>
                                <Trophy className="w-5 h-5" />
                            </div>
                            <div className="text-2xl font-bold text-white mb-1">{club.stats.weeklyDistance}</div>
                            <div className="text-xs text-zinc-500 uppercase tracking-widest">{club.stats.totalLabel}</div>
                        </div>
                         <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5 text-center">
                            <div className={`w-10 h-10 mx-auto mb-3 rounded-full bg-black/30 flex items-center justify-center ${club.color}`}>
                                <Users className="w-5 h-5" />
                            </div>
                            <div className="text-2xl font-bold text-white mb-1">{club.stats.activeMembers}</div>
                            <div className="text-xs text-zinc-500 uppercase tracking-widest">Active this week</div>
                        </div>
                         <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/5 text-center">
                            <div className={`w-10 h-10 mx-auto mb-3 rounded-full bg-black/30 flex items-center justify-center ${club.color}`}>
                                <Calendar className="w-5 h-5" />
                            </div>
                            <div className="text-2xl font-bold text-white mb-1">24</div>
                            <div className="text-xs text-zinc-500 uppercase tracking-widest">Events hosted</div>
                        </div>
                    </div>

                    {/* Announcements */}
                    {club.announcements.length > 0 && (
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold text-white font-exo2">Announcements</h2>
                            {club.announcements.map(announcement => (
                                <div key={announcement.id} className="p-6 rounded-2xl bg-cyan-500/5 border border-cyan-500/10">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-cyan-400">{announcement.title}</h3>
                                        <span className="text-xs text-zinc-500">{announcement.date}</span>
                                    </div>
                                    <p className="text-zinc-400 text-sm">{announcement.content}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sidebar: Next Run */}
                <div className="space-y-8">
                    <div className="p-8 rounded-3xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 sticky top-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className={`p-2 rounded-lg bg-black/30 ${club.color}`}>
                                <Calendar className="w-5 h-5" />
                            </div>
                            <h3 className="text-xl font-bold text-white font-exo2">Next Event</h3>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="text-xs text-zinc-500 uppercase tracking-widest mb-1 block">Event Name</label>
                                <div className="text-xl font-bold text-white">{club.nextRun.title}</div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-zinc-500 uppercase tracking-widest mb-1 block">Date</label>
                                    <div className="font-mono text-white flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-zinc-500" />
                                        {club.nextRun.date}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-zinc-500 uppercase tracking-widest mb-1 block">Time</label>
                                    <div className="font-mono text-white flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-zinc-500" />
                                        {club.nextRun.time}
                                    </div>
                                </div>
                            </div>

                             <div>
                                <label className="text-xs text-zinc-500 uppercase tracking-widest mb-1 block">Distance</label>
                                <div className="text-lg font-bold text-white">{club.nextRun.distance}</div>
                            </div>

                            <div>
                                <label className="text-xs text-zinc-500 uppercase tracking-widest mb-1 block">Meeting Point</label>
                                <div className="text-zinc-300 flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-zinc-500" />
                                    {club.nextRun.location}
                                </div>
                            </div>

                            <button className="w-full py-4 rounded-xl bg-white text-black font-bold hover:bg-zinc-200 transition-colors">
                                RSVP Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
