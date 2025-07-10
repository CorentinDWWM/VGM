export default function GlobalStats() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center gap-[5px] py-5">
      <h2 className="text-black dark:text-white font-bold text-3xl">
        Statistiques Globales
      </h2>
      <h3 className="text-black dark:text-white">Données au 10 Juillet 2025</h3>
      <div className="w-full h-full flex flex-col gap-[100px] px-[100px] py-2.5">
        <div className="w-full flex flex-wrap items-center justify-center gap-5">
          <div className="w-[250px] flex flex-col items-center gap-2.5 p-5 bg-white dark:bg-gray-900 border border-black dark:border-white shadow-xl dark:shadow-white/10 rounded-xl">
            <div className="flex flex-col items-center justify-center gap-2.5">
              <p>Jeux</p>
              <p>8102</p>
            </div>
          </div>
          <div className="w-[250px] flex flex-col items-center gap-2.5 p-5 bg-white dark:bg-gray-900 border border-black dark:border-white shadow-xl dark:shadow-white/10 rounded-xl">
            <div className="flex flex-col items-center justify-center gap-2.5">
              <p>Jeux terminés</p>
              <p>110K</p>
            </div>
          </div>
          <div className="w-[250px] flex flex-col items-center gap-2.5 p-5 bg-white dark:bg-gray-900 border border-black dark:border-white shadow-xl dark:shadow-white/10 rounded-xl">
            <div className="flex flex-col items-center justify-center gap-2.5">
              <p>Utilisateurs</p>
              <p>15K</p>
            </div>
          </div>
          <div className="w-[250px] flex flex-col items-center gap-2.5 p-5 bg-white dark:bg-gray-900 border border-black dark:border-white shadow-xl dark:shadow-white/10 rounded-xl">
            <div className="flex flex-col items-center justify-center gap-2.5">
              <p>Heures jouées</p>
              <p>1M</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
