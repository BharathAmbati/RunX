"use client";

import * as React from "react";
import { motion } from "motion/react";
import { Moon, Sun, Bell, Shield, Palette, Monitor, Smartphone, LogOut, Trash2, ChevronRight } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

interface SettingItemProps {
    icon: React.ElementType;
    title: string;
    description: string;
    action?: React.ReactNode;
    onClick?: () => void;
    danger?: boolean;
}

function SettingItem({ icon: Icon, title, description, action, onClick, danger }: SettingItemProps) {
    return (
        <motion.div
            whileHover={{ x: 4 }}
            onClick={onClick}
            className={`flex items-center gap-4 p-4 rounded-xl transition-colors ${
                onClick ? "cursor-pointer hover:bg-white/5" : ""
            } ${danger ? "hover:bg-red-500/10" : ""}`}
        >
            <div className={`p-2 rounded-lg ${danger ? "bg-red-500/10" : "bg-cyan-500/10"}`}>
                <Icon className={`w-5 h-5 ${danger ? "text-red-400" : "text-cyan-400"}`} />
            </div>
            <div className="flex-1 min-w-0">
                <div className={`font-medium ${danger ? "text-red-400" : "text-white"}`}>{title}</div>
                <div className="text-sm text-zinc-500 truncate">{description}</div>
            </div>
            {action || (onClick && <ChevronRight className="w-4 h-4 text-zinc-500" />)}
        </motion.div>
    );
}

export default function SettingsPage() {
    const { theme, setTheme } = useTheme();
    const router = useRouter();
    const supabase = createClient();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/");
        router.refresh();
    };

    return (
        <div className="space-y-8 max-w-2xl">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-3xl font-bold text-white mb-2 font-exo2">Settings</h1>
                <p className="text-zinc-400">Customize your experience</p>
            </motion.div>

            {/* Appearance */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <Card className="bg-zinc-900/50 border-white/10 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-white font-exo2 flex items-center gap-2">
                            <Palette className="w-5 h-5 text-cyan-400" />
                            Appearance
                        </CardTitle>
                        <CardDescription className="text-zinc-400">
                            Customize how RunX looks
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { value: "light", icon: Sun, label: "Light" },
                                { value: "dark", icon: Moon, label: "Dark" },
                                { value: "system", icon: Monitor, label: "System" },
                            ].map((item) => (
                                <motion.button
                                    key={item.value}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setTheme(item.value)}
                                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                                        theme === item.value
                                            ? "border-cyan-500 bg-cyan-500/10 text-cyan-400"
                                            : "border-white/10 bg-zinc-800/50 text-zinc-400 hover:border-white/20"
                                    }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="text-sm font-medium">{item.label}</span>
                                </motion.button>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Notifications */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <Card className="bg-zinc-900/50 border-white/10 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-white font-exo2 flex items-center gap-2">
                            <Bell className="w-5 h-5 text-cyan-400" />
                            Notifications
                        </CardTitle>
                        <CardDescription className="text-zinc-400">
                            Manage your notification preferences
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-1">
                        <SettingItem
                            icon={Bell}
                            title="Push Notifications"
                            description="Receive push notifications on your device"
                            action={
                                <motion.div
                                    whileTap={{ scale: 0.9 }}
                                    className="w-11 h-6 bg-cyan-500 rounded-full p-1 cursor-pointer"
                                >
                                    <motion.div
                                        layout
                                        className="w-4 h-4 bg-white rounded-full ml-auto"
                                    />
                                </motion.div>
                            }
                        />
                        <SettingItem
                            icon={Smartphone}
                            title="Email Notifications"
                            description="Receive updates via email"
                            action={
                                <motion.div
                                    whileTap={{ scale: 0.9 }}
                                    className="w-11 h-6 bg-zinc-700 rounded-full p-1 cursor-pointer"
                                >
                                    <motion.div
                                        layout
                                        className="w-4 h-4 bg-zinc-400 rounded-full"
                                    />
                                </motion.div>
                            }
                        />
                    </CardContent>
                </Card>
            </motion.div>

            {/* Security */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <Card className="bg-zinc-900/50 border-white/10 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-white font-exo2 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-cyan-400" />
                            Security
                        </CardTitle>
                        <CardDescription className="text-zinc-400">
                            Manage your account security
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-1">
                        <SettingItem
                            icon={Shield}
                            title="Change Password"
                            description="Update your account password"
                            onClick={() => {}}
                        />
                    </CardContent>
                </Card>
            </motion.div>

            <Separator className="bg-white/10" />

            {/* Danger Zone */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <Card className="bg-zinc-900/50 border-red-500/20 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-red-400 font-exo2">Danger Zone</CardTitle>
                        <CardDescription className="text-zinc-400">
                            Irreversible account actions
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-1">
                        <SettingItem
                            icon={LogOut}
                            title="Sign Out"
                            description="Sign out of your account"
                            onClick={handleSignOut}
                            danger
                        />
                        <SettingItem
                            icon={Trash2}
                            title="Delete Account"
                            description="Permanently delete your account and data"
                            onClick={() => {}}
                            danger
                        />
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
