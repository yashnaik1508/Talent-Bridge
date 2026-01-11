export default function MetricCard({ title, value, icon, color = "blue" }) {
  const styles = {
    blue: {
      gradient: "from-blue-500 to-blue-600",
      shadow: "shadow-blue-500/30",
    },
    green: {
      gradient: "from-emerald-500 to-emerald-600",
      shadow: "shadow-emerald-500/30",
    },
    purple: {
      gradient: "from-purple-500 to-purple-600",
      shadow: "shadow-purple-500/30",
    },
    orange: {
      gradient: "from-orange-500 to-orange-600",
      shadow: "shadow-orange-500/30",
    },
  };

  const currentStyle = styles[color] || styles.blue;

  return (
    <div className="glass-panel p-6 rounded-2xl flex items-center justify-between card-hover group relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${currentStyle.gradient} opacity-10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110`}></div>

      <div>
        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-slate-800 dark:text-white">{value}</h3>
      </div>

      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${currentStyle.gradient} flex items-center justify-center text-white shadow-lg ${currentStyle.shadow}`}>
        <span className="text-xl">{icon}</span>
      </div>
    </div>
  );
}
