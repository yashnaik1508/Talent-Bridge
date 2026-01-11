import { Clock, CheckCircle2 } from "lucide-react";

export default function RecentActivity({ projects = [], assignments = [] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

      {/* RECENT PROJECTS */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Clock size={18} className="text-blue-500" />
            Recent Projects
          </h3>
          <button className="text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline">View All</button>
        </div>

        <div className="space-y-3">
          {projects.length ? (
            projects.map((p, i) => (
              <div
                key={i}
                className="p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl hover:shadow-md transition-all flex justify-between items-start group"
              >
                <div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{p.name}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                    {p.description || "No description"}
                  </div>
                </div>

                <span className="text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-md">
                  {p.startDate?.slice(0, 10)}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
              No recent projects
            </div>
          )}
        </div>
      </div>

      {/* RECENT ASSIGNMENTS */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <CheckCircle2 size={18} className="text-emerald-500" />
            Recent Assignments
          </h3>
          <button className="text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline">View All</button>
        </div>

        <div className="space-y-3">
          {assignments.length ? (
            assignments.map((a, i) => (
              <div
                key={i}
                className="p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl hover:shadow-md transition-all flex justify-between items-center group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs font-bold">
                    {a.employeeName?.[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{a.employeeName}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{a.projectName}</div>
                  </div>
                </div>
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  {a.assignedAt?.slice(0, 10)}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
              No recent assignments
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
