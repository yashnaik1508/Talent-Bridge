import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTeams, deleteTeam } from "../../api/teamApi";
import { useAuth } from "../../context/AuthContext";
import { Search, Plus, Users, Trash2, ArrowRight, MessageSquare } from "lucide-react";

export default function TeamList() {
  const [teams, setTeams] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { role } = useAuth();

  const fetchData = async () => {
    try {
      const data = await getTeams();
      setTeams(data);
    } catch (error) {
      console.error("Failed to fetch teams", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this team? This action cannot be undone.")) {
      await deleteTeam(id);
      fetchData();
    }
  };

  const filteredTeams = teams.filter((t) =>
    `${t.name} ${t.projectName}`.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">Teams</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {role === "ADMIN" ? "Manage all project teams." : "View and manage your assigned teams."}
          </p>
        </div>

        {(role === "ADMIN" || role === "PM") && (
          <button
            onClick={() => navigate("/teams/add")}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/20 flex items-center gap-2 transition-all hover:-translate-y-0.5"
          >
            <Plus size={20} />
            Create Team
          </button>
        )}
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input
          type="text"
          placeholder="Search by team name or project..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 dark:text-white placeholder-slate-400"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeams.map((team) => (
          <div key={team.teamId} className="glass-panel p-6 rounded-2xl flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold shadow-md">
                  <MessageSquare size={24} />
                </div>
                {(role === "ADMIN" || role === "PM") && (
                  <button
                    onClick={() => handleDelete(team.teamId)}
                    className="p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete Team"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
              
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1 group-hover:text-blue-500 transition-colors">
                {team.name}
              </h3>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-4 line-clamp-1">
                Project: {team.projectName}
              </p>

              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 mb-6 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-lg border border-slate-100 dark:border-slate-700/50">
                <Users size={16} className="text-blue-500" />
                <span className="font-semibold">{team.memberCount || 0}</span>
                <span className="text-slate-500 dark:text-slate-400">Members</span>
              </div>
            </div>

            <button
              onClick={() => navigate(`/teams/${team.teamId}`)}
              className="w-full py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 hover:border-blue-200 dark:hover:border-blue-800 rounded-xl font-semibold flex justify-center items-center gap-2 transition-all group/btn"
            >
              View Dashboard
              <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        ))}

        {filteredTeams.length === 0 && (
          <div className="col-span-full py-16 text-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col items-center gap-3">
            <MessageSquare size={48} className="text-slate-300 dark:text-slate-600" />
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">No teams found</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm">No teams match your search or you haven't been assigned to any teams yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
