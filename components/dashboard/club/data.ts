import { Users, MapPin, Zap, Trophy, Timer } from "lucide-react";

export interface Club {
    id: number;
    name: string;
    location: string;
    members: number;
    tags: string[];
    color: string;
    bg: string;
    border: string;
    // Enhanced details
    description: string;
    nextRun: {
        title: string;
        date: string;
        time: string;
        distance: string;
        location: string;
    };
    announcements: {
        id: number;
        title: string;
        date: string;
        content: string;
    }[];
    stats: {
        weeklyDistance: number;
        activeMembers: number;
        totalLabel: string;
    };
    memberList: {
        id: number;
        name: string;
        role: string;
        avatar: string; // Initials or image URL placeholder
    }[];
}

const generateMembers = (count: number) => {
    return Array.from({ length: count }).map((_, i) => ({
        id: i + 1,
        name: `Runner ${i + 1}`,
        role: i === 0 ? "Admin" : i < 3 ? "Moderator" : "Member",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`
    }));
};

export const clubs: Club[] = [
    {
        id: 1,
        name: "Midnight Runners",
        location: "Downtown, 0.5km away",
        members: 1240,
        tags: ["Night Runs", "Social", "5k/10k"],
        color: "text-purple-400",
        bg: "bg-purple-500/10",
        border: "border-purple-500/20",
        description: "We own the night. Join the city's largest nocturnal running community. We run hard, party harder, and light up the streets.",
        nextRun: {
            title: "Neon Night Run",
            date: "Tomorrow",
            time: "20:00",
            distance: "10km",
            location: "City Plaza"
        },
        announcements: [
             { id: 1, title: "New Route Unlocked", date: "2h ago", content: "The Riverside path is now open! Join us this Friday to break it in." }
        ],
        stats: { weeklyDistance: 450, activeMembers: 85, totalLabel: "Total Km this week" },
        memberList: [
            { id: 1, name: "Alex K.", role: "Lead", avatar: "AK" },
            { id: 2, name: "Sarah M.", role: "Coach", avatar: "SM" },
            { id: 3, name: "Mike R.", role: "Member", avatar: "MR" },
            { id: 4, name: "Jessica L.", role: "Member", avatar: "JL" },
            { id: 5, name: "Tom B.", role: "Member", avatar: "TB" },
        ]
    },
    {
        id: 2,
        name: "Coastal Sprinters",
        location: "Beachside, 3.2km away",
        members: 850,
        tags: ["Morning", "Intervals", "Pro"],
        color: "text-cyan-400",
        bg: "bg-cyan-500/10",
        border: "border-cyan-500/20",
        description: "Chase the sunrise with us. Focused on interval training and improving your PRs along the scenic coastal route.",
        nextRun: {
            title: "Sunrise Intervals",
            date: "Wed",
            time: "06:00",
            distance: "8x400m",
            location: "Beach Blvd"
        },
        announcements: [],
        stats: { weeklyDistance: 320, activeMembers: 60, totalLabel: "Interval sets done" },
        memberList: [
            { id: 1, name: "David C.", role: "Coach", avatar: "DC" },
            { id: 2, name: "Emma W.", role: "Pacer", avatar: "EW" },
            { id: 3, name: "Lucas P.", role: "Member", avatar: "LP" },
        ]
    },
    {
        id: 3,
        name: "Trail Blazers",
        location: "North Hills, 5km away",
        members: 620,
        tags: ["Trail", "Endurance", "Weekend"],
        color: "text-orange-400",
        bg: "bg-orange-500/10",
        border: "border-orange-500/20",
        description: "Escape the concrete jungle. We specialize in trail running, elevation gain, and muddy adventures.",
        nextRun: {
            title: "Peak Bagging",
            date: "Sat",
            time: "07:30",
            distance: "15km",
            location: "North Trailhead"
        },
        announcements: [],
        stats: { weeklyDistance: 8000, activeMembers: 45, totalLabel: "Elevation gain (m)" },
        memberList: []
    },
    {
        id: 4,
        name: "Urban Striders",
        location: "City Center, 1.2km away",
        members: 2100,
        tags: ["Open Level", "Daily", "Marathon Prep"],
        color: "text-rose-400",
        bg: "bg-rose-500/10",
        border: "border-rose-500/20",
        description: "The heartbeat of the city. Daily runs for all levels, from beginners to marathon qualifiers.",
        nextRun: {
            title: "Thirsty Thursday",
            date: "Thu",
            time: "18:30",
            distance: "5km",
            location: "Central Station"
        },
        announcements: [],
        stats: { weeklyDistance: 1200, activeMembers: 150, totalLabel: "Marathons qualified" },
        memberList: []
    },
    {
        id: 5,
        name: "Early Birds",
        location: "Central Park, 2.0km away",
        members: 450,
        tags: ["Sunrise", "Beginner Friendly", "Coffee"],
        color: "text-yellow-400",
        bg: "bg-yellow-500/10",
        border: "border-yellow-500/20",
        description: "Start your day right. Easy pace, great conversation, and the best post-run coffee in town.",
        nextRun: {
            title: "Morning Coffee Run",
            date: "Daily",
            time: "06:30",
            distance: "4km",
            location: "Park Entrance"
        },
        announcements: [],
        stats: { weeklyDistance: 150, activeMembers: 30, totalLabel: "Coffees consumed" },
        memberList: []
    },
    {
        id: 6,
        name: "Tech & Track",
        location: "Innovation Hub, 0.8km away",
        members: 300,
        tags: ["Networking", "Gadgets", "Casual"],
        color: "text-blue-400",
        bg: "bg-blue-500/10",
        border: "border-blue-500/20",
        description: "Where running meets technology. Test the latest gadgets and network with fellow tech enthusiasts.",
        nextRun: {
            title: "Gadget Test Run",
            date: "Fri",
            time: "17:00",
            distance: "5km",
            location: "Tech Park"
        },
        announcements: [],
        stats: { weeklyDistance: 100, activeMembers: 25, totalLabel: "Gadgets tested" },
        memberList: []
    }
];
