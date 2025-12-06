"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { User, Mail, Camera, Save, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function ProfilePage() {
    const supabase = createClient();
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [loading, setLoading] = React.useState(true);
    const [saving, setSaving] = React.useState(false);
    const [uploading, setUploading] = React.useState(false);
    const [avatarUrl, setAvatarUrl] = React.useState<string | null>(null);
    const [user, setUser] = React.useState<{ email?: string; id?: string } | null>(null);
    const [profile, setProfile] = React.useState({
        username: "",
        full_name: "",
        website: "",
    });

    React.useEffect(() => {
        const fetchProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUser(user);
                const { data } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", user.id)
                    .single();
                if (data) {
                    setProfile({
                        username: data.username || "",
                        full_name: data.full_name || "",
                        website: data.website || "",
                    });
                    if (data.avatar_url) {
                        setAvatarUrl(data.avatar_url);
                    }
                }
            }
            setLoading(false);
        };
        fetchProfile();
    }, []);

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !user?.id) return;

        setUploading(true);

        try {
            // Create a unique file path
            const fileExt = file.name.split('.').pop();
            const filePath = `${user.id}/avatar.${fileExt}`;

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, { upsert: true });

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            // Update profile with new avatar URL
            await supabase
                .from('profiles')
                .update({ avatar_url: publicUrl, updated_at: new Date().toISOString() })
                .eq('id', user.id);

            setAvatarUrl(publicUrl);
        } catch (error) {
            console.error('Error uploading avatar:', error);
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async () => {
        if (!user?.id) return;
        setSaving(true);
        await supabase
            .from("profiles")
            .update({
                username: profile.username,
                full_name: profile.full_name,
                website: profile.website,
                updated_at: new Date().toISOString(),
            })
            .eq("id", user.id);
        setSaving(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full"
                />
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-2xl">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
            >
                <h1 className="text-3xl font-bold text-white mb-2 font-exo2">Profile</h1>
                <p className="text-zinc-400">Manage your personal information</p>
            </motion.div>

            {/* Avatar Section */}
            <motion.div
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15, type: "spring", stiffness: 80, damping: 15 }}
            >
                <Card className="bg-zinc-900/50 border-white/10 backdrop-blur-sm overflow-hidden">
                    <CardHeader>
                        <CardTitle className="text-white font-exo2">Avatar</CardTitle>
                        <CardDescription className="text-zinc-400">
                            Your profile picture
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center gap-6">
                        {/* Hidden file input */}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleAvatarUpload}
                            accept="image/*"
                            className="hidden"
                        />
                        <motion.div
                            onClick={handleAvatarClick}
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            whileTap={{ scale: 0.95 }}
                            animate={{ 
                                boxShadow: [
                                    "0 0 0px rgba(6,182,212,0)",
                                    "0 0 20px rgba(6,182,212,0.4)",
                                    "0 0 0px rgba(6,182,212,0)"
                                ]
                            }}
                            transition={{ 
                                boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                                scale: { type: "spring", stiffness: 300 }
                            }}
                            className="relative w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border-2 border-cyan-500/30 flex items-center justify-center cursor-pointer group overflow-hidden"
                        >
                            {uploading ? (
                                <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
                            ) : avatarUrl ? (
                                <Image
                                    src={avatarUrl}
                                    alt="Avatar"
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <>
                                    <motion.div
                                        animate={{ rotate: [0, 360] }}
                                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                        className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-500/50"
                                    />
                                    <User className="w-8 h-8 text-cyan-400" />
                                </>
                            )}
                            <motion.div 
                                initial={{ opacity: 0 }}
                                whileHover={{ opacity: 1 }}
                                className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center"
                            >
                                <Camera className="w-5 h-5 text-white" />
                            </motion.div>
                        </motion.div>
                        <div className="flex-1">
                            <p className="text-sm text-zinc-400 mb-2">
                                Click to upload a new avatar
                            </p>
                            <p className="text-xs text-zinc-500">
                                Recommended: Square image, at least 200x200px
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Personal Info */}
            <motion.div
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 80, damping: 15 }}
            >
                <Card className="bg-zinc-900/50 border-white/10 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-white font-exo2">Personal Information</CardTitle>
                        <CardDescription className="text-zinc-400">
                            Update your profile details
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <motion.div 
                            className="space-y-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            <label className="text-sm font-medium text-zinc-300">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                <Input
                                    value={user?.email || ""}
                                    disabled
                                    className="pl-10 bg-zinc-800/50 border-white/10 text-zinc-400"
                                />
                            </div>
                            <p className="text-xs text-zinc-500">Email cannot be changed</p>
                        </motion.div>

                        <Separator className="bg-white/10" />

                        <motion.div 
                            className="space-y-2"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <label className="text-sm font-medium text-zinc-300">Username</label>
                            <Input
                                value={profile.username}
                                onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                                placeholder="Enter your username"
                                className="bg-zinc-800/50 border-white/10 text-white placeholder:text-zinc-500 focus:border-cyan-500/50 focus:ring-cyan-500/20"
                            />
                        </motion.div>

                        <motion.div 
                            className="space-y-2"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <label className="text-sm font-medium text-zinc-300">Full Name</label>
                            <Input
                                value={profile.full_name}
                                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                                placeholder="Enter your full name"
                                className="bg-zinc-800/50 border-white/10 text-white placeholder:text-zinc-500 focus:border-cyan-500/50 focus:ring-cyan-500/20"
                            />
                        </motion.div>

                        <motion.div 
                            className="space-y-2"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                        >
                            <label className="text-sm font-medium text-zinc-300">Website</label>
                            <Input
                                value={profile.website}
                                onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                                placeholder="https://yourwebsite.com"
                                className="bg-zinc-800/50 border-white/10 text-white placeholder:text-zinc-500 focus:border-cyan-500/50 focus:ring-cyan-500/20"
                            />
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            whileHover={{ scale: 1.02, y: -2 }} 
                            whileTap={{ scale: 0.98 }}
                        >
                            <Button
                                onClick={handleSave}
                                disabled={saving}
                                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-shadow"
                            >
                                {saving ? (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                                    />
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Save Changes
                                    </>
                                )}
                            </Button>
                        </motion.div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
