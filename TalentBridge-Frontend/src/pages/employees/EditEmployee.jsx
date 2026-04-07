import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getUserById, updateUser } from "../../api/userApi";
import { Save, Mail, Phone, User, Briefcase, ArrowLeft } from "lucide-react";
import CustomDropdown from "../../components/ui/CustomDropdown";
import { useToast } from "../../context/ToastContext";

export default function EditEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "EMPLOYEE",
    username: "",
  });

  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const data = await getUserById(id);
      setForm({
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        role: data.role,
        username: data.username || data.email.split("@")[0],
      });
    } catch (err) {
      addToast("Failed to load employee data", "error");
    } finally {
      setLoading(false);
    }
  }, [id, addToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRoleChange = (val) => {
    setForm((prev) => ({ ...prev, role: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        username: form.username || form.email.split("@")[0],
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        role: form.role,
        password: null, 
      };

      await updateUser(id, payload);
      addToast("Employee updated successfully!", "success");
      navigate("/employees");
    } catch (err) {
      console.error(err);
      addToast("Failed to update employee", "error");
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
      <div className="mb-6 flex items-center gap-4">
        <button onClick={() => navigate("/employees")} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
          <ArrowLeft size={20} className="text-slate-600 dark:text-slate-300" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight leading-none">Edit Employee</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Update employee profile and system authorization.</p>
        </div>
      </div>

      <div className="glass-panel p-8 rounded-2xl shadow-xl">
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
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 dark:text-white placeholder-slate-400 font-medium"
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
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 dark:text-white placeholder-slate-400 font-medium"
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
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 dark:text-white placeholder-slate-400 font-medium"
                />
              </div>
            </div>

            <CustomDropdown
              label="System Role"
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

          <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-700">
            <button
              type="button"
              onClick={() => navigate("/employees")}
              className="px-6 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl font-bold transition-all"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20 flex items-center gap-2 transition-all hover:-translate-y-1 active:translate-y-0"
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
