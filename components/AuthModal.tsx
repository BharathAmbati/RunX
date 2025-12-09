"use client";

import { motion, AnimatePresence } from "motion/react";
import { X, Loader2 } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { login, signup } from "@/app/actions";

export default function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const router = useRouter();

    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);
        if (!isLogin) {
            formData.append('username', username);
        }

        try {
            if (isLogin) {
                // Server action handles redirect on success
                const response = await login(formData);
                if (response?.error) {
                    setError(response.error);
                } else {
                    // Successful login will redirect, so we can just close the modal
                    // The redirect might cause the component to unmount before this runs, which is fine
                    onClose();
                }
            } else {
                const response = await signup(formData);
                if (response?.error) {
                    setError(response.error);
                } else if (response?.success) {
                    setMessage(response.success);
                    // Clear form
                    setPassword("");
                }
            }
        } catch (err) {
            // Next.js redirects throw an error, we need to catch it?
            // Actually, redirects from Server Actions in Client Components typically work without catching if not inside try/catch that blocks it?
            // But here we are inside try/catch.
            // If it's a redirect error, we should let it bubble or ignore it.
            // However, typical pattern for server action returning error object doesn't throw.
            // But `redirect()` in server action DOES throw.
            // So we need to re-throw if it's a NEXT_REDIRECT error.
            // But we can simplfy: create a client-side wrapper or just handle the error string return.
            // The `login` action returns { error } OR throws a redirect.
            // So if it throws, it's likely the redirect.
            
            // NOTE: The `redirect` function throws an error, so we need to avoid catching it as a generic error.
            // BUT, since we are calling it from an async function in a client component:
            // "When a Server Action is invoked from a Client Component... if the action redirects... the promise will reject..." is NOT how it works usually. The client router handles the redirect instruction.
            
            // Let's assume standard behavior: `login` action containing `redirect()` will cause the `await login()` to essentially "never return" or return a specific result that Next.js client handles?
            // Actually, typically you shouldn't put `redirect` inside a try/catch if you want it to work easily, OR rethrow.
            // But checking Next.js docs: "Redirects... throw a NEXT_REDIRECT error".
            // So if I catch generic error, I prevent redirect.
            
            // Let's modify the server action to NOT redirect, but return success, and let Client redirect?
            // NO, the plan was Server-Side redirect.
            // So I should check if the error is a digest "NEXT_REDIRECT" or similar.
            // OR simpler: don't try/catch the redirect-causing action?
            // But I needed try/catch for other errors?
            // The `login` action only returns if there is an auth error. If it succeeds, it redirects.
            // So if `await login()` returns, it's an error (or void if I messed up types).
            // Actually `login` returns `Promise<void | { error: string }>`
            
            // Wait, if `redirect` throws, it throws on the SERVER side. The Client Action invocation receives the redirect instruction.
            // It does NOT throw an error in the browser.
            // So `try...catch` here wrapping the server action call catches NETWORK errors or exceptions, but NOT the redirect "error" which happens on server.
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
                },
            });

            if (error) throw error;
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl bg-zinc-900 border border-white/10 shadow-2xl"
                    >
                        <div className="relative p-6">
                            <button
                                onClick={onClose}
                                className="absolute right-4 top-4 text-zinc-400 hover:text-white"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <h2 className="text-2xl font-bold text-white mb-6">
                                {isLogin ? "WELCOME BACK" : "JOIN THE FUTURE"}
                            </h2>

                            {error && (
                                <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                    {error}
                                </div>
                            )}

                            {message && (
                                <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
                                    {message}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {!isLogin && (
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-400 mb-1">Username</label>
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-2 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                                            placeholder="RunnerOne"
                                        />
                                    </div>
                                )}
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-2 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                                        placeholder="you@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-400 mb-1">Password</label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        minLength={6}
                                        className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-2 text-white focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                                        placeholder="••••••••"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 bg-cyan-500 text-black font-bold rounded-lg hover:bg-cyan-400 transition-colors mt-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {isLogin ? "SIGN IN" : "CREATE ACCOUNT"}
                                </button>
                            </form>

                            <div className="mt-4">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-zinc-700"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-zinc-900 text-zinc-400">or continue with</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleGoogleSignIn}
                                    disabled={loading}
                                    className="mt-4 w-full py-3 bg-white text-black font-medium rounded-lg hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path
                                            fill="currentColor"
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        />
                                    </svg>
                                    Google
                                </button>
                            </div>

                            <div className="mt-6 text-center text-sm text-zinc-400">
                                {isLogin ? "Don't have an account? " : "Already have an account? "}
                                <button
                                    onClick={() => {
                                        setIsLogin(!isLogin);
                                        setError(null);
                                        setMessage(null);
                                    }}
                                    className="text-cyan-400 hover:underline"
                                >
                                    {isLogin ? "Sign up" : "Sign in"}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
