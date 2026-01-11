import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";
import { forgotPassword } from "../../api/authApi";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await forgotPassword(email);
            setSubmitted(true);
        } catch (err) {
            console.error("Forgot password error:", err);
            setError("Invalid credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-slate-900 transition-colors duration-300">

            {/* LEFT SIDE - BRANDING (Reused from Login for consistency) */}
            <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-600 to-indigo-900 items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
                <div className="relative z-10 p-12 text-white max-w-lg">
                    <h1 className="text-4xl font-extrabold mb-6 tracking-tight leading-tight">
                        Account Recovery
                    </h1>
                    <p className="text-lg text-blue-100 mb-8 leading-relaxed">
                        Don't worry, it happens to the best of us. Enter your email and we'll help you get back to your account.
                    </p>
                </div>

                {/* Decorative circles */}
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            </div>

            {/* RIGHT SIDE - FORM */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md space-y-8">

                    {/* Back Link */}
                    <Link to="/login" className="inline-flex items-center text-sm text-slate-400 hover:text-white transition-colors">
                        <ArrowLeft size={16} className="mr-2" />
                        Back to Login
                    </Link>

                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold text-white">Forgot Password?</h2>
                        <p className="mt-2 text-slate-400">
                            {submitted
                                ? "Check your email for instructions."
                                : "Enter your email address to reset your password."}
                        </p>
                    </div>

                    {submitted ? (
                        <div className="bg-green-900/20 border border-green-500/30 rounded-2xl p-6 text-center animate-in fade-in zoom-in duration-300">
                            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle size={32} className="text-green-500" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">Email Sent!</h3>
                            <p className="text-slate-300 mb-6">
                                We've sent a password reset link to <span className="font-semibold text-white">{email}</span>.
                                Please check your inbox and spam folder.
                            </p>
                            <button
                                onClick={() => setSubmitted(false)}
                                className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                            >
                                Try a different email
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="bg-red-900/20 border-l-4 border-red-500 p-4 rounded-r dark:border-red-500/50">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-red-200">{error}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail size={18} className="text-slate-500" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                            >
                                {loading ? (
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : (
                                    "Send Reset Link"
                                )}
                            </button>
                        </form>
                    )}

                    <p className="text-center text-sm text-slate-500">
                        &copy; 2025 TalentBridge. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}
