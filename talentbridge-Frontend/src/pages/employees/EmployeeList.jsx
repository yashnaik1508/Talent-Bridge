// src/pages/employees/EmployeeList.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllUsers, deleteUser } from "../../api/userApi";
import { Search, Plus, Users, Trash2, Edit2, Award, Mail, Phone, Shield } from "lucide-react";

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const data = await getAllUsers();
      setEmployees(data);
    } catch (error) {
      console.error("Failed to fetch employees", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to mark this employee as inactive?")) {
      await deleteUser(id);
      fetchData();
    }
  };

  const filteredEmployees = employees.filter((emp) =>
    `${emp.fullName} ${emp.email} ${emp.role} ${emp.phone}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const getRoleBadgeColor = (role) => {
    switch (role?.toUpperCase()) {
      case "ADMIN": return "bg-purple-100 text-purple-700 border-purple-200";
      case "HR": return "bg-pink-100 text-pink-700 border-pink-200";
      case "PM": return "bg-orange-100 text-orange-700 border-orange-200";
      default: return "bg-blue-100 text-blue-700 border-blue-200";
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
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">Employees</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your workforce, roles, and skills.</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/employees/strength")}
            className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl shadow-sm flex items-center gap-2 transition-all"
          >
            <Users size={18} />
            Strength
          </button>

          <button
            onClick={() => navigate("/employees/inactive")}
            className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl shadow-sm flex items-center gap-2 transition-all"
          >
            <Users size={18} />
            Inactive
          </button>

          <button
            onClick={() => navigate("/employees/add")}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/20 flex items-center gap-2 transition-all hover:-translate-y-0.5"
          >
            <Plus size={20} />
            Add Employee
          </button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input
          type="text"
          placeholder="Search by name, email, role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 dark:text-white placeholder-slate-400"
        />
      </div>

      {/* Employee List */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="p-5 font-semibold text-slate-600 dark:text-slate-400 text-sm uppercase tracking-wider">Employee</th>
              <th className="p-5 font-semibold text-slate-600 dark:text-slate-400 text-sm uppercase tracking-wider">Contact</th>
              <th className="p-5 font-semibold text-slate-600 dark:text-slate-400 text-sm uppercase tracking-wider">Role</th>
              <th className="p-5 font-semibold text-slate-600 dark:text-slate-400 text-sm uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {filteredEmployees.map((emp) => (
              <tr key={emp.userId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">

                {/* Name & Avatar */}
                <td className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20">
                      {emp.fullName?.[0]}
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 dark:text-white">{emp.fullName}</div>
                      <div className="text-xs text-slate-400">ID: {emp.userId}</div>
                    </div>
                  </div>
                </td>

                {/* Contact Info */}
                <td className="p-5">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <Mail size={14} className="text-slate-400" />
                      {emp.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <Phone size={14} className="text-slate-400" />
                      {emp.phone || "N/A"}
                    </div>
                  </div>
                </td>

                {/* Role Badge */}
                <td className="p-5">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border flex w-fit items-center gap-1 ${getRoleBadgeColor(emp.role)}`}>
                    <Shield size={12} />
                    {emp.role}
                  </span>
                </td>

                {/* Actions */}
                <td className="p-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => navigate(`/employees/${emp.userId}/skills`)}
                      className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                      title="Skills"
                    >
                      <Award size={18} />
                    </button>

                    <button
                      onClick={() => navigate(`/employees/edit/${emp.userId}`)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={18} />
                    </button>

                    <button
                      onClick={() => handleDelete(emp.userId)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Mark Inactive"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredEmployees.length === 0 && (
              <tr>
                <td colSpan="4" className="p-12 text-center text-slate-400">
                  <div className="flex flex-col items-center gap-3">
                    <Users size={48} className="text-slate-200" />
                    <p>No employees found matching your search.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
