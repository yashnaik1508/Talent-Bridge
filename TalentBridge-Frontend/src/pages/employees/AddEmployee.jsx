import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../api/authApi";
import { UserPlus, Mail, Phone, Lock, User, Briefcase, Trash2 } from "lucide-react";
import CustomDropdown from "../../components/ui/CustomDropdown";
import { useToast } from "../../context/ToastContext";

export default function AddEmployee() {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [form, setForm] = useState({
    username: "",
    fullName: "",
    email: "",
    role: "EMPLOYEE",
    phone: "",
    password: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) => {
    if (e.target.name === "phone") {
      const val = e.target.value.replace(/\D/g, "");
      if (val.length <= 10) {
        setForm((prev) => ({ ...prev, phone: val }));
      }
    } else {
      setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  const handlePhoneBlur = () => {
    if (form.phone && form.phone.length < 10) {
      addToast("Invalid phone number", "error");
    }
  };

  const isFormValid = form.fullName && form.email && form.password && form.phone && form.phone.length === 10;

  const handleRoleChange = (val) => {
    setForm((prev) => ({ ...prev, role: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    if (!form.fullName || !form.email || !form.password || !form.phone) {
      addToast("All fields are required.", "warning");
      setSubmitting(false);
      return;
    }

    if (form.phone.length !== 10) {
      addToast("Invalid phone number", "error");
      setSubmitting(false);
      return;
    }

    try {
      const payload = {
        username: form.username || form.email.split("@")[0],
        fullName: form.fullName,
        email: form.email,
        role: form.role,
        phone: form.phone,
        password: form.password,
      };

      await registerUser(payload);
      addToast("Employee added successfully!", "success");
      navigate("/employees", { replace: true });

    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to register user. Try again.";
      addToast(msg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">Add Employee</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Create a new user account for an employee.</p>
      </div>

      <div className="glass-panel p-8 rounded-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={onChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 dark:text-white placeholder-slate-400"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={onChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 dark:text-white placeholder-slate-400"
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  name="phone"
                  value={form.phone}
                  onChange={onChange}
                  onBlur={handlePhoneBlur}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 dark:text-white placeholder-slate-400"
                  placeholder="1234567890"
                  required
                />
              </div>
            </div>

            <CustomDropdown
              label="Role"
              icon={Briefcase}
              options={[
                { label: "Employee", value: "EMPLOYEE" },
                { label: "HR Manager", value: "HR" },
                { label: "Project Manager", value: "PM" },
                { label: "Administrator", value: "ADMIN" },
              ]}
              value={form.role}
              onChange={handleRoleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={onChange}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 dark:text-white placeholder-slate-400"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
            <button
              type="button"
              onClick={() => navigate("/employees")}
              className="px-5 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl font-medium transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting || !isFormValid}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-lg shadow-blue-600/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all hover:-translate-y-0.5"
            >
              <UserPlus size={18} />
              {submitting ? "Adding..." : "Add Employee"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
