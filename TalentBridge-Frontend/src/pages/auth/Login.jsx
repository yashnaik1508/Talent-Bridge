import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { loginUser, loginWithGoogleApi } from "../../api/authApi";
import { useGoogleLogin } from "@react-oauth/google";
import { useToast } from "../../context/ToastContext";

export default function Login() {
  const { setAuthData } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleLoginSuccess = (response) => {
    const token = response.token;
    const role = response.role;
    const userId = response.userId;

    setAuthData(token, role, userId);

    const savedSettings = localStorage.getItem("simpleSettings");
    let targetPage = "/dashboard";
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      if (parsed.defaultPage) {
        targetPage = parsed.defaultPage;
      }
    }
    navigate(targetPage, { replace: true });
    addToast("Welcome back to TalentBridge!", "success");
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setGoogleLoading(true);
      try {
        const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const googleUser = await userInfoRes.json();
        
        const response = await loginWithGoogleApi({
          email: googleUser.email,
          name: googleUser.name,
          picture: googleUser.picture,
          sub: googleUser.sub, 
        });
        
        handleLoginSuccess(response);
      } catch (err) {
        console.error("Google Auth Error:", err);
        addToast("Google sign-in failed. Please try again.", "error");
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: () => addToast("Google Sign-In failed or was cancelled.", "warning"),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await loginUser(email, password);
      handleLoginSuccess(response);
    } catch (err) {
      console.error("Login error:", err);
      addToast("Invalid email or password", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex bg-slate-900 overflow-hidden transition-colors duration-300">

      {/* LEFT SIDE - BRANDING */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-600 to-indigo-900 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="relative z-10 p-12 text-white max-w-lg">
          <h1 className="text-5xl font-extrabold mb-6 tracking-tight leading-tight text-white shadow-sm">
            Unlock Your Workforce Potential
          </h1>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed opacity-90">
            TalentBridge connects the right people to the right projects.
            Streamline assignments, track skills, and optimize resource allocation with AI-driven insights.
          </p>
          <div className="flex space-x-4">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl shadow-xl">
              <h3 className="font-bold text-3xl mb-1">98%</h3>
              <p className="text-sm text-blue-200 font-medium uppercase tracking-wider">Match Accuracy</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl shadow-xl">
              <h3 className="font-bold text-3xl mb-1">Smart</h3>
              <p className="text-sm text-blue-200 font-medium uppercase tracking-wider">Skill Tracking</p>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-pulse"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-pulse"></div>
      </div>

      {/* RIGHT SIDE - LOGIN FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 overflow-y-auto custom-scrollbar">
        <div className="w-full max-w-md my-auto">
          <div className="text-center lg:text-left mb-10">
            <h2 className="text-4xl font-bold text-white tracking-tight underline decoration-blue-500 decoration-4 underline-offset-8 mb-4">Welcome Back</h2>
            <p className="text-slate-400 font-medium text-lg">Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-300 ml-1">Email Address</label>
              <input
                type="email"
                required
                className="w-full px-5 py-4 rounded-xl bg-slate-800/50 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-inner"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="block text-sm font-bold text-slate-300">Password</label>
                <Link to="/forgot-password" size="sm" className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-widest">
                  Forgot?
                </Link>
              </div>
              <input
                type="password"
                required
                className="w-full px-5 py-4 rounded-xl bg-slate-800/50 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all shadow-inner"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex items-center px-1 pb-2">
              <input
                id="remember-me"
                type="checkbox"
                className="h-5 w-5 rounded-lg border-slate-700 bg-slate-800 text-blue-600 focus:ring-blue-600/20 focus:ring-offset-0 transition-colors"
              />
              <label htmlFor="remember-me" className="ml-3 text-sm font-semibold text-slate-400 cursor-pointer">
                Keep me logged in
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-xl shadow-xl text-base font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all transform active:scale-[0.98] disabled:opacity-50 shadow-blue-500/20"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Signing in...</span>
                </div>
              ) : "Sign In"}
            </button>
          </form>

          {/* Spacing fix for overlap */}
          <div className="mt-12 mb-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700/60"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest font-extrabold">
                <span className="px-6 bg-slate-900 text-slate-500">
                  Or continue with
                </span>
              </div>
            </div>
          </div>

          <button 
            onClick={() => handleGoogleLogin()}
            disabled={googleLoading || loading}
            type="button"
            className="w-full flex justify-center items-center py-4 px-6 border-2 border-slate-700/80 rounded-xl bg-transparent text-sm font-bold text-slate-300 hover:bg-slate-800 hover:text-white hover:border-slate-500 transition-all duration-300 gap-3 group shadow-lg hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]"
          >
            {googleLoading ? (
              <svg className="animate-spin h-5 w-5 text-blue-500" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-6 h-6 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 7.373-3.36 2.16-4.147 2.16-10.64 0-14.8h-7.373z" />
              </svg>
            )}
            <span className="tracking-wide">Sign in with Email</span>
          </button>

          <p className="mt-12 text-center text-sm text-slate-500 font-medium">
            &copy; 2026 TalentBridge Enterprise. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
