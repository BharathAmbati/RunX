export default function AuthError() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-black">
            <div className="text-center p-8 rounded-2xl bg-zinc-900 border border-white/10 max-w-md">
                <h1 className="text-2xl font-bold text-white mb-4">Authentication Error</h1>
                <p className="text-zinc-400 mb-6">
                    There was a problem signing you in. Please try again.
                </p>
                <a
                    href="/"
                    className="inline-block px-6 py-3 bg-cyan-500 text-black font-bold rounded-lg hover:bg-cyan-400 transition-colors"
                >
                    Return Home
                </a>
            </div>
        </div>
    )
}
