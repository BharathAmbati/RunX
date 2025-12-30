import Navbar from "@/components/Navbar";
import PowerSection from "@/components/PowerSection";
import RecoverSection from "@/components/RecoverSection";

export default function LearnPage() {
    return (
        <main className="min-h-screen bg-black text-white selection:bg-cyan-500/30">
            <Navbar />
            <div className="pt-20">
                <PowerSection />
                <RecoverSection />
            </div>

            {/* Footer */}
            <footer className="py-8 text-center text-zinc-600 text-sm border-t border-white/5 bg-black">
                <p>© 2025 RUNX. All rights reserved.</p>
            </footer>
        </main>
    );
}
