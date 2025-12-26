"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface OverviewGridProps {
    children: ReactNode;
    className?: string;
}

export function OverviewGrid({ children, className }: OverviewGridProps) {
    return (
        <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", className)}>
            {children}
        </div>
    );
}
