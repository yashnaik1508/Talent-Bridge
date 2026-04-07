import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getAllUsers, updateUser } from "../../api/userApi";
import { User, Mail, Phone, MapPin, Save, Briefcase } from "lucide-react";

export default function UserInfo() {
    const { authToken } = useAuth();
    const [form, setForm] = useState({
        id: null,
        username: "",
        fullName: "",
        email: "",
        phone: "",
        role: "",
        location: ""
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const loadUserData = async () => {
            if (authToken) {
                try {
                    const payload = JSON.parse(atob(authToken.split(".")[1]));
                    const email = payload.email;

                    const users = await getAllUsers();
                    const currentUser = users.find(u => u.email === email);

                    if (currentUser) {
                        setForm({
                            id: currentUser.userId,
                            username: currentUser.username || email.split("@")[0],
                            fullName: currentUser.fullName || currentUser.name || email.split("@")[0],
                            email: currentUser.email,
                            phone: currentUser.phone || "",
                            role: currentUser.role,
                            location: "" // Not supported by backend
                        });
                    } else {
                        setForm({
                            id: null,
                            username: email.split("@")[0],
                            fullName: email.split("@")[0],
                            email: email,
                            phone: "",
                            role: payload.role,
                            location: ""
                        });
                    }
                } catch (e) {
                    console.error("Failed to load user data", e);
                    setError("Failed to load user profile");
                } finally {
                    setLoading(false);
                }
            }
        };

        loadUserData();
    }, [authToken]);

    const onChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            if (form.id) {
                // Backend expects User object structure
                await updateUser(form.id, {
                    userId: form.id,
                    username: form.username || form.email.split("@")[0],
                    fullName: form.fullName,
                    email: form.email,
                    phone: form.phone,
                    role: form.role,
                    password: null
                });
                setSuccess("Profile updated successfully");
            } else {
                setError("Cannot update profile: User ID not found");
            }
        } catch (err) {
            console.error(err);
            setError("Failed to update profile");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">User Profile</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your account information.</p>
            </div>

            <div className="glass-panel p-8 rounded-2xl">
                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl mb-6 border border-red-100 dark:border-red-800">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 p-4 rounded-xl mb-6 border border-emerald-100 dark:border-emerald-800">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    name="fullName"
                                    value={form.fullName}
                                    onChange={onChange}
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 dark:text-white"
                                    required
                                />
                            </div>
                        </div>

                        {/* Email Address (Read-only) */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    name="email"
                                    type="email"
                                    value={form.email}
                                    readOnly
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 cursor-not-allowed"
                                />
                            </div>
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    name="phone"
                                    value={form.phone}
                                    onChange={onChange}
                                    placeholder="Enter phone number"
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 dark:text-white"
                                />
                            </div>
                        </div>

                        {/* Role (Read-only) */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Role</label>
                            <div className="relative">
                                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    name="role"
                                    value={form.role}
                                    readOnly
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 cursor-not-allowed"
                                />
                            </div>
                        </div>

                        {/* Location */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Location</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    name="location"
                                    value={form.location}
                                    onChange={onChange}
                                    placeholder="Enter location"
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 dark:text-white"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="px-5 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-lg shadow-blue-600/20 flex items-center gap-2 transition-all hover:-translate-y-0.5"
                        >
                            <Save size={18} />
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
