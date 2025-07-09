import HeaderUser from "../../components/Profil/HeaderUser";

export default function StatisticsUser() {
  return (
    <div className="flex flex-col gap-5 border border-black dark:border-white mx-24 my-12 max-sm:m-8">
      <HeaderUser />
      <h2 className="text-center text-2xl max-sm:text-lg font-bold">
        Mes statistiques
      </h2>
      <div className="w-full h-full flex flex-col items-center gap-[100px] px-[100px] py-2.5">
        {/* Jeux */}
        <div className="flex flex-wrap justify-center items-center gap-5">
          <div className="w-[250px] flex flex-col items-center gap-2.5 p-5 bg-white dark:bg-gray-900 border border-black dark:border-white shadow-xl dark:shadow-white/10 rounded-xl">
            <div className="flex flex-col items-center justify-center gap-2.5">
              <p>Dans ma bibliothèque</p>
              <p>102</p>
            </div>
          </div>
          <div className="w-[250px] flex flex-col items-center gap-2.5 p-5 bg-white dark:bg-gray-900 border border-black dark:border-white shadow-xl dark:shadow-white/10 rounded-xl">
            <div className="flex flex-col items-center justify-center gap-2.5">
              <p>Jeux terminés</p>
              <p>43</p>
            </div>
          </div>
          <div className="w-[250px] flex flex-col items-center gap-2.5 p-5 bg-white dark:bg-gray-900 border border-black dark:border-white shadow-xl dark:shadow-white/10 rounded-xl">
            <div className="flex flex-col items-center justify-center gap-2.5">
              <p>Jeux en cours</p>
              <p>12</p>
            </div>
          </div>
          <div className="w-[250px] flex flex-col items-center gap-2.5 p-5 bg-white dark:bg-gray-900 border border-black dark:border-white shadow-xl dark:shadow-white/10 rounded-xl">
            <div className="flex flex-col items-center justify-center gap-2.5">
              <p>Jeux abandonnées</p>
              <p>24</p>
            </div>
          </div>
          <div className="w-[250px] flex flex-col items-center gap-2.5 p-5 bg-white dark:bg-gray-900 border border-black dark:border-white shadow-xl dark:shadow-white/10 rounded-xl">
            <div className="flex flex-col items-center justify-center gap-2.5">
              <p>Jeux non commencés</p>
              <p>18</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between"></div>
      </div>
    </div>
  );
}
