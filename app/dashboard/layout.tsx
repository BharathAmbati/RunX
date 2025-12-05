import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="bg-black">
                {/* Header with trigger */}
                <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-white/10 px-4 md:px-6">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="-ml-1 text-zinc-400 hover:text-white hover:bg-white/5" />
                        <Separator orientation="vertical" className="mr-2 h-4 bg-white/10" />
                    </div>
                    <ThemeToggle />
                </header>
                
                {/* Main content */}
                <main className="flex-1 p-6 md:p-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}

