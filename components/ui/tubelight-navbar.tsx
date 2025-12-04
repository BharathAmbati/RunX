"use client"

import React, { useEffect, useState } from "react"
import { motion } from "motion/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
    name: string
    url: string
    icon: LucideIcon
}

interface NavBarProps {
    items: NavItem[]
    className?: string
    action?: React.ReactNode // Added action prop for the Sign In button
}

export function TubelightNavbar({ items, className, action }: NavBarProps) {
    const pathname = usePathname()
    const [isMobile, setIsMobile] = useState(false)
    const [hash, setHash] = useState('')

    // Track hash changes
    useEffect(() => {
        const updateHash = () => setHash(window.location.hash)
        updateHash()
        window.addEventListener('hashchange', updateHash)
        return () => window.removeEventListener('hashchange', updateHash)
    }, [])

    // Determine active tab based on current pathname and hash
    const getActiveTab = () => {
        const fullUrl = pathname + hash

        for (const item of items) {
            // Exact match for full URL (e.g., "/#leaderboard")
            if (item.url === fullUrl) {
                return item.name
            }
            // Match for page routes (e.g., "/learn")
            if (item.url !== '/' && !item.url.includes('#') && pathname.startsWith(item.url)) {
                return item.name
            }
        }
        // Default to Home if on root with no hash or no match
        if (pathname === '/' && !hash) {
            return items.find(item => item.url === '/')?.name || items[0].name
        }
        return items[0].name
    }

    const activeTab = getActiveTab()

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768)
        }

        handleResize()
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    return (
        <div
            className={cn(
                "z-50",
                className,
            )}
        >
            <div className="flex items-center gap-3 bg-black/50 border border-white/10 backdrop-blur-xl py-1 px-1 rounded-full shadow-lg">
                {items.map((item) => {
                    const Icon = item.icon
                    const isActive = activeTab === item.name

                    return (
                        <Link
                            key={item.name}
                            href={item.url}
                            className={cn(
                                "relative cursor-pointer text-sm font-semibold px-6 py-2 rounded-full transition-colors",
                                "text-zinc-400 hover:text-cyan-400",
                                isActive && "bg-white/10 text-cyan-400",
                            )}
                        >
                            <span className="hidden md:inline">{item.name}</span>
                            <span className="md:hidden">
                                <Icon size={18} strokeWidth={2.5} />
                            </span>
                        </Link>
                    )
                })}
                {action && (
                    <div className="pl-2 border-l border-white/10 ml-2">
                        {action}
                    </div>
                )}
            </div>
        </div>
    )
}
