import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import StatsSection from "@/components/StatsSection";
import ContactSection from "@/components/ContactSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-cyan-500/30">
      <Navbar />
      <Hero />
      <StatsSection />
      <ContactSection />

      {/* Footer */}
      <footer id="about" className="py-8 text-center text-zinc-600 text-sm border-t border-white/5 bg-black">
        <p>© 2025 RUNX. All rights reserved.</p>
      </footer>
    </main>
  );
}
