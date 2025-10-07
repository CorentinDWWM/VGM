export default function GlobalStats() {
  const statsData = [
    { label: "Jeux", value: "8102" },
    { label: "Jeux terminés", value: "110K" },
    { label: "Utilisateurs", value: "15K" },
    { label: "Heures jouées", value: "1M" },
  ];

  return (
    <div className="w-full min-h-screen flex flex-col items-center gap-5 py-5">
      <h2 className="text-black dark:text-white font-bold text-3xl">
        Statistiques Globales
      </h2>
      <h3 className="text-black dark:text-white">Données au 10 Juillet 2025</h3>

      <div className="w-full max-w-6xl px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-900 border border-black dark:border-white shadow-xl dark:shadow-white/10 rounded-xl p-6 text-center"
            >
              <p className="text-lg font-medium mb-2">{stat.label}</p>
              <p className="text-3xl font-bold text-primary-light dark:text-primary-dark">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
